"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Clock, Copy, Check, Percent, Gift, Zap } from "lucide-react";
import { toast } from "sonner";

const offers = [
  {
    id: "1",
    code: "RIDE50",
    title: "50% OFF",
    description: "Get 50% off on your next ride",
    maxDiscount: 25,
    minOrder: 20,
    validTill: "Feb 28, 2026",
    isNew: true,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "2",
    code: "FIRST20",
    title: "20% OFF",
    description: "First ride discount for new users",
    maxDiscount: 15,
    minOrder: 10,
    validTill: "Mar 15, 2026",
    isNew: false,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "3",
    code: "WEEKEND",
    title: "Flat ₹50 OFF",
    description: "Weekend special offer",
    maxDiscount: 5,
    minOrder: 15,
    validTill: "Feb 16, 2026",
    isNew: true,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "4",
    code: "PREMIUM",
    title: "Free Upgrade",
    description: "Free premium ride upgrade",
    validTill: "Feb 20, 2026",
    isNew: false,
    color: "from-amber-500 to-orange-500",
  },
];

export default function OffersPage() {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(null), 2000);
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
          <h1 className="text-xl font-bold text-foreground">Offers & Promos</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Enter Code */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Have a code?</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-1 h-12 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary uppercase"
            />
            <button className="px-6 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Apply
            </button>
          </div>
        </div>

        {/* Offers List */}
        <h3 className="font-semibold text-foreground">Available Offers</h3>
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* Offer Header */}
              <div
                className={`bg-gradient-to-r ${offer.color} p-4 text-white relative`}
              >
                {offer.isNew && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                    NEW
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{offer.title}</p>
                    <p className="text-sm text-white/80">{offer.description}</p>
                  </div>
                </div>
              </div>

              {/* Offer Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {offer.maxDiscount && (
                      <span>Max: ${offer.maxDiscount}</span>
                    )}
                    {offer.minOrder && <span>Min: ${offer.minOrder}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Valid till {offer.validTill}</span>
                  </div>
                </div>

                {/* Code & Copy */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-12 px-4 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-primary">
                    <span className="font-mono font-bold text-primary tracking-widest">
                      {offer.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      copiedCode === offer.code
                        ? "bg-green-500 text-white"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {copiedCode === offer.code ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
