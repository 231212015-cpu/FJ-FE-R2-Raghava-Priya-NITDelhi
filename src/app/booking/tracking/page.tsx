"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Star,
  Navigation,
  Clock,
  MapPin,
  AlertCircle,
  X,
} from "lucide-react";
import { useRideStore } from "@/stores/ride-store";
import { a11y } from "@/lib/accessibility";
// import { subscribeToLocationUpdates } from "@/lib/socket-helper"; // Uncomment when Socket.io server is ready
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/common/MapView"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

const mockDriver = {
  id: "driver-1",
  name: "Michael Smith",
  avatar: "/assets/avatar-male-4.svg",
  rating: 4.9,
  carModel: "Toyota Camry",
  carNumber: "ABC 1234",
};

// Calculate distance between two coordinates (in km)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function TrackingPage() {
  const router = useRouter();
  const { currentRide, pickup, destination, cancelRide } = useRideStore();
  const [status, setStatus] = useState<"arriving" | "arrived" | "in-progress" | "completed">("arriving");
  const [eta, setEta] = useState(5);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const locationUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const [driverLocation, setDriverLocation] = useState({
    lat: (pickup?.lat || 37.7749) + 0.01,
    lng: (pickup?.lng || -122.4194) + 0.01,
  });
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Enhanced GPS simulation with realistic movement
  useEffect(() => {
    if (status === "arriving" && pickup) {
      // Calculate initial distance
      const initialDistance = calculateDistance(
        driverLocation.lat,
        driverLocation.lng,
        pickup.lat,
        pickup.lng
      );
      setDistance(initialDistance);

      locationUpdateRef.current = setInterval(() => {
        setDriverLocation((prev) => {
          // Simulate GPS updates with slight variations (like real GPS)
          const noise = () => (Math.random() - 0.5) * 0.0001; // Small GPS jitter
          const movementFactor = 0.15; // How fast driver moves toward destination
          
          const newLat = prev.lat - (prev.lat - pickup.lat) * movementFactor + noise();
          const newLng = prev.lng - (prev.lng - pickup.lng) * movementFactor + noise();
          
          // Calculate new distance and speed
          const newDistance = calculateDistance(newLat, newLng, pickup.lat, pickup.lng);
          const distanceTraveled = distance - newDistance;
          const currentSpeed = (distanceTraveled * 60).toFixed(1); // km/h (update every second)
          
          setDistance(newDistance);
          setSpeed(parseFloat(currentSpeed));
          
          // Update ETA based on distance and average speed
          const avgSpeed = 30; // km/h average city speed
          const newEta = Math.ceil((newDistance / avgSpeed) * 60); // minutes
          setEta(Math.max(1, newEta));
          
          return { lat: newLat, lng: newLng };
        });
      }, 1000); // Update every second like real GPS

      // Driver arrives when close enough
      const arrivalCheckInterval = setInterval(() => {
        const distToPickup = calculateDistance(
          driverLocation.lat,
          driverLocation.lng,
          pickup.lat,
          pickup.lng
        );
        
        if (distToPickup < 0.05) { // Within 50 meters
          setStatus("arrived");
          setEta(0);
          setDistance(0);
          setSpeed(0);
          clearInterval(arrivalCheckInterval);
          if (locationUpdateRef.current) {
            clearInterval(locationUpdateRef.current);
          }
        }
      }, 1000);

      return () => {
        if (locationUpdateRef.current) {
          clearInterval(locationUpdateRef.current);
        }
        clearInterval(arrivalCheckInterval);
      };
    }

    /* Uncomment when Socket.io server is ready
    if (currentRide?.id) {
      const unsubscribe = subscribeToLocationUpdates(currentRide.id, (location) => {
        setDriverLocation({
          lat: location.latitude,
          lng: location.longitude,
        });
        // Update ETA and distance based on real location
      });
      return () => unsubscribe();
    }
    */
  }, [status, pickup, driverLocation.lat, driverLocation.lng, distance]);

  // Simulate ride progress
  useEffect(() => {
    if (status === "arrived") {
      const timer = setTimeout(() => {
        setStatus("in-progress");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleCancel = () => {
    cancelRide();
    router.push("/home");
  };

  const handleComplete = () => {
    router.push("/booking/complete");
  };

  const getStatusText = () => {
    switch (status) {
      case "arriving":
        return `Driver arriving in ${eta} min`;
      case "arrived":
        return "Driver has arrived!";
      case "in-progress":
        return "Ride in progress";
      case "completed":
        return "Ride completed";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "arriving":
        return "bg-blue-500";
      case "arrived":
        return "bg-primary";
      case "in-progress":
        return "bg-green-500";
      case "completed":
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map */}
      <div className="h-[50vh] sm:h-[55vh] relative">
        <MapView
          pickup={pickup || undefined}
          destination={destination || undefined}
          driverLocation={status !== "completed" ? driverLocation : undefined}
          showRoute={status === "in-progress"}
          interactive={false}
        />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
          aria-label={a11y.nav.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Status Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div
            className={`${getStatusColor()} text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2`}
            role="status"
            aria-live="polite"
            aria-label={`Ride status: ${getStatusText()}`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-medium text-sm">{getStatusText()}</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 bg-background rounded-t-3xl -mt-6 relative z-10 shadow-2xl flex flex-col">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Driver Info */}
          <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-primary overflow-hidden">
              <Image
                src={mockDriver.avatar}
                alt={mockDriver.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {mockDriver.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{mockDriver.rating}</span>
                <span>•</span>
                <span>{mockDriver.carModel}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/chat")}
                className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push("/call")}
                className="w-10 h-10 rounded-full bg-primary hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <Phone className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Car Info */}
          <div className="bg-muted rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="font-medium text-foreground">
                  {mockDriver.carModel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Plate Number</p>
                <p className="font-medium text-foreground">
                  {mockDriver.carNumber}
                </p>
              </div>
            </div>
          </div>

          {/* GPS Tracking Info */}
          {status === "arriving" && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <Navigation className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="font-bold text-foreground">{distance.toFixed(2)} km</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">ETA</p>
                <p className="font-bold text-foreground">{eta} min</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <div className="w-5 h-5 text-primary mx-auto mb-1 flex items-center justify-center text-lg">⚡</div>
                <p className="text-xs text-muted-foreground">Speed</p>
                <p className="font-bold text-foreground">{speed > 0 ? speed : "--"} km/h</p>
              </div>
            </div>
          )}

          {/* Route Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pickup</p>
                <p className="font-medium text-foreground">
                  {pickup?.address || "Current Location"}
                </p>
              </div>
            </div>
            <div className="ml-4 border-l-2 border-dashed border-border h-6" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="font-medium text-foreground">
                  {destination?.address || "Destination"}
                </p>
              </div>
            </div>
          </div>

          {/* Safety */}
          <button className="w-full flex items-center gap-3 p-4 bg-destructive/10 rounded-xl hover:bg-destructive/20 transition-colors" aria-label="Share ride details or get emergency help">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              Share ride details or get help
            </span>
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-2 safe-area-bottom">
          {status === "in-progress" ? (
            <button
              onClick={handleComplete}
              className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              aria-label={a11y.ride.complete}
            >
              Complete Ride (Demo)
            </button>
          ) : status === "arrived" ? (
            <p className="text-center text-primary font-medium py-4" role="status">
              🚗 Your driver is waiting outside!
            </p>
          ) : (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full h-14 rounded-full border-2 border-destructive text-destructive font-semibold hover:bg-destructive/10 transition-colors"
              aria-label={a11y.ride.cancel}
            >
              Cancel Ride
            </button>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCancelModal(false)}
            role="presentation"
          />
          <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 p-6 animate-slide-up safe-area-bottom" role="dialog" aria-labelledby="cancel-dialog-title" aria-modal="true">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground" id="cancel-dialog-title">
                Cancel Ride?
              </h3>
              <p className="text-muted-foreground">
                Are you sure you want to cancel this ride? A cancellation fee may apply.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 h-12 rounded-full border border-border font-medium hover:bg-muted transition-colors"
                  aria-label="Keep ride"
                >
                  Keep Ride
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 h-12 rounded-full bg-destructive text-white font-medium hover:opacity-90 transition-opacity"
                  aria-label="Cancel ride"
                >
                  Cancel Ride
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
