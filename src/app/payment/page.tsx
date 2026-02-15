"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  CreditCard,
  Trash2,
  Check,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "wallet";
  name: string;
  last4?: string;
  brand?: string;
  icon: string;
  isDefault: boolean;
}

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    name: "Visa",
    last4: "4242",
    brand: "visa",
    icon: "💳",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    name: "Mastercard",
    last4: "8888",
    brand: "mastercard",
    icon: "💳",
    isDefault: false,
  },
  {
    id: "3",
    type: "wallet",
    name: "BluRide Wallet",
    icon: "👛",
    isDefault: false,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast.success("Default payment method updated");
  };

  const handleDelete = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
    setShowDeleteModal(null);
    toast.success("Payment method removed");
  };

  const getCardBrandIcon = (brand?: string) => {
    switch (brand) {
      case "visa":
        return (
          <svg className="h-8 w-auto" viewBox="0 0 48 16" fill="none">
            <rect width="48" height="16" rx="2" fill="#1A1F71" />
            <path
              d="M19.5 4.5L17 11.5H15L12.5 6C12.3 5.4 12.1 5.2 11.7 5C11 4.7 10 4.4 9.5 4.3L9.5 4H13C13.6 4 14 4.4 14.2 5L15 9L17.2 4H19.5ZM26.5 11.5H24.5L26 4.5H28L26.5 11.5ZM35.5 4.5L33 11.5H31L28.5 4.5H30.5L32 9.5L33.5 4.5H35.5ZM38.5 11.5H36.5L38 4.5H40L38.5 11.5Z"
              fill="white"
            />
          </svg>
        );
      case "mastercard":
        return (
          <svg className="h-8 w-auto" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="#000" />
            <circle cx="18" cy="16" r="10" fill="#EB001B" />
            <circle cx="30" cy="16" r="10" fill="#F79E1B" />
            <path
              d="M24 8.5C26.4 10.4 28 13 28 16C28 19 26.4 21.6 24 23.5C21.6 21.6 20 19 20 16C20 13 21.6 10.4 24 8.5Z"
              fill="#FF5F00"
            />
          </svg>
        );
      default:
        return <CreditCard className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 sm:p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Payment Methods</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6" />
            <span className="font-medium">BluRide Wallet</span>
          </div>
          <p className="text-3xl font-bold mb-2">₹5,000</p>
          <p className="text-sm opacity-80">Available Balance</p>
          <button className="mt-4 px-4 py-2 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
            Add Money
          </button>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Saved Cards</h3>
          <div className="space-y-3">
            {paymentMethods
              .filter((m) => m.type === "card")
              .map((method) => (
                <div
                  key={method.id}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
                >
                  {getCardBrandIcon(method.brand)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{method.name}</p>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      •••• •••• •••• {method.last4}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                      >
                        <Check className="w-5 h-5 text-muted-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteModal(method.id)}
                      className="w-10 h-10 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Add New Card */}
        <button
          onClick={() => router.push("/payment/add")}
          className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Add New Card</span>
        </button>

        {/* Other Payment Options */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 mt-6">
            Other Payment Options
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:bg-muted transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#003087] flex items-center justify-center">
                <span className="text-white text-xs font-bold">Pay</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">PayPal</p>
                <p className="text-sm text-muted-foreground">Connect your account</p>
              </div>
            </button>
            <button className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:bg-muted transition-colors">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <span className="text-white text-lg">🍎</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">Apple Pay</p>
                <p className="text-sm text-muted-foreground">Use Face ID to pay</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDeleteModal(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 p-6 animate-slide-up safe-area-bottom">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Remove Card?
              </h3>
              <p className="text-muted-foreground">
                Are you sure you want to remove this payment method?
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 h-12 rounded-full border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="flex-1 h-12 rounded-full bg-destructive text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
