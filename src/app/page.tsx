"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 2.5 seconds before navigating
    const timer = setTimeout(() => {
      setShowSplash(false);
      const hasOnboarded = localStorage.getItem("hasOnboarded");
      
      if (!hasOnboarded) {
        router.push("/onboarding");
      } else if (!isAuthenticated) {
        router.push("/auth/signin");
      } else {
        router.push("/home");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Always show splash screen
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 animate-fade-in">
        {/* Illustration */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          <Image
            src="/assets/woman-taxi.svg"
            alt="BluRide"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            BluRide
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Your ride, your way
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex gap-1.5 mt-4">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Version */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-gray-400 text-xs">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}
