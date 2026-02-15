import { create } from "zustand";
import type { Ride, Location, RideType } from "@/types";

interface RideState {
  currentRide: Ride | null;
  rideHistory: Ride[];
  pickup: Location | null;
  destination: Location | null;
  selectedRideType: RideType;
  estimatedFare: number;
  sharedRide: boolean;
  splitCount: number;
  loyaltyPoints: number;
  pointsPerRide: number;
  isLoading: boolean;
  setPickup: (location: Location) => void;
  setDestination: (location: Location) => void;
  setRideType: (type: RideType) => void;
  setSharedRide: (shared: boolean) => void;
  setSplitCount: (count: number) => void;
  getLoyaltyDiscountPercent: () => number;
  applyLoyaltyDiscount: (fare: number) => number;
  calculateFare: () => void;
  bookRide: () => Promise<void>;
  cancelRide: () => void;
  completeRide: (rating: number, feedback?: string) => void;
  loadRideHistory: () => Promise<void>;
}

const FARE_RATES: Record<RideType, number> = {
  economy: 1.5,
  premium: 2.5,
  suv: 3.0,
  bike: 0.8,
};

const LOYALTY_DISCOUNT_PERCENT = 10;
const LOYALTY_DISCOUNT_THRESHOLD = 100;

export const useRideStore = create<RideState>((set, get) => ({
  currentRide: null,
  rideHistory: [],
  pickup: null,
  destination: null,
  selectedRideType: "economy",
  estimatedFare: 0,
  sharedRide: false,
  splitCount: 2,
  loyaltyPoints: 40,
  pointsPerRide: 20,
  isLoading: false,

  setPickup: (location) => {
    set({ pickup: location });
    get().calculateFare();
  },

  setDestination: (location) => {
    set({ destination: location });
    get().calculateFare();
  },

  setRideType: (type) => {
    set({ selectedRideType: type });
    get().calculateFare();
  },

  setSharedRide: (shared) => {
    set({ sharedRide: shared });
  },

  setSplitCount: (count) => {
    set({ splitCount: Math.max(2, Math.min(4, count)) });
  },

  getLoyaltyDiscountPercent: () => {
    const { loyaltyPoints } = get();
    return loyaltyPoints >= LOYALTY_DISCOUNT_THRESHOLD
      ? LOYALTY_DISCOUNT_PERCENT
      : 0;
  },

  applyLoyaltyDiscount: (fare) => {
    const discountPercent = get().getLoyaltyDiscountPercent();
    if (!discountPercent) {
      return fare;
    }
    return Math.round(fare * (1 - discountPercent / 100) * 100) / 100;
  },

  calculateFare: () => {
    const { pickup, destination, selectedRideType } = get();
    if (!pickup || !destination) {
      set({ estimatedFare: 0 });
      return;
    }

    // Calculate distance (simplified)
    const distance = Math.sqrt(
      Math.pow(destination.lat - pickup.lat, 2) +
        Math.pow(destination.lng - pickup.lng, 2)
    ) * 111; // Convert to km approximately

    const baseFare = 5;
    const fare = baseFare + distance * FARE_RATES[selectedRideType];
    set({ estimatedFare: Math.round(fare * 100) / 100 });
  },

  bookRide: async () => {
    set({ isLoading: true });
    const {
      pickup,
      destination,
      selectedRideType,
      estimatedFare,
      sharedRide,
      splitCount,
      applyLoyaltyDiscount,
    } = get();
    
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const ride: Ride = {
      id: Date.now().toString(),
      userId: "1",
      driverId: "driver-1",
      driverName: "Michael Smith",
      driverAvatar: "/assets/driver.png",
      driverRating: 4.8,
      pickup: pickup!,
      destination: destination!,
      rideType: selectedRideType,
      fare: applyLoyaltyDiscount(estimatedFare),
      sharedRide,
      splitCount: sharedRide ? splitCount : undefined,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    set({ currentRide: ride, isLoading: false });
  },

  cancelRide: () => {
    set((state) => ({
      currentRide: state.currentRide
        ? { ...state.currentRide, status: "cancelled" }
        : null,
    }));
  },

  completeRide: (rating, feedback) => {
    set((state) => {
      const updatedPoints = state.loyaltyPoints + state.pointsPerRide;
      const completedRide = state.currentRide
        ? {
            ...state.currentRide,
            status: "completed" as const,
            completedAt: new Date().toISOString(),
            rating,
            feedback,
          }
        : null;

      return {
        currentRide: null,
        rideHistory: completedRide
          ? [completedRide, ...state.rideHistory]
          : state.rideHistory,
        pickup: null,
        destination: null,
        estimatedFare: 0,
        sharedRide: false,
        splitCount: 2,
        loyaltyPoints: updatedPoints,
      };
    });
  },

  loadRideHistory: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock ride history
    const mockHistory: Ride[] = [
      {
        id: "ride-1",
        userId: "1",
        driverId: "driver-1",
        driverName: "Rajesh Kumar",
        driverRating: 4.9,
        pickup: { lat: 28.6139, lng: 77.209, address: "Connaught Place, New Delhi" },
        destination: { lat: 28.5535, lng: 77.2588, address: "Nehru Place, New Delhi" },
        rideType: "premium",
        fare: 450,
        status: "completed",
        createdAt: "2026-02-13T10:30:00Z",
        completedAt: "2026-02-13T11:00:00Z",
        rating: 5,
      },
      {
        id: "ride-2",
        userId: "1",
        driverId: "driver-2",
        driverName: "Priya Sharma",
        driverRating: 4.7,
        pickup: { lat: 28.5562, lng: 77.1, address: "IGI Airport Terminal 3, Delhi" },
        destination: { lat: 28.6304, lng: 77.2177, address: "India Gate, New Delhi" },
        rideType: "economy",
        fare: 650,
        status: "completed",
        createdAt: "2026-02-10T14:00:00Z",
        completedAt: "2026-02-10T15:30:00Z",
        rating: 4,
      },
    ];

    set({ rideHistory: mockHistory, isLoading: false });
  },
}));
