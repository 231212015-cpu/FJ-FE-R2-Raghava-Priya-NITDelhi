import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock user data
        const user: User = {
          id: "1",
          email,
          name: "Vikram Singh",
          phone: "+91 98765 43210",
          avatar: "/assets/avatar-male-1.svg",
          createdAt: new Date().toISOString(),
        };
        
        set({
          user,
          token: "mock-jwt-token",
          isAuthenticated: true,
          isLoading: false,
        });
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const user: User = {
          id: "1",
          email,
          name,
          phone: "",
          avatar: "/assets/avatar-male-1.svg",
          createdAt: new Date().toISOString(),
        };
        
        set({
          user,
          token: "mock-jwt-token",
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
