"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AddPaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
    saveCard: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value, type, checked } = e.target;

    if (name === "cardNumber") {
      value = formatCardNumber(value);
    } else if (name === "expiry") {
      value = formatExpiry(value.replace("/", ""));
    } else if (name === "cvv") {
      value = value.replace(/[^0-9]/g, "").slice(0, 4);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    if (!formData.expiry || formData.expiry.length < 5) {
      newErrors.expiry = "Please enter a valid expiry date";
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Please enter the cardholder name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    toast.success("Card added successfully!");
    router.back();
  };

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    return null;
  };

  const cardType = getCardType(formData.cardNumber);

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
          <h1 className="text-xl font-bold text-foreground">Add Card</h1>
        </div>
      </div>

      {/* Card Preview */}
      <div className="p-4 sm:p-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white aspect-[1.6/1] max-w-sm mx-auto relative overflow-hidden shadow-xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white" />
            <div className="absolute -right-5 -top-5 w-32 h-32 rounded-full bg-white" />
          </div>

          {/* Card content */}
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md" />
              {cardType && (
                <span className="text-lg font-bold uppercase opacity-80">
                  {cardType}
                </span>
              )}
            </div>

            <div>
              <p className="text-lg tracking-widest font-mono">
                {formData.cardNumber || "•••• •••• •••• ••••"}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/60 mb-1">Card Holder</p>
                <p className="font-medium uppercase">
                  {formData.name || "YOUR NAME"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 mb-1">Expires</p>
                <p className="font-medium">{formData.expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full h-14 pl-12 pr-4 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.cardNumber ? "border-destructive" : "border-input"
              }`}
            />
          </div>
          {errors.cardNumber && (
            <p className="text-destructive text-xs mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength={5}
              className={`w-full h-14 px-4 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.expiry ? "border-destructive" : "border-input"
              }`}
            />
            {errors.expiry && (
              <p className="text-destructive text-xs mt-1">{errors.expiry}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              CVV
            </label>
            <div className="relative">
              <input
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="•••"
                maxLength={4}
                className={`w-full h-14 px-4 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.cvv ? "border-destructive" : "border-input"
                }`}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {errors.cvv && (
              <p className="text-destructive text-xs mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Cardholder Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Vikram Singh"
            className={`w-full h-14 px-4 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? "border-destructive" : "border-input"
            }`}
          />
          {errors.name && (
            <p className="text-destructive text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Save card checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="saveCard"
            checked={formData.saveCard}
            onChange={handleChange}
            className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">
            Save card for future payments
          </span>
        </label>

        {/* Security note */}
        <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Your card information is encrypted and secure
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            "Add Card"
          )}
        </button>
      </form>
    </div>
  );
}
