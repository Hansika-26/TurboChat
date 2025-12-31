import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingsStore } from "../store/useSettingsStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, RefreshCw } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { showPreviews } = useSettingsStore();

  useEffect(() => {
    getUsers();
  }, [getUsers, onlineUsers]);

  // Use onlineUsers to force re-render, though not needed in dependency unless we filter
  console.log("Sidebar onlineUsers:", onlineUsers);

  // Sort users: 1. By Last Message (Newest First)
  // Also safety filter: ensure authUser is not in the list
  const { authUser } = useAuthStore();

  const filteredUsersRaw = users.filter(u => u._id !== authUser?._id);

  const sortedUsers = [...filteredUsersRaw].sort((a, b) => {
    // Priority 1: Online status
    const isOnlineA = onlineUsers.includes(a._id);
    const isOnlineB = onlineUsers.includes(b._id);
    if (isOnlineA && !isOnlineB) return -1;
    if (!isOnlineA && isOnlineB) return 1;

    // Priority 2: Last Message Time
    const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          <button onClick={() => getUsers()} className="btn btn-ghost btn-circle btn-sm">
            <RefreshCw className="size-4" />
          </button>
        </div>
        {/* TODO: Online filter toggle */}
        {/* Online filter removed as per request */}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {sortedUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.name || (user.fullname || user.fullName || "User").split(" ")[0]}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
              {/* Optional: Show last message preview? The user requested it. */}
              {user.lastMessage && (
                <div className="text-xs text-zinc-500 truncate mt-1">
                  {showPreviews ? (user.lastMessage.text || "📷 Image") : "Message hidden"}
                </div>
              )}
              {unreadMessages[user._id] > 0 && (
                <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                  {unreadMessages[user._id]}
                </span>
              )}
            </div>
          </button>
        ))}

        {sortedUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No contacts found</div>
        )}
      </div>
    </aside>
  );

};

export default Sidebar;