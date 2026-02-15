"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Globe,
  Lock,
  HelpCircle,
  FileText,
  Shield,
  Trash2,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };

  const settingsGroups = [
    {
      title: "Preferences",
      items: [
        {
          id: "theme",
          label: "Dark Mode",
          icon: theme === "dark" ? Moon : Sun,
          type: "toggle",
          value: theme === "dark",
          onChange: () => setTheme(theme === "dark" ? "light" : "dark"),
        },
        {
          id: "notifications",
          label: "Push Notifications",
          icon: Bell,
          type: "toggle",
          value: notifications,
          onChange: () => setNotifications(!notifications),
        },
        {
          id: "location",
          label: "Location Services",
          icon: Globe,
          type: "toggle",
          value: locationServices,
          onChange: () => setLocationServices(!locationServices),
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          id: "password",
          label: "Change Password",
          icon: Lock,
          type: "link",
          href: "/settings/password",
        },
        {
          id: "privacy",
          label: "Privacy Settings",
          icon: Shield,
          type: "link",
          href: "/settings/privacy",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          id: "help",
          label: "Help Center",
          icon: HelpCircle,
          type: "link",
          href: "/help",
        },
        {
          id: "terms",
          label: "Terms of Service",
          icon: FileText,
          type: "link",
          href: "/terms",
        },
        {
          id: "privacy-policy",
          label: "Privacy Policy",
          icon: FileText,
          type: "link",
          href: "/privacy",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          id: "delete",
          label: "Delete Account",
          icon: Trash2,
          type: "danger",
          onClick: () => setShowDeleteModal(true),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 sm:p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              {group.title}
            </h3>
            <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
              {group.items.map((item: any) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 ${
                    item.type === "link" || item.type === "danger"
                      ? "cursor-pointer hover:bg-muted transition-colors"
                      : ""
                  }`}
                  onClick={() => {
                    if (item.type === "link" && item.href) {
                      router.push(item.href);
                    } else if (item.type === "danger" && item.onClick) {
                      item.onClick();
                    }
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === "danger"
                        ? "bg-destructive/10"
                        : "bg-primary/10"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        item.type === "danger"
                          ? "text-destructive"
                          : "text-primary"
                      }`}
                    />
                  </div>
                  <span
                    className={`flex-1 font-medium ${
                      item.type === "danger"
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.type === "toggle" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onChange();
                      }}
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        item.value ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          item.value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  )}
                  {item.type === "link" && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-card border border-border rounded-2xl hover:bg-muted transition-colors text-destructive font-medium"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        {/* App Version */}
        <p className="text-center text-sm text-muted-foreground">
          BluRide v1.0.0
        </p>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 p-6 animate-slide-up safe-area-bottom">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Delete Account?
              </h3>
              <p className="text-muted-foreground">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-12 rounded-full border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success("Account deletion requested");
                    setShowDeleteModal(false);
                  }}
                  className="flex-1 h-12 rounded-full bg-destructive text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
