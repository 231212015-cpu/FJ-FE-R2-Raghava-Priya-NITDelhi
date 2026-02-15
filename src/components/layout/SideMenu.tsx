"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  X,
  Home,
  Clock,
  Heart,
  Percent,
  Gift,
  AlertCircle,
  Info,
  Settings,
  LogOut,
  Moon,
  Sun,
  HelpCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "next-themes";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: "home", label: "Home", icon: Home, href: "/home" },
  { id: "history", label: "History", icon: Clock, href: "/history" },
  { id: "favorites", label: "Favourites", icon: Heart, href: "/favorites" },
  { id: "offers", label: "Offers", icon: Percent, href: "/offers" },
  { id: "referral", label: "Referral", icon: Gift, href: "/referral" },
  { id: "complain", label: "Complain", icon: AlertCircle, href: "/complain" },
  { id: "about", label: "About Us", icon: Info, href: "/about" },
  { id: "help", label: "Help & Support", icon: HelpCircle, href: "/help" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const prevPathRef = useRef(pathname);

  // Close menu on route change (but not on initial mount)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      onClose();
      prevPathRef.current = pathname;
    }
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-background z-50 shadow-2xl animate-slide-in-left flex flex-col">
        {/* Header */}
        <div className="p-6 bg-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-background overflow-hidden border-2 border-background">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary text-xl font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">
                  {user?.name || "User"}
                </h3>
                <p className="text-primary-foreground/80 text-sm">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
            >
              <X className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>

          {/* Profile link */}
          <Link
            href="/profile"
            className="text-primary-foreground/80 text-sm hover:text-primary-foreground hover:underline"
          >
            View Profile →
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-4 px-6 py-3 transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-r-4 border-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 px-6 py-3 text-foreground hover:bg-muted transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="font-medium">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>

        {/* App Version */}
        <div className="px-6 pb-4">
          <p className="text-xs text-muted-foreground text-center">
            BluRide v1.0.0
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
