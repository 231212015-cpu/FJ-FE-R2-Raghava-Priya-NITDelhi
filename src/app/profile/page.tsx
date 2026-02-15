"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  User,
  MapPin,
  CreditCard,
  Star,
  Car,
  Edit2,
  ChevronRight,
  Shield,
  Gift,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRideStore } from "@/stores/ride-store";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { loyaltyPoints, pointsPerRide } = useRideStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const stats = [
    { label: "Total Rides", value: "48", icon: Car },
    { label: "Rating", value: "4.9", icon: Star },
    { label: "Loyalty Points", value: loyaltyPoints.toString(), icon: Gift },
    { label: "Member Since", value: "2024", icon: Shield },
  ];

  const menuItems = [
    { label: "Payment Methods", icon: CreditCard, href: "/payment" },
    { label: "Saved Places", icon: MapPin, href: "/places" },
    { label: "Privacy & Security", icon: Shield, href: "/privacy" },
  ];

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pt-4 pb-20 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-primary-foreground">
            My Profile
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Edit2 className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 sm:px-6 -mt-16">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-primary overflow-hidden border-4 border-background">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-foreground text-3xl font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
            {!isEditing && (
              <>
                <h2 className="text-xl font-bold text-foreground">
                  {user?.name || "User"}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </>
            )}
          </div>

          {/* Edit Form or Stats */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-12 rounded-full border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-3 bg-muted rounded-xl"
                  >
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Loyalty Rewards Card */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-primary-foreground">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    <h3 className="font-semibold">Loyalty Rewards</h3>
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {loyaltyPoints >= 100 ? "10% OFF" : "Earn More"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Current Points</span>
                    <span className="font-bold">{loyaltyPoints} pts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Points per ride</span>
                    <span className="font-medium">+{pointsPerRide} pts</span>
                  </div>
                  {loyaltyPoints < 100 && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs opacity-90">
                        Earn {100 - loyaltyPoints} more points to unlock 10% discount on all rides!
                      </p>
                      <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{ width: `${(loyaltyPoints / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {loyaltyPoints >= 100 && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs opacity-90">
                        🎉 Congratulations! You've unlocked 10% discount on all rides!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">
                      {user?.email || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">
                      {user?.phone || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Menu Items */}
        {!isEditing && (
          <div className="mt-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="flex-1 text-left font-medium text-foreground">
                  {item.label}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
