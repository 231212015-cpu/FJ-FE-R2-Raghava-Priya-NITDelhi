"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Star,
  CreditCard,
  ChevronRight,
  Car,
  Zap,
} from "lucide-react";
import { useRideStore } from "@/stores/ride-store";
import type { RideType } from "@/types";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/common/MapView"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
});

const rideOptions = [
  {
    id: "economy" as RideType,
    name: "Economy",
    description: "Affordable, everyday rides",
    icon: "🚗",
    image: "/assets/22_select_transport.svg",
    seats: 4,
    eta: "3-5 min",
    multiplier: 1.0,
  },
  {
    id: "auto" as RideType,
    name: "Auto",
    description: "Quick auto rickshaw rides",
    icon: "🛺",
    image: "/assets/auto-rickshaw.svg",
    seats: 3,
    eta: "2-4 min",
    multiplier: 0.7,
  },
  {
    id: "premium" as RideType,
    name: "Premium",
    description: "Luxury comfort rides",
    icon: "🚘",
    image: "/assets/23_select_avaiable_car.svg",
    seats: 4,
    eta: "5-8 min",
    multiplier: 1.8,
  },
  {
    id: "suv" as RideType,
    name: "SUV",
    description: "Spacious for groups",
    icon: "🚙",
    image: "/assets/25_car_details.svg",
    seats: 6,
    eta: "8-12 min",
    multiplier: 2.2,
  },
  {
    id: "bike" as RideType,
    name: "Bike",
    description: "Quick solo rides",
    icon: "🏍️",
    image: "/assets/Transport.svg",
    seats: 1,
    eta: "2-3 min",
    multiplier: 0.6,
  },
];

const paymentMethods = [
  { id: "card", name: "Credit Card", icon: "💳", last4: "4242" },
  { id: "cash", name: "Cash", icon: "💵" },
  { id: "wallet", name: "Wallet", icon: "👛", balance: 50.0 },
];

export default function SelectRidePage() {
  const router = useRouter();
  const {
    pickup,
    destination,
    selectedRideType,
    setRideType,
    estimatedFare,
    sharedRide,
    splitCount,
    setSharedRide,
    setSplitCount,
    loyaltyPoints,
    pointsPerRide,
    getLoyaltyDiscountPercent,
    applyLoyaltyDiscount,
    bookRide,
    isLoading,
  } = useRideStore();

  const [selectedPayment, setSelectedPayment] = useState("card");
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (!pickup || !destination) {
      router.replace("/booking/location");
    }
  }, [pickup, destination, router]);

  const selectedOption = rideOptions.find((o) => o.id === selectedRideType);
  const selectedPaymentMethod = paymentMethods.find(
    (p) => p.id === selectedPayment
  );

  const handleBookRide = async () => {
    await bookRide();
    router.push("/booking/searching");
  };

  const calculateFare = (multiplier: number) => {
    const baseFare = estimatedFare || 10;
    return Math.round(baseFare * multiplier * 100) / 100;
  };

  const formatFare = (value: number) => value.toFixed(2);

  const discountPercent = getLoyaltyDiscountPercent();
  const hasDiscount = discountPercent > 0;

  const splitOptions = [2, 3, 4];

  if (!pickup || !destination) {
    return null;
  }

  const selectedRawFare = calculateFare(selectedOption?.multiplier || 1);
  const selectedFare = applyLoyaltyDiscount(selectedRawFare);
  const perPersonFare = sharedRide
    ? selectedFare / splitCount
    : selectedFare;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map Section */}
      <div className="h-[30vh] sm:h-[35vh] relative">
        <MapView
          pickup={pickup}
          destination={destination}
          showRoute
          interactive={false}
        />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 bg-background rounded-t-3xl -mt-6 relative z-10 shadow-2xl flex flex-col">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Route Summary */}
        <div className="px-4 pb-4 flex items-start gap-3 border-b border-border">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-0.5 h-8 bg-border" />
            <div className="w-3 h-3 rounded-full bg-destructive" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Pickup</p>
              <p className="font-medium text-foreground truncate">
                {pickup.address}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Destination</p>
              <p className="font-medium text-foreground truncate">
                {destination.address}
              </p>
            </div>
          </div>
        </div>

        {/* Ride Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Choose a ride</h3>

          {rideOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setRideType(option.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                selectedRideType === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/50"
              }`}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-3xl">
                {option.icon}
              </div>

              {/* Details */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">
                    {option.name}
                  </h4>
                  {option.id === "premium" && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {option.seats}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {option.eta}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">
                  ${formatFare(
                    sharedRide
                      ? applyLoyaltyDiscount(calculateFare(option.multiplier)) /
                        splitCount
                      : applyLoyaltyDiscount(calculateFare(option.multiplier))
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {sharedRide
                    ? `Total $${formatFare(
                        applyLoyaltyDiscount(calculateFare(option.multiplier))
                      )}`
                    : "Estimated fare"}
                </p>
                {hasDiscount && (
                  <p className="text-[11px] text-primary font-medium">
                    Loyalty -{discountPercent}%
                  </p>
                )}
                {option.multiplier > 1 && !sharedRide && !hasDiscount && (
                  <p className="text-xs text-muted-foreground line-through">
                    ${formatFare(calculateFare(option.multiplier) * 1.2)}
                  </p>
                )}
              </div>
            </button>
          ))}

          {/* Loyalty Summary */}
          <div className="p-4 bg-card border border-border rounded-xl space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">
                  Loyalty points
                </p>
                <p className="text-xs text-muted-foreground">
                  Balance: {loyaltyPoints} pts
                </p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {hasDiscount
                  ? `${discountPercent}% discount active`
                  : `Earn ${pointsPerRide} pts/ride`}
              </div>
            </div>
            {hasDiscount && (
              <p className="text-xs text-muted-foreground">
                Discount applies automatically to this booking.
              </p>
            )}
          </div>

          {/* Shared Ride */}
          <div className="p-4 bg-muted rounded-xl space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">Share ride</p>
                <p className="text-xs text-muted-foreground">
                  Split fare with co-riders (simulation only)
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={sharedRide}
                onClick={() => setSharedRide(!sharedRide)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  sharedRide ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-background shadow transition-transform ${
                    sharedRide ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {sharedRide && (
              <>
                <div className="flex items-center gap-2">
                  {splitOptions.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setSplitCount(count)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        splitCount === count
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {count} riders
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: splitCount }).map((_, index) => (
                      <div
                        key={`split-${index}`}
                        className="px-2 py-1 rounded-full bg-background text-xs text-foreground border border-border"
                      >
                        ${formatFare(perPersonFare)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Total ${formatFare(selectedFare)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Promo Code */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
            <Zap className="w-5 h-5 text-primary" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {promoCode && (
              <button className="text-primary text-sm font-medium">
                Apply
              </button>
            )}
          </div>

          {/* Payment Method */}
          <button
            onClick={() => setShowPaymentSheet(true)}
            className="w-full flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
          >
            <span className="text-2xl">{selectedPaymentMethod?.icon}</span>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">
                {selectedPaymentMethod?.name}
              </p>
              {selectedPaymentMethod?.last4 && (
                <p className="text-sm text-muted-foreground">
                  •••• {selectedPaymentMethod.last4}
                </p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Book Button */}
        <div className="p-4 border-t border-border bg-background safe-area-bottom">
          <button
            onClick={handleBookRide}
            disabled={isLoading}
            className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Book {sharedRide ? "Shared " : ""}{selectedOption?.name} - ${
                  formatFare(perPersonFare)
                }
                {sharedRide ? " each" : ""}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment Method Sheet */}
      {showPaymentSheet && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowPaymentSheet(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 p-6 animate-slide-up safe-area-bottom">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-4">
              Payment Method
            </h3>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedPayment(method.id);
                    setShowPaymentSheet(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{method.name}</p>
                    {method.last4 && (
                      <p className="text-sm text-muted-foreground">
                        •••• {method.last4}
                      </p>
                    )}
                    {method.balance !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        Balance: ${method.balance.toFixed(2)}
                      </p>
                    )}
                  </div>
                  {selectedPayment === method.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => router.push("/payment/add")}
              className="w-full mt-4 py-3 text-primary font-medium hover:underline"
            >
              + Add Payment Method
            </button>
          </div>
        </>
      )}
    </div>
  );
}
