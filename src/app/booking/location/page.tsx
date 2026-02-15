"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Search,
  Clock,
  Star,
  X,
} from "lucide-react";
import { useRideStore } from "@/stores/ride-store";
import dynamicImport from "next/dynamic";

const MapView = dynamicImport(() => import("@/components/common/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse" />
  ),
});

// Mock saved places
const savedPlaces = [
  {
    id: "home",
    name: "Home",
    address: "Vasant Kunj, New Delhi",
    icon: null,
    image: "/assets/home.svg",
    lat: 28.5244,
    lng: 77.1580,
  },
  {
    id: "work",
    name: "Office",
    address: "Cyber City, Gurugram",
    icon: "🏢",
    image: null,
    lat: 28.4949,
    lng: 77.0895,
  },
];

// Mock recent searches
const recentSearches = [
  {
    id: "1",
    name: "India Gate",
    address: "India Gate, Rajpath, New Delhi",
    lat: 28.6129,
    lng: 77.2295,
  },
  {
    id: "2",
    name: "Connaught Place",
    address: "Connaught Place, New Delhi",
    lat: 28.6315,
    lng: 77.2167,
  },
  {
    id: "3",
    name: "Hauz Khas Village",
    address: "Hauz Khas Village, New Delhi",
    lat: 28.5494,
    lng: 77.2001,
  },
];

function LocationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setPickup, setDestination, pickup, destination } = useRideStore();
  
  const [activeField, setActiveField] = useState<"pickup" | "destination">("pickup");
  const [pickupText, setPickupText] = useState("");
  const [destinationText, setDestinationText] = useState(
    searchParams.get("destination") || ""
  );
  const [searchResults, setSearchResults] = useState<typeof recentSearches>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Get user's current location for pickup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickup({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location",
          });
          setPickupText("Current Location");
        },
        (error) => {
          console.log("Location error:", error);
        }
      );
    }
  }, [setPickup]);

  // Search simulation
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = recentSearches.filter(
        (place) =>
          place.name.toLowerCase().includes(query.toLowerCase()) ||
          place.address.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.length > 0 ? filtered : recentSearches);
      setIsSearching(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (activeField === "destination") {
      handleSearch(destinationText);
    } else {
      handleSearch(pickupText);
    }
  }, [pickupText, destinationText, activeField, handleSearch]);

  const handleSelectPlace = (place: typeof recentSearches[0]) => {
    const location = {
      lat: place.lat,
      lng: place.lng,
      address: place.address,
    };

    if (activeField === "pickup") {
      setPickup(location);
      setPickupText(place.name);
      setActiveField("destination");
    } else {
      setDestination(location);
      setDestinationText(place.name);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location",
          };
          if (activeField === "pickup") {
            setPickup(location);
            setPickupText("Current Location");
            setActiveField("destination");
          }
        }
      );
    }
  };

  const handleConfirm = () => {
    if (pickup && destination) {
      router.push("/booking/select-ride");
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    // Reverse geocoding would go here in production
    const location = {
      lat,
      lng,
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    };

    if (activeField === "pickup") {
      setPickup(location);
      setPickupText(location.address);
    } else {
      setDestination(location);
      setDestinationText(location.address);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">
            Set Location
          </h1>
        </div>

        {/* Location Inputs */}
        <div className="relative flex gap-3">
          {/* Line connecting dots */}
          <div className="flex flex-col items-center py-4">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-0.5 flex-1 bg-border my-1" />
            <div className="w-3 h-3 rounded-full bg-destructive" />
          </div>

          <div className="flex-1 space-y-3">
            {/* Pickup Input */}
            <div
              className={`relative rounded-xl border-2 transition-colors ${
                activeField === "pickup"
                  ? "border-primary bg-primary/5"
                  : "border-input"
              }`}
            >
              <input
                type="text"
                value={pickupText}
                onChange={(e) => setPickupText(e.target.value)}
                onFocus={() => setActiveField("pickup")}
                placeholder="Pickup location"
                className="w-full h-12 px-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {pickupText && (
                <button
                  onClick={() => {
                    setPickupText("");
                    setPickup(null as any);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Destination Input */}
            <div
              className={`relative rounded-xl border-2 transition-colors ${
                activeField === "destination"
                  ? "border-primary bg-primary/5"
                  : "border-input"
              }`}
            >
              <input
                type="text"
                value={destinationText}
                onChange={(e) => setDestinationText(e.target.value)}
                onFocus={() => setActiveField("destination")}
                placeholder="Where to?"
                className="w-full h-12 px-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {destinationText && (
                <button
                  onClick={() => {
                    setDestinationText("");
                    setDestination(null as any);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Toggle */}
      <div className="px-4 py-2 flex gap-2">
        <button
          onClick={() => setShowMap(false)}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            !showMap
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Search
        </button>
        <button
          onClick={() => setShowMap(true)}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            showMap
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Map
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showMap ? (
          <div className="h-[50vh] sm:h-[60vh]">
            <MapView
              pickup={pickup || undefined}
              destination={destination || undefined}
              onMapClick={handleMapClick}
              interactive
            />
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Current Location Button */}
            {activeField === "pickup" && (
              <button
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center gap-4 p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">
                    Use Current Location
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Set pickup to your location
                  </p>
                </div>
              </button>
            )}

            {/* Saved Places */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Saved Places
              </h3>
              <div className="space-y-2">
                {savedPlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg overflow-hidden">
                      {place.image ? (
                        <Image
                          src={place.image}
                          alt={place.name}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      ) : (
                        place.icon
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{place.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {place.address}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent/Search Results */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {searchResults.length > 0 ? "Search Results" : "Recent"}
              </h3>
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {(searchResults.length > 0 ? searchResults : recentSearches).map(
                    (place) => (
                      <button
                        key={place.id}
                        onClick={() => handleSelectPlace(place)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-foreground">
                            {place.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {place.address}
                          </p>
                        </div>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Button */}
      {pickup && destination && (
        <div className="p-4 border-t border-border bg-background">
          <button
            onClick={handleConfirm}
            className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
          >
            Confirm Location
          </button>
        </div>
      )}
    </div>
  );
}

export default function LocationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LocationContent />
    </Suspense>
  );
}
