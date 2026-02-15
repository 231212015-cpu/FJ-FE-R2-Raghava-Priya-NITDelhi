"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    title: "Anywhere you are",
    description: "Sell houses easily with the help of Listenoryx and to make this line big I am writing more.",
    image: "/assets/taxi-app.svg",
  },
  {
    id: 2,
    title: "At anytime",
    description: "Sell houses easily with the help of Listenoryx and to make this line big I am writing more.",
    image: "/assets/ordering-car.svg",
  },
  {
    id: 3,
    title: "Book your car",
    description: "Sell houses easily with the help of Listenoryx and to make this line big I am writing more.",
    image: "/assets/taxi-arrived.svg",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    setMounted(true);
    const hasOnboarded = localStorage.getItem("hasOnboarded");
    if (hasOnboarded === "true") {
      router.replace("/auth/signin");
    }
  }, [router]);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  }, [currentSlide]);

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem("hasOnboarded", "true");
    router.push("/auth/signin");
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) handleNext();
    if (touchEnd - touchStart > 75) handlePrev();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext]);

  if (!mounted) return null;

  return (
    <div 
      className="min-h-screen bg-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* Skip button */}
        <div className="flex justify-end p-6">
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
          >
            Skip
          </button>
        </div>

        {/* Illustration */}
        <div className="flex-1 flex items-center justify-center px-8 pb-8">
          <div className="relative w-full max-w-[320px] aspect-square">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-primary rounded-t-[40px] px-8 pt-10 pb-8 space-y-6">
          {/* Pagination dots */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Text */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {slides[currentSlide].title}
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleNext}
            className="w-full h-14 rounded-xl bg-white text-primary font-semibold text-base hover:bg-gray-50 transition-colors shadow-lg"
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
