"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  pickup?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  showRoute?: boolean;
  driverLocation?: { lat: number; lng: number };
  onMapClick?: (lat: number, lng: number) => void;
  interactive?: boolean;
}

// Default center (New Delhi, India)
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

export default function MapView({
  pickup,
  destination,
  showRoute = false,
  driverLocation,
  onMapClick,
  interactive = true,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mountedRef.current) {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        () => {
          // Use default on error
        }
      );
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const center = pickup || userLocation || DEFAULT_CENTER;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // Add tile layer (using OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control to bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Handle map clicks
      if (onMapClick && interactive) {
        map.on("click", (e: L.LeafletMouseEvent) => {
          if (mountedRef.current) {
            onMapClick(e.latlng.lat, e.latlng.lng);
          }
        });
      }

      mapRef.current = map;
      setIsMapReady(true);
    } catch (error) {
      console.error("Map initialization error:", error);
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.off();
          mapRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapRef.current = null;
      }
      setIsMapReady(false);
    };
  }, []);

  // Update markers and route
  useEffect(() => {
    if (!mapRef.current || !isMapReady || !mountedRef.current) return;

    const map = mapRef.current;

    try {
      // Clear existing markers and routes
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      const createIcon = (color: string, size: number = 24) =>
        L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

      // Add pickup marker
      if (pickup) {
        L.marker([pickup.lat, pickup.lng], {
          icon: createIcon("#3b82f6"),
        }).addTo(map);
      }

      // Add destination marker
      if (destination) {
        L.marker([destination.lat, destination.lng], {
          icon: createIcon("#EF4444"),
        }).addTo(map);
      }

      // Add driver marker
      if (driverLocation) {
        L.marker([driverLocation.lat, driverLocation.lng], {
          icon: L.divIcon({
            className: "driver-marker",
            html: `<div style="background-color: #3b82f6; padding: 8px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🚗</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          }),
        }).addTo(map);
      }

      // Draw route line
      if (showRoute && pickup && destination) {
        const routeLine = L.polyline(
          [
            [pickup.lat, pickup.lng],
            [destination.lat, destination.lng],
          ],
          {
            color: "#3b82f6",
            weight: 4,
            opacity: 0.8,
            dashArray: "10, 10",
          }
        ).addTo(map);

        // Fit bounds to show entire route
        map.fitBounds(routeLine.getBounds(), {
          padding: [50, 50],
        });
      }

      // User location marker
      if (userLocation && !pickup) {
        L.marker([userLocation.lat, userLocation.lng], {
          icon: L.divIcon({
            className: "user-marker",
            html: `<div style="background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        }).addTo(map);
      }
    } catch (error) {
      console.error("Map update error:", error);
    }
  }, [pickup, destination, driverLocation, showRoute, userLocation, isMapReady]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[300px]"
      style={{ background: "#e5e5e5" }}
    />
  );
}
