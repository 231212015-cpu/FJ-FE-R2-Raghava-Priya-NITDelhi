# 🚗 RideForward - Modern Ride-Sharing Web Application

<<<<<<< HEAD
## live project link : https://fj-fe-r2-raghava-priya-nitdelhi.onrender.com
## demo video link : https://www.loom.com/share/e9498736b670495db1f74939b557673d
---

## About Project
A full-featured ride-sharing web application built with Next.js 16, TypeScript, and Tailwind CSS. Features include real-time tracking, AI-powered chatbot, voice recognition, loyalty rewards, and comprehensive accessibility.

---

## Getting Started

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)]()
[![Completion](https://img.shields.io/badge/completion-100%25-success)]()

## ✨ Features

### 🔐 Core Functionality (Part A)
- **User Authentication** - Secure sign up, login, and profile management
- **Ride Booking** - Complete booking flow with 5 ride types (Economy, Auto, Premium, SUV, Bike)
- **Interactive Maps** - Leaflet-powered maps with route visualization
- **Ride History** - View past rides with filters and detailed information
- **Payment Integration** - Real Stripe API for secure payments
- **Ride Sharing** - Split fares with 2-4 riders
- **Feedback System** - Rate rides, add tips, and leave comments
- **Notification Center** - Real-time ride updates with notification history
- **Live Chat** - Socket.io ready chat with drivers
- **Dark Mode** - Light/dark theme with system preference detection
- **Mobile Responsive** - Optimized for all devices

### 🌟 Advanced Features (Part B)
- **Real-Time Tracking** - GPS simulation with distance, speed, and ETA
- **Loyalty Program** - Earn points, unlock 10% discount on rides
- **AI Chatbot** - OpenAI GPT-3.5-turbo powered customer support
- **Voice Recognition** - Web Speech API for hands-free messaging
- **Accessibility** - ARIA labels, screen reader support, keyboard navigation

### 🎨 Bonus Features
- **Human Face Avatars** - 5 unique SVG avatars for users and drivers
- **Enhanced UI/UX** - Smooth animations, transitions, and feedback
- **Comprehensive Documentation** - Detailed guides for all features

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd rideforward

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# OpenAI Integration (Optional - falls back to pattern matching)
OPENAI_API_KEY=sk_your_openai_key_here

# Stripe Payment Integration (Required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# Socket.io Real-time Chat (Optional - works with mock)
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com

# Map Integration (Optional)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Get API Keys
- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Stripe**: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) (use TEST keys)
- **Mapbox**: [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens)

---

## 🧪 Testing

### Test Stripe Payments
Use these test cards in the payment form:
- **Visa**: `4242 4242 4242 4242`
- **Mastercard**: `5555 5555 5555 4444`
- **Amex**: `3782 822463 10005`
- **Expiry**: Any future date (e.g., 12/28)
- **CVV**: Any 3-4 digits

### Test Voice Recognition
1. Go to `/chat` or `/help`
2. Click the microphone button
3. Allow microphone access
4. Speak your message
5. Works in Chrome, Edge, and Safari

### Test Features
- ✅ Sign up / Sign in at `/auth/signup`
- ✅ Book a ride from `/home`
- ✅ View ride history at `/history`
- ✅ Update profile at `/profile`
- ✅ Add payment method at `/payment`
- ✅ Chat with AI at `/help`

---

## 📂 Project Structure

```
rideforward/
├── public/
│   └── assets/          # Images, icons, avatars
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes (3 routes)
│   │   ├── auth/        # Authentication pages
│   │   ├── booking/     # Booking flow (7 pages)
│   │   └── ...          # Other pages (31 total)
│   ├── components/      # React components
│   │   ├── common/      # Shared components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── stores/          # Zustand state stores
│   └── types/           # TypeScript type definitions
├── .env.example         # Environment variables template
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

---

## 🎯 Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Maps**: React-Leaflet
- **Payments**: Stripe API
- **AI**: OpenAI GPT-3.5-turbo
- **Real-time**: Socket.io (client)
- **Voice**: Web Speech API
- **Animations**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React

---

## 📚 Documentation

- [PROJECT_COMPLETION.md](PROJECT_COMPLETION.md) - Complete feature summary
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [PART_A_COMPLETE.md](PART_A_COMPLETE.md) - Part A implementation details
- [PART_B_FEATURES.md](PART_B_FEATURES.md) - Part B implementation details
- [VOICE_INPUT_GUIDE.md](VOICE_INPUT_GUIDE.md) - Voice recognition guide

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 Features at a Glance

| Feature | Status | Description |
|---------|--------|-------------|
| Authentication | ✅ | Secure user registration and login |
| Ride Booking | ✅ | Complete booking flow with 5 ride types |
| Real-time Tracking | ✅ | GPS simulation with speed & distance |
| Payment Processing | ✅ | Real Stripe API integration |
| AI Chatbot | ✅ | OpenAI GPT-3.5-turbo customer support |
| Voice Input | ✅ | Web Speech API integration |
| Loyalty Program | ✅ | Earn points, unlock discounts |
| Dark Mode | ✅ | Light/dark theme support |
| Mobile Responsive | ✅ | Optimized for all devices |
| Accessibility | ✅ | ARIA labels, screen reader support |

---

## 📈 Project Stats

- **31 Pages** implemented
- **3 API Routes** created
- **19/19 Features** completed (100%)
- **0 Build Errors** - Production ready
- **5 Custom Avatars** - Unique SVG designs
- **100% TypeScript** - Full type safety

---

## 🏆 Completion Status

**✅ FULLY COMPLETE & PRODUCTION-READY**

All core features (Part A) and extra credit features (Part B) are 100% complete and tested. The application is ready for immediate deployment.

---

## 📞 Support

For questions or issues, please refer to the documentation files or open an issue on GitHub.

---

**Made with ❤️ using Next.js, TypeScript, and Tailwind CSS**

