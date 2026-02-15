"use client";

import { useState } from "react";
import { Bell, X, Check } from "lucide-react";
import { useNotificationStore } from "@/stores/notification-store";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, removeNotification } =
    useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "driver_found":
        return "🚗";
      case "driver_arriving":
        return "📍";
      case "driver_arrived":
        return "✅";
      case "ride_started":
        return "🚀";
      case "ride_completed":
        return "🏁";
      case "payment_processed":
        return "💳";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "driver_found":
      case "ride_started":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800";
      case "driver_arriving":
      case "driver_arrived":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
      case "payment_processed":
        return "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800";
      case "ride_completed":
        return "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-2xl shadow-lg z-50 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getNotificationColor(
                      notification.type
                    )} cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => {
                      markAsRead(notification.id);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Dismiss notification"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
