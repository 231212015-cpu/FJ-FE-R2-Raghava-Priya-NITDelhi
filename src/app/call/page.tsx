"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
} from "lucide-react";

const mockDriver = {
  name: "Rajesh Kumar",
  avatar: "/assets/avatar-male-2.svg",
  phone: "+91 98765 43210",
};

export default function CallPage() {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<"calling" | "connected" | "ended">(
    "calling"
  );
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // Simulate call connection
  useEffect(() => {
    if (callStatus === "calling") {
      const timer = setTimeout(() => {
        setCallStatus("connected");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [callStatus]);

  // Call duration timer
  useEffect(() => {
    if (callStatus === "connected") {
      const interval = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/90 to-primary flex flex-col items-center justify-between p-6">
      {/* Top Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Avatar */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-white/20 overflow-hidden border-4 border-white/30">
            <Image
              src={mockDriver.avatar}
              alt={mockDriver.name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          {callStatus === "calling" && (
            <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping" />
          )}
        </div>

        {/* Name */}
        <h1 className="text-2xl font-bold text-white mb-2">{mockDriver.name}</h1>

        {/* Status */}
        <p className="text-white/80 text-lg">
          {callStatus === "calling"
            ? "Calling..."
            : callStatus === "connected"
            ? formatDuration(duration)
            : "Call ended"}
        </p>

        {/* Connection animation */}
        {callStatus === "calling" && (
          <div className="flex gap-1 mt-4">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-sm space-y-8">
        {/* Action buttons */}
        {callStatus === "connected" && (
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? "bg-white text-primary" : "bg-white/20 text-white"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isSpeaker ? "bg-white text-primary" : "bg-white/20 text-white"
              }`}
            >
              {isSpeaker ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={() => router.push("/chat")}
              className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* End call button */}
        <div className="flex justify-center">
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        </div>

        {/* Label */}
        <p className="text-center text-white/60 text-sm">
          {callStatus === "connected" ? "Tap to end call" : ""}
        </p>
      </div>
    </div>
  );
}
