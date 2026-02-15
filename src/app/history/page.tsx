"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  Car,
  X,
  Check,
} from "lucide-react";

type TabType = "upcoming" | "completed" | "cancelled";

// Mock ride history data
const mockRides = {
  upcoming: [
    {
      id: "1",
      date: "Today, 3:00 PM",
      pickup: "Connaught Place, Delhi",
      destination: "Saket Mall, Delhi",
      fare: 280,
      status: "confirmed",
      driver: {
        name: "Priya Sharma",
        avatar: "/assets/43_Profile.svg",
        rating: 4.8,
        carModel: "Honda City",
        carNumber: "DL 01 AB 5678",
      },
    },
  ],
  completed: [
    {
      id: "2",
      date: "Yesterday, 5:30 PM",
      pickup: "IGI Airport Terminal 3",
      destination: "Taj Palace Hotel, Delhi",
      fare: 580,
      status: "completed",
      rating: 5,
      driver: {
        name: "Rajesh Kumar",
        avatar: "/assets/43_Profile.svg",
        rating: 4.9,
        carModel: "Maruti Dzire",
        carNumber: "DL 02 CD 1234",
      },
    },
    {
      id: "3",
      date: "Feb 12, 2026, 10:00 AM",
      pickup: "Home",
      destination: "Office",
      fare: 185,
      status: "completed",
      rating: 4,
      driver: {
        name: "Amit Patel",
        avatar: "/assets/43_Profile.svg",
        rating: 4.7,
        carModel: "Hyundai Verna",
        carNumber: "MH 01 EF 9012",
      },
    },
    {
      id: "4",
      date: "Feb 10, 2026, 8:15 PM",
      pickup: "Khan Market",
      destination: "Home",
      fare: 220,
      status: "completed",
      rating: 5,
      driver: {
        name: "Sunita Verma",
        avatar: "/assets/43_Profile.svg",
        rating: 4.9,
        carModel: "Toyota Innova",
        carNumber: "DL 03 GH 3456",
      },
    },
  ],
  cancelled: [
    {
      id: "5",
      date: "Feb 8, 2026, 2:00 PM",
      pickup: "Select Citywalk Mall",
      destination: "Lajpat Nagar",
      fare: 150,
      status: "cancelled",
      cancelReason: "Driver took too long",
    },
  ],
};

export default function HistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("completed");

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: mockRides.upcoming.length },
    { id: "completed", label: "Completed", count: mockRides.completed.length },
    { id: "cancelled", label: "Cancelled", count: mockRides.cancelled.length },
  ];

  const currentRides = mockRides[activeTab];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <X className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-blue-500/10 text-blue-600";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Ride History</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1.5 text-xs">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {currentRides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <Car className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No rides yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              {activeTab === "upcoming"
                ? "You don't have any upcoming rides"
                : activeTab === "completed"
                ? "You haven't completed any rides yet"
                : "You haven't cancelled any rides"}
            </p>
            {activeTab !== "upcoming" && (
              <button
                onClick={() => router.push("/home")}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Book a Ride
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentRides.map((ride: any) => (
              <button
                key={ride.id}
                onClick={() => router.push(`/history/${ride.id}`)}
                className="w-full bg-card border border-border rounded-2xl p-4 text-left hover:border-primary/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {ride.date}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                      ride.status
                    )}`}
                  >
                    {getStatusIcon(ride.status)}
                    {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                  </span>
                </div>

                {/* Route */}
                <div className="flex gap-3 mb-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="w-0.5 flex-1 bg-border my-1" />
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-foreground truncate">
                      {ride.pickup}
                    </p>
                    <p className="text-sm text-foreground truncate">
                      {ride.destination}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  {ride.driver ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary overflow-hidden">
                        <Image
                          src={ride.driver.avatar}
                          alt={ride.driver.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {ride.driver.name}
                        </p>
                        {ride.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-muted-foreground">
                              You rated {ride.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {ride.cancelReason}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      ${ride.fare.toFixed(2)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
