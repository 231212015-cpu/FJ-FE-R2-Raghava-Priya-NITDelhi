import { create } from "zustand";

export interface RideNotification {
  id: string;
  type: "driver_found" | "driver_arriving" | "driver_arrived" | "ride_started" | "ride_completed" | "payment_processed";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationState {
  notifications: RideNotification[];
  addNotification: (notification: Omit<RideNotification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
    })),
}));
