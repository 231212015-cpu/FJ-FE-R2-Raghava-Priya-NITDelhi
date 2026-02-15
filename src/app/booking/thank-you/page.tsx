"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Home, Clock, Share2, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";
import { useRideStore } from "@/stores/ride-store";
import { useNotificationStore } from "@/stores/notification-store";
import { toast } from "sonner";

export default function ThankYouPage() {
  const router = useRouter();
  const { loyaltyPoints, pointsPerRide } = useRideStore();
  const { addNotification } = useNotificationStore();
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1e3a8a", "#3b82f6", "#60a5fa"],
    });

    // Add payment processed notification
    addNotification({
      type: "payment_processed",
      title: "Payment Successful",
      message: "Your payment has been processed securely",
    });
    toast.success("Payment processed successfully");

    // Add ride completed notification
    addNotification({
      type: "ride_completed",
      title: "Ride Completed",
      message: `You've earned ${pointsPerRide} loyalty points!`,
    });

    const timer = setTimeout(() => setShowReward(true), 350);
    return () => clearTimeout(timer);
  }, [addNotification, pointsPerRide]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-8">
        {/* Reward Popup */}
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm transition-all duration-300 ${
            showReward
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-3 pointer-events-none"
          }`}
        >
          <div className="relative bg-card border border-border rounded-2xl p-4 shadow-xl">
            <button
              onClick={() => setShowReward(false)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              aria-label="Close reward"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">
                  Reward earned
                </p>
                <p className="text-sm text-muted-foreground">
                  +{pointsPerRide} points added • {loyaltyPoints} total
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Illustration */}
        <div className="relative w-56 h-56 mx-auto">
          <Image
            src="/assets/taxi-arrived.svg"
            alt="Thank you"
            fill
            className="object-contain"
          />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Thank You!</h1>
          <p className="text-muted-foreground">
            Your ride has been completed successfully. We hope you enjoyed your trip!
          </p>
        </div>

        {/* Receipt Card */}
        <div className="bg-card border border-border rounded-2xl p-6 text-left">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-primary" />
            <span className="font-semibold text-foreground">Payment Successful</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-medium text-foreground">
                #RF{Date.now().toString().slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-primary/10 rounded-2xl p-4">
          <p className="text-sm text-foreground font-medium mb-2">
            🎉 Share & Earn!
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Refer a friend and get ₹100 off your next ride
          </p>
          <button className="flex items-center justify-center gap-2 text-primary font-medium text-sm hover:underline mx-auto">
            <Share2 className="w-4 h-4" />
            Share Referral Code
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => router.push("/home")}
            className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={() => router.push("/history")}
            className="w-full h-14 rounded-full border border-border font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            View Ride History
          </button>
        </div>
      </div>
    </div>
  );
}
