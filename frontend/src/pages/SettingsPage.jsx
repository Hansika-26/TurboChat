import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { Send, Bell, Type, Palette, Lock } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { fontSize, setFontSize, soundEnabled, setSoundEnabled, enableNotifications, setEnableNotifications, showPreviews, setShowPreviews } = useSettingsStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">

        {/* Appearance Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="size-4" /> Appearance
          </h2>
          <p className="text-sm text-base-content/70">Customize the look and feel of your chat</p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        <div className="divider"></div>

        {/* Preferences Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Type className="size-4" /> Preferences
          </h2>
          <p className="text-sm text-base-content/70">Adjust functionality and accessibility</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Bell className="size-4 text-primary" /> Notifications
              </h3>
              <div className="flex flex-col gap-3 mt-2">
                <div className="form-control">
                  <label className="label cursor-pointer p-0">
                    <span className="label-text">Enable Sound</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer p-0">
                    <span className="label-text">Show Popup Alerts</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={enableNotifications}
                      onChange={(e) => setEnableNotifications(e.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Font Size */}
          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-4">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Lock className="size-4 text-primary" /> Privacy
                </h3>
                <div className="form-control mt-2">
                  <label className="label cursor-pointer p-0">
                    <span className="label-text">Show Message Previews</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={showPreviews}
                      onChange={(e) => setShowPreviews(e.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-4">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Type className="size-4 text-primary" /> Font Size
                </h3>
                <div className="flex gap-2 mt-2">
                  {["small", "medium", "large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 btn btn-sm ${fontSize === size ? "btn-primary" : "btn-outline"}`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3 mt-4">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;