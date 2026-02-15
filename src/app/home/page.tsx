"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  MapPin,
  Search,
  Car,
  Bike,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRideStore } from "@/stores/ride-store";
import SideMenu from "@/components/layout/SideMenu";
import { NotificationCenter } from "@/components/common/NotificationCenter";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import("@/components/common/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
      <span className="text-muted-foreground">Loading map...</span>
    </div>
  ),
});

const transportTypes = [
  { id: "car", name: "Car", icon: Car, color: "bg-primary" },
  { id: "auto", name: "Auto", icon: Car, color: "bg-green-500" },
  { id: "bike", name: "Bike", icon: Bike, color: "bg-blue-500" },
];

const recentLocations = [
  {
    id: 1,
    name: "Office",
    address: "Cyber City, Gurugram",
    icon: "🏢",
    image: null,
  },
  {
    id: 2,
    name: "Home",
    address: "Vasant Kunj, New Delhi",
    icon: null,
    image: "/assets/home.svg",
  },
  {
    id: 3,
    name: "Gym",
    address: "Gold's Gym, Hauz Khas",
    icon: null,
    image: "/assets/gym.svg",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState("car");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated, router]);

  const handleLocationSearch = () => {
    router.push("/booking/location");
  };

  const handleRecentLocation = (location: typeof recentLocations[0]) => {
    router.push(`/booking/location?destination=${encodeURIComponent(location.address)}`);
  };

  if (!mounted || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapView />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="p-4 sm:p-6 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(true)}
            className="w-12 h-12 rounded-full bg-background shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            <div className="w-12 h-12 rounded-full bg-primary overflow-hidden">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-foreground font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spacer to push content down */}
        <div className="flex-1" />

        {/* Bottom Sheet */}
        <div className="bg-background rounded-t-3xl shadow-2xl p-6 space-y-6 animate-slide-up">
          {/* Greeting */}
          <div>
            <p className="text-muted-foreground text-sm">Good morning</p>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {user?.name || "User"} 👋
            </h1>
          </div>

          {/* Search Input */}
          <button
            onClick={handleLocationSearch}
            className="w-full flex items-center gap-3 p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <span className="text-muted-foreground text-left flex-1">
              Where would you like to go?
            </span>
          </button>

          {/* Transport Types */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
            {transportTypes.map((transport) => (
              <button
                key={transport.id}
                onClick={() => setSelectedTransport(transport.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  selectedTransport === transport.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <transport.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{transport.name}</span>
              </button>
            ))}
          </div>

          {/* Recent Locations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Recent Places</h2>
              <button className="text-sm text-primary font-medium hover:underline">
                See All
              </button>
            </div>
            <div className="space-y-2">
              {recentLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleRecentLocation(location)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-background flex items-center justify-center text-lg overflow-hidden">
                    {location.image ? (
                      <Image
                        src={location.image}
                        alt={location.name}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    ) : (
                      location.icon
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{location.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {location.address}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Current Ride Banner (if any) */}
          <CurrentRideBanner />
        </div>
      </div>

      {/* Side Menu */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

function CurrentRideBanner() {
  const { currentRide } = useRideStore();
  const router = useRouter();

  if (!currentRide || currentRide.status === "completed" || currentRide.status === "cancelled") {
    return null;
  }

  return (
    <button
      onClick={() => router.push("/booking/tracking")}
      className="w-full bg-primary rounded-2xl p-4 flex items-center gap-4 animate-pulse-slow"
    >
      <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
        <Car className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-primary-foreground font-semibold">Ride in Progress</p>
        <p className="text-primary-foreground/80 text-sm">
          {currentRide.driverName} is on the way
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-primary-foreground" />
    </button>
  );
}
