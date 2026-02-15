"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ThumbsUp, Gift, Home } from "lucide-react";
import { useRideStore } from "@/stores/ride-store";
import { toast } from "sonner";

const tips = [
  { amount: 0, label: "No Tip" },
  { amount: 20, label: "₹20" },
  { amount: 50, label: "₹50" },
  { amount: 100, label: "₹100" },
];

const compliments = [
  "Great driving",
  "Clean car",
  "Friendly",
  "Good conversation",
  "Safe driver",
  "On time",
];

const mockDriver = {
  name: "Rajesh Kumar",
  avatar: "/assets/avatar-male-2.svg",
};

export default function CompletePage() {
  const router = useRouter();
  const { currentRide, completeRide, estimatedFare } = useRideStore();
  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState(0);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");

  const handleCompliment = (compliment: string) => {
    setSelectedCompliments((prev) =>
      prev.includes(compliment)
        ? prev.filter((c) => c !== compliment)
        : [...prev, compliment]
    );
  };

  const handleSubmit = () => {
    completeRide(rating, feedback);
    toast.success("Thanks for your feedback!");
    router.push("/booking/thank-you");
  };

  const fare = currentRide?.fare || estimatedFare || 15.5;
  const sharedRide = currentRide?.sharedRide;
  const splitCount = currentRide?.splitCount || 2;
  const perPersonFare = sharedRide ? fare / splitCount : fare;
  const total = perPersonFare + selectedTip;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Ride Completed!
          </h1>
          <p className="text-muted-foreground">
            You&apos;ve arrived at your destination
          </p>
        </div>

        {/* Fare Summary */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Trip fare</span>
            <span className="font-semibold text-foreground">${fare.toFixed(2)}</span>
          </div>
          {sharedRide && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">
                Your share ({splitCount} riders)
              </span>
              <span className="font-semibold text-foreground">
                ${perPersonFare.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Tip</span>
            <span className="font-semibold text-foreground">${selectedTip.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Driver Rating */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary overflow-hidden">
              <Image
                src={mockDriver.avatar}
                alt={mockDriver.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{mockDriver.name}</h3>
              <p className="text-sm text-muted-foreground">How was your ride?</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Compliments */}
          <div className="flex flex-wrap gap-2 mb-4">
            {compliments.map((compliment) => (
              <button
                key={compliment}
                onClick={() => handleCompliment(compliment)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCompliments.includes(compliment)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {compliment}
              </button>
            ))}
          </div>

          {/* Feedback Input */}
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add a comment (optional)"
            rows={3}
            className="w-full p-4 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tip Selection */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Add a tip for {mockDriver.name}
          </h3>
          <div className="flex gap-3">
            {tips.map((tip) => (
              <button
                key={tip.amount}
                onClick={() => setSelectedTip(tip.amount)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  selectedTip === tip.amount
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-6 border-t border-border safe-area-bottom">
        <button
          onClick={handleSubmit}
          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Submit Rating & Pay ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
