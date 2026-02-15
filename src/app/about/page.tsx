"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  Shield,
  Heart,
  Globe,
  Zap,
  Users,
  Award,
  ExternalLink,
  Mail,
  MapPin,
  Phone
} from "lucide-react";

const stats = [
  { label: "Active Users", value: "10M+" },
  { label: "Cities", value: "500+" },
  { label: "Countries", value: "50+" },
  { label: "Rides Daily", value: "5M+" },
];

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Safety First",
    description: "Your safety is our top priority with verified drivers and real-time tracking.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Customer Focus",
    description: "We listen to feedback and continuously improve our service for you.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Sustainability",
    description: "Committed to reducing carbon footprint with eco-friendly ride options.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Innovation",
    description: "Leveraging technology to make rides faster, safer, and more convenient.",
  },
];

const team = [
  { name: "Priya Sharma", role: "CEO & Founder" },
  { name: "Arjun Mehta", role: "CTO" },
  { name: "Ananya Reddy", role: "Head of Operations" },
  { name: "Vikram Kapoor", role: "Head of Safety" },
];

export default function AboutPage() {
  const router = useRouter();

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
          <h1 className="text-xl font-bold text-foreground">About Us</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-8">
        {/* Hero */}
        <div className="text-center py-6">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <Image
              src="/assets/taxi-app.svg"
              alt="BluRide"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">BluRide</h2>
          <p className="text-muted-foreground">Version 1.0.0</p>
        </div>

        {/* Mission */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-foreground mb-3">Our Mission</h3>
          <p className="text-muted-foreground leading-relaxed">
            To revolutionize urban mobility by providing safe, reliable, and affordable 
            transportation that connects people and communities while reducing environmental impact.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-4 text-center"
            >
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Our Values</h3>
          <div className="grid gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-card border border-border rounded-xl p-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {value.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Leadership Team</h3>
          <div className="grid grid-cols-2 gap-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-4 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <a
              href="mailto:support@bluride.app"
              className="flex items-center gap-4 p-4 hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">support@bluride.app</p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </a>
            <div className="border-t border-border" />
            <a
              href="tel:+1800123456"
              className="flex items-center gap-4 p-4 hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Phone</p>
                <p className="text-sm text-muted-foreground">+1 (800) 123-456</p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </a>
            <div className="border-t border-border" />
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Headquarters</p>
                <p className="text-sm text-muted-foreground">
                  Tower B, Cyber City, Sector 24, Gurugram, Haryana 122002
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors text-left">
            <span className="text-foreground">Terms of Service</span>
            <ExternalLink className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="border-t border-border" />
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors text-left">
            <span className="text-foreground">Privacy Policy</span>
            <ExternalLink className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="border-t border-border" />
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors text-left">
            <span className="text-foreground">Open Source Licenses</span>
            <ExternalLink className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-sm text-muted-foreground">
          <p>© 2025 BluRide Inc. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ in India</p>
        </div>
      </div>
    </div>
  );
}
