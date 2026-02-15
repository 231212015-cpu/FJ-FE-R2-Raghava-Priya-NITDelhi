"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  AlertCircle,
  Car,
  CreditCard,
  MapPin,
  User,
  Clock,
  ChevronRight,
  Send,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const complaintCategories = [
  {
    id: "driver",
    icon: <User className="w-5 h-5" />,
    title: "Driver Related",
    description: "Issues with driver behavior or service",
  },
  {
    id: "vehicle",
    icon: <Car className="w-5 h-5" />,
    title: "Vehicle Issue",
    description: "Problems with vehicle condition or cleanliness",
  },
  {
    id: "payment",
    icon: <CreditCard className="w-5 h-5" />,
    title: "Payment Problem",
    description: "Billing errors or payment failures",
  },
  {
    id: "route",
    icon: <MapPin className="w-5 h-5" />,
    title: "Route Issue",
    description: "Wrong route or longer distance charged",
  },
  {
    id: "timing",
    icon: <Clock className="w-5 h-5" />,
    title: "Timing Issue",
    description: "Late arrival or long waiting time",
  },
  {
    id: "other",
    icon: <AlertCircle className="w-5 h-5" />,
    title: "Other",
    description: "Any other issue not listed above",
  },
];

function ComplainPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get("rideId");
  
  const [step, setStep] = useState<"category" | "details" | "success">("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep("details");
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please describe your issue");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep("success");
  };

  const selectedCategoryData = complaintCategories.find(
    (c) => c.id === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 sm:p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (step === "details") {
                setStep("category");
              } else if (step === "success") {
                router.push("/history");
              } else {
                router.back();
              }
            }}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">
            {step === "success" ? "Complaint Submitted" : "Report an Issue"}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {step === "category" && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Select the category that best describes your issue
            </p>
            
            {rideId && (
              <div className="bg-muted/50 rounded-xl p-3 text-sm text-muted-foreground">
                Regarding ride: <span className="font-mono">#{rideId}</span>
              </div>
            )}

            <div className="space-y-3">
              {complaintCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleSelectCategory(category.id)}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "details" && selectedCategoryData && (
          <div className="space-y-6">
            {/* Selected Category */}
            <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {selectedCategoryData.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {selectedCategoryData.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCategoryData.description}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Describe Your Issue
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about the issue you faced..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Minimum 20 characters ({description.length}/20)
              </p>
            </div>

            {/* Upload Evidence */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Attach Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <div className="text-muted-foreground">
                  <p className="font-medium">Click to upload</p>
                  <p className="text-sm">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={description.length < 20 || isSubmitting}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Complaint
                </>
              )}
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-12">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image
                src="/assets/speech-bubble-hello.svg"
                alt="Success"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Complaint Submitted
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              We've received your complaint and will review it within 24-48 hours.
              You'll receive an update via email.
            </p>
            <div className="bg-card border border-border rounded-xl p-4 max-w-sm mx-auto mb-6">
              <p className="text-sm text-muted-foreground">Reference Number</p>
              <p className="font-mono font-bold text-foreground text-lg">
                #CMP-{Date.now().toString().slice(-8)}
              </p>
            </div>
            <div className="space-y-3 max-w-sm mx-auto">
              <button
                onClick={() => router.push("/history")}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                View Ride History
              </button>
              <button
                onClick={() => router.push("/home")}
                className="w-full h-12 rounded-xl border border-border font-semibold hover:bg-muted transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComplainPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <ComplainPageContent />
    </Suspense>
  );
}

