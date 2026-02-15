// App constants
export const APP_NAME = "BluRide";
export const APP_DESCRIPTION = "Your trusted ride-sharing companion";

// Colors (matching the UI assets)
export const COLORS = {
  primary: "#FFB800", // Yellow/Gold
  primaryDark: "#E5A600",
  secondary: "#1A1A2E",
  background: "#FFFFFF",
  backgroundDark: "#0F0F1A",
  text: "#1A1A2E",
  textSecondary: "#6B7280",
  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",
};

// Ride types with pricing
export const RIDE_TYPES = [
  {
    id: "economy",
    name: "Economy",
    description: "Affordable everyday rides",
    icon: "🚗",
    multiplier: 1.0,
    image: "/assets/car-economy.png",
  },
  {
    id: "auto",
    name: "Auto",
    description: "Quick auto rickshaw rides",
    icon: "🛺",
    multiplier: 0.7,
    image: "/assets/auto-rickshaw.svg",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Luxury comfortable rides",
    icon: "🚘",
    multiplier: 1.8,
    image: "/assets/car-premium.png",
  },
  {
    id: "suv",
    name: "SUV",
    description: "Spacious rides for groups",
    icon: "🚙",
    multiplier: 2.2,
    image: "/assets/car-suv.png",
  },
  {
    id: "bike",
    name: "Bike",
    description: "Quick rides for one",
    icon: "🏍️",
    multiplier: 0.6,
    image: "/assets/bike.png",
  },
];

// Base fare configuration (INR)
export const FARE_CONFIG = {
  baseFare: 50,
  perKm: 15,
  perMinute: 2,
  bookingFee: 20,
  minimumFare: 80,
};

// Onboarding slides
export const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: "Welcome to BluRide",
    description: "Your trusted companion for safe and comfortable rides anywhere, anytime.",
    image: "/assets/01_Onboarding.svg",
  },
  {
    id: 2,
    title: "Choose Your Ride",
    description: "Select from multiple ride options that fit your budget and comfort needs.",
    image: "/assets/02_Onboarding.svg",
  },
  {
    id: 3,
    title: "Track in Real-Time",
    description: "Stay updated with live tracking and estimated arrival times.",
    image: "/assets/03_Onboarding.svg",
  },
];

// Mock drivers data
export const MOCK_DRIVERS = [
  {
    id: "driver-1",
    name: "Rajesh Kumar",
    avatar: "/assets/driver-1.png",
    rating: 4.9,
    trips: 1250,
    carModel: "Maruti Suzuki Swift Dzire",
    carNumber: "DL 01 AB 1234",
    carColor: "White",
  },
  {
    id: "driver-2",
    name: "Priya Sharma",
    avatar: "/assets/driver-2.png",
    rating: 4.8,
    trips: 890,
    carModel: "Honda City",
    carNumber: "MH 02 CD 5678",
    carColor: "Black",
  },
  {
    id: "driver-3",
    name: "Amit Patel",
    avatar: "/assets/driver-3.png",
    rating: 4.7,
    trips: 2100,
    carModel: "Hyundai Verna",
    carNumber: "KA 03 EF 9012",
    carColor: "Silver",
  },
];

// Menu items
export const MENU_ITEMS = [
  { id: "home", label: "Home", icon: "Home", href: "/" },
  { id: "history", label: "History", icon: "Clock", href: "/history" },
  { id: "offers", label: "Offers", icon: "Percent", href: "/offers" },
  { id: "favorites", label: "Favourites", icon: "Heart", href: "/favorites" },
  { id: "referral", label: "Referral", icon: "Gift", href: "/referral" },
  { id: "complain", label: "Complain", icon: "AlertCircle", href: "/complain" },
  { id: "about", label: "About Us", icon: "Info", href: "/about" },
  { id: "settings", label: "Settings", icon: "Settings", href: "/settings" },
];
