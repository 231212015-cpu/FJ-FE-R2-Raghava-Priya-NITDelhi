// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

// Ride types
export type RideType = "economy" | "auto" | "premium" | "suv" | "bike";

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  driverName?: string;
  driverAvatar?: string;
  driverRating?: number;
  pickup: Location;
  destination: Location;
  rideType: RideType;
  fare: number;
  sharedRide?: boolean;
  splitCount?: number;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
  completedAt?: string;
  rating?: number;
  feedback?: string;
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "wallet";
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

// Chat types
export interface Message {
  id: string;
  rideId: string;
  senderId: string;
  senderType: "user" | "driver";
  content: string;
  timestamp: string;
}

// Notification types
export interface Notification {
  id: string;
  type: "ride_update" | "payment" | "promo" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
