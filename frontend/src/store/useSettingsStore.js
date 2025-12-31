import { create } from "zustand";

export const useSettingsStore = create((set) => ({
    fontSize: localStorage.getItem("chat-font-size") || "medium", // small, medium, large
    soundEnabled: localStorage.getItem("chat-sound-enabled") === "false" ? false : true,
    enableNotifications: localStorage.getItem("chat-notifications-enabled") === "false" ? false : true,
    showPreviews: localStorage.getItem("chat-previews-enabled") === "false" ? false : true,

    setFontSize: (size) => {
        localStorage.setItem("chat-font-size", size);
        set({ fontSize: size });
    },

    setSoundEnabled: (enabled) => {
        localStorage.setItem("chat-sound-enabled", enabled);
        set({ soundEnabled: enabled });
    },

    setEnableNotifications: (enabled) => {
        localStorage.setItem("chat-notifications-enabled", enabled);
        set({ enableNotifications: enabled });
    },

    setShowPreviews: (enabled) => {
        localStorage.setItem("chat-previews-enabled", enabled);
        set({ showPreviews: enabled });
    },
}));
