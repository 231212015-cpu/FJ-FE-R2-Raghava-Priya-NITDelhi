"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Car } from "lucide-react";
import { useRideStore } from "@/stores/ride-store";
import { useNotificationStore } from "@/stores/notification-store";
import { toast } from "sonner";

export default function SearchingPage() {
  const router = useRouter();
  const { currentRide, cancelRide } = useRideStore();
  const [searchTime, setSearchTime] = useState(0);
  const [dots, setDots] = useState("");

  // Simulate driver search
  useEffect(() => {
    const { addNotification } = useNotificationStore.getState();

    const timer = setInterval(() => {
      setSearchTime((t) => t + 1);
    }, 1000);

    const dotsTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);

    // Simulate finding a driver after 3-5 seconds
    const findDriver = setTimeout(() => {
      addNotification({
        type: "driver_found",
        title: "Driver Found!",
        message: "Rajesh Kumar is on the way to pick you up",
      });
      toast.success("Driver found! Rajesh Kumar will pick you up soon");
      router.push("/booking/driver-found");
    }, 3000 + Math.random() * 2000);

    return () => {
      clearInterval(timer);
      clearInterval(dotsTimer);
      clearTimeout(findDriver);
    };
  }, [router]);

  const handleCancel = () => {
    cancelRide();
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-8">
        {/* Animated Search with Illustration */}
        <div className="relative w-64 h-64 mx-auto">
          {/* Outer rings */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div
            className="absolute inset-6 rounded-full border-4 border-primary/30 animate-ping"
            style={{ animationDelay: "0.5s", animationDuration: '2s' }}
          />
          <div
            className="absolute inset-12 rounded-full border-4 border-primary/40 animate-ping"
            style={{ animationDelay: "1s", animationDuration: '2s' }}
          />

          {/* Car illustration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <Image
                src="/assets/auto-rickshaw.svg"
                alt="Searching"
                fill
                className="object-contain animate-bounce"
                style={{ animationDuration: '2s' }}
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Finding your driver{dots}
          </h1>
          <p className="text-muted-foreground">
            Please wait while we connect you with a nearby driver
          </p>
        </div>

        {/* Search time */}
        <div className="bg-muted rounded-2xl p-4">
          <p className="text-sm text-muted-foreground">Searching for</p>
          <p className="text-2xl font-bold text-foreground">
            {Math.floor(searchTime / 60)
              .toString()
              .padStart(2, "0")}
            :{(searchTime % 60).toString().padStart(2, "0")}
          </p>
        </div>

        {/* Tips */}
        <div className="space-y-2 text-left bg-primary/10 rounded-2xl p-4">
          <p className="font-medium text-foreground">💡 Did you know?</p>
          <p className="text-sm text-muted-foreground">
            BluRide drivers go through extensive background checks and training to ensure your safety.
          </p>
        </div>

        {/* Cancel button */}
        <button
          onClick={handleCancel}
          className="w-full h-14 rounded-full border-2 border-destructive text-destructive font-semibold hover:bg-destructive/10 transition-colors"
        >
          Cancel Search
        </button>
      </div>
    </div>
  );
}
