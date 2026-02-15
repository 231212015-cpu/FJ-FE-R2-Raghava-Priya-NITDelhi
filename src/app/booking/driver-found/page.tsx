"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Phone, MessageCircle, Car, Check } from "lucide-react";
import { useRideStore } from "@/stores/ride-store";
import { useNotificationStore } from "@/stores/notification-store";
import { toast } from "sonner";

const mockDriver = {
  id: "driver-1",
  name: "Michael Smith",
  avatar: "/assets/avatar-male-4.svg",
  rating: 4.9,
  trips: 1250,
  carModel: "Toyota Camry",
  carNumber: "ABC 1234",
  carColor: "White",
  eta: "3 min",
};

export default function DriverFoundPage() {
  const router = useRouter();
  const { currentRide } = useRideStore();
  const { addNotification } = useNotificationStore();
  const [showConfetti, setShowConfetti] = useState(true);
  const [otp, setOtp] = useState<number | null>(null);

  useEffect(() => {
    // Generate OTP on client side only to avoid hydration mismatch
    setOtp(Math.floor(1000 + Math.random() * 9000));

    // Show "driver arriving" notification after 2 seconds
    const arrivingTimer = setTimeout(() => {
      addNotification({
        type: "driver_arriving",
        title: "Driver Arriving Soon",
        message: `${mockDriver.name} is 2 minutes away`,
      });
      toast.info(`${mockDriver.name} is 2 minutes away`);
    }, 2000);

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 2000);

    return () => {
      clearTimeout(arrivingTimer);
      clearTimeout(confettiTimer);
    };
  }, [addNotification]);

  const handleContinue = () => {
    router.push("/booking/tracking");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Success Animation */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          {/* Check mark animation */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-primary animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-12 h-12 text-primary-foreground animate-bounce" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Driver Found!
            </h1>
            <p className="text-muted-foreground">
              Your driver is on the way to pick you up
            </p>
          </div>

          {/* Driver Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            {/* Driver Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary overflow-hidden">
                <Image
                  src={mockDriver.avatar}
                  alt={mockDriver.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground text-lg">
                  {mockDriver.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{mockDriver.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    • {mockDriver.trips} trips
                  </span>
                </div>
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-muted rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {mockDriver.carModel}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockDriver.carColor} • {mockDriver.carNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Arrives in</p>
                  <p className="font-semibold text-primary">{mockDriver.eta}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/chat")}
                className="flex-1 h-12 rounded-xl bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Message</span>
              </button>
              <button
                onClick={() => router.push("/call")}
                className="flex-1 h-12 rounded-xl bg-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5 text-primary-foreground" />
                <span className="font-medium text-primary-foreground">Call</span>
              </button>
            </div>
          </div>

          {/* OTP */}
          <div className="bg-primary/10 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">
              Share this OTP with your driver
            </p>
            <p className="text-3xl font-bold text-primary tracking-widest">
              {otp || "****"}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6 border-t border-border safe-area-bottom">
        <button
          onClick={handleContinue}
          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Track Your Ride
        </button>
      </div>
    </div>
  );
}
