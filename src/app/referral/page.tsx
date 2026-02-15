"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  Gift,
  Users,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

const referralCode = "RIDE2024XYZ";

const rewards = [
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Share Your Code",
    description: "Send your unique code to friends",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Friend Signs Up",
    description: "They get ₹100 off their first ride",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "You Earn ₹100",
    description: "After their first completed ride",
  },
];

const referralHistory = [
  { name: "Rahul S.", date: "Feb 10, 2025", reward: 100, status: "completed" },
  { name: "Neha M.", date: "Feb 8, 2025", reward: 100, status: "completed" },
  { name: "Arjun R.", date: "Feb 5, 2025", reward: 100, status: "pending" },
];

export default function ReferralPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join BluRide!",
          text: `Use my referral code ${referralCode} to get ₹100 off your first ride!`,
          url: "https://bluride.app",
        });
      } catch (err) {
        handleCopyCode();
      }
    } else {
      handleCopyCode();
    }
  };

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
          <h1 className="text-xl font-bold text-foreground">Refer & Earn</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          {/* Background illustration */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <Image
              src="/assets/speech-taxi.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
              <Gift className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Give ₹100, Get ₹100</h2>
            <p className="text-white/80 mb-6">
              Invite friends and earn rewards when they take their first ride
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-white/80">Invites Sent</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-white/80">Completed</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-2xl font-bold">₹300</p>
                <p className="text-xs text-white/80">Earned</p>
              </div>
            </div>

            {/* Code Box */}
            <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className="flex-1 font-mono font-bold tracking-widest text-lg">
                {referralCode}
              </div>
              <button
                onClick={handleCopyCode}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                copied ? "bg-green-500" : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full h-14 rounded-xl bg-card border border-border font-semibold flex items-center justify-center gap-3 hover:bg-muted transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Share with Friends
        </button>

        {/* How it Works */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">How It Works</h3>
          <div className="space-y-4">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center relative">
                  {reward.icon}
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{reward.title}</h4>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral History */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Referral History</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {referralHistory.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No referrals yet. Share your code to get started!
              </div>
            ) : (
              <div className="divide-y divide-border">
                {referralHistory.map((referral, index) => (
                  <div
                    key={index}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground">
                        {referral.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{referral.name}</p>
                        <p className="text-sm text-muted-foreground">{referral.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-500">+${referral.reward}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          referral.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                        }`}
                      >
                        {referral.status === "completed" ? "Earned" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
