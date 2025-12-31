import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useSettingsStore } from "./useSettingsStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async (showLoading = true) => {
    if (showLoading) set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });

      // Initialize unreadMessages from the response
      const unreadMap = res.data.reduce((acc, user) => {
        if (user.unreadCount > 0) {
          acc[user._id] = user.unreadCount;
        }
        return acc;
      }, {});
      set({ unreadMessages: unreadMap });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      if (showLoading) set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  unreadMessages: {}, // { userId: count }
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      const isMessageSentFromSelectedUser = selectedUser?._id === newMessage.senderId;

      if (isMessageSentFromSelectedUser) {
        set({
          messages: [...get().messages, newMessage],
        });
      } else {
        const { soundEnabled, enableNotifications } = useSettingsStore.getState();

        if (enableNotifications) {
          toast.success("New message received");
        }

        if (soundEnabled) {
          try {
            const audio = new Audio("/notification.mp3");
            audio.play().catch(err => console.log("Audio play failed:", err));
          } catch (error) {
            console.log("Sound error:", error);
          }
        }

        const { users, unreadMessages } = get();
        const senderExists = users.some((user) => user._id.toString() === newMessage.senderId.toString());

        if (!senderExists) {
          get().getUsers(false);
        } else {
          set({
            users: users.map((user) =>
              user._id.toString() === newMessage.senderId.toString()
                ? { ...user, lastMessage: newMessage }
                : user
            ),
          });
        }

        set({
          unreadMessages: {
            ...unreadMessages,
            [newMessage.senderId]: (unreadMessages[newMessage.senderId] || 0) + 1,
          },
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    if (selectedUser) {
      set((state) => ({
        unreadMessages: {
          ...state.unreadMessages,
          [selectedUser._id]: 0,
        },
      }));
    }
  },
}));