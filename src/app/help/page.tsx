"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Search,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Bot,
  Send,
  Phone,
  Mail,
  FileText,
  CreditCard,
  MapPin,
  Shield,
  HelpCircle,
  ExternalLink,
  Mic,
  MicOff,
} from "lucide-react";
import { toast } from "sonner";
import { a11y, announceToScreenReader } from "@/lib/accessibility";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <HelpCircle className="w-5 h-5" />,
    faqs: [
      {
        question: "How do I book a ride?",
        answer: "Open the app, enter your destination, choose your ride type, and tap 'Book Ride'. You'll be matched with a nearby driver.",
      },
      {
        question: "How do I create an account?",
        answer: "Download the app and sign up using your email or phone number. You'll need to verify your account to start booking rides.",
      },
      {
        question: "Is BluRide available in my city?",
        answer: "BluRide is available in over 100 cities across India. Check the app to see if service is available in your area.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & Pricing",
    icon: <CreditCard className="w-5 h-5" />,
    faqs: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept credit/debit cards, UPI, Paytm, PhonePe, Google Pay, and BluRide wallet balance.",
      },
      {
        question: "How is the fare calculated?",
        answer: "Fares are calculated based on distance, time, demand, and the ride type selected. You'll see an estimated fare before booking.",
      },
      {
        question: "Can I tip my driver?",
        answer: "Yes! You can add a tip after your ride is completed. 100% of the tip goes directly to your driver.",
      },
    ],
  },
  {
    id: "safety",
    title: "Safety & Security",
    icon: <Shield className="w-5 h-5" />,
    faqs: [
      {
        question: "How are drivers verified?",
        answer: "All drivers undergo background checks, vehicle inspections, and must maintain a minimum rating to drive on our platform.",
      },
      {
        question: "Can I share my ride details with someone?",
        answer: "Yes! Tap 'Share Trip' during your ride to send real-time location updates to friends or family.",
      },
      {
        question: "What if I feel unsafe during a ride?",
        answer: "Use the emergency button in the app to contact local authorities. You can also report the ride after it ends.",
      },
    ],
  },
  {
    id: "rides",
    title: "During Your Ride",
    icon: <MapPin className="w-5 h-5" />,
    faqs: [
      {
        question: "Can I change my destination during a ride?",
        answer: "Yes, tap on your destination in the app during the ride to edit it. The fare will be recalculated.",
      },
      {
        question: "What if my driver cancels?",
        answer: "You'll be automatically matched with another nearby driver. If you're charged a cancellation fee incorrectly, contact support.",
      },
      {
        question: "Can I request a specific driver?",
        answer: "Currently, you cannot request specific drivers. However, you can favorite drivers for future reference.",
      },
    ],
  },
];

const supportOptions = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Live Chat",
    description: "Chat with our support team",
    action: "chat",
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "Help Chatbot",
    description: "Instant FAQ assistant",
    action: "bot",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    description: "24/7 phone support",
    action: "call",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    description: "Get help via email",
    action: "email",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("getting-started");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { id: string; role: "assistant" | "user"; content: string }[]
  >([
    {
      id: "welcome",
      role: "assistant" as const,
      content:
        "Hi! I am the Ride FAQ assistant. Ask me about booking, payments, safety, or ride changes.",
    },
  ]);

  // Voice recognition for chatbot
  const { isListening, isSupported, toggleListening } = useVoiceRecognition({
    onResult: (transcript) => {
      setChatInput((prev) => prev + " " + transcript);
      announceToScreenReader(`Voice input: ${transcript}`);
    },
    onError: (error) => {
      console.error("Voice error:", error);
    },
    continuous: false,
  });

  const handleSupportAction = (action: string) => {
    switch (action) {
      case "chat":
        toast.info("Live chat coming soon!");
        break;
      case "bot":
        setShowChatbot(true);
        break;
      case "call":
        window.location.href = "tel:+1800123456";
        break;
      case "email":
        window.location.href = "mailto:support@bluride.app";
        break;
    }
  };

  const handleSendMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: trimmed,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsBotTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversationHistory: chatMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();
      const reply = data.reply || "I couldn't process that request.";

      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant" as const,
          content: reply,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant" as const,
          content:
            "Sorry, I couldn't connect to the assistant. Please try again.",
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const filteredCategories = searchQuery
    ? faqCategories.map((category) => ({
        ...category,
        faqs: category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((category) => category.faqs.length > 0)
    : faqCategories;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 sm:p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label={a11y.nav.back}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Help & Support</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) {
                announceToScreenReader(`Showing results for: ${e.target.value}`);
              }
            }}
            placeholder="Search for help..."
            aria-label="Search help articles"
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Support Options */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Contact Support</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {supportOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSupportAction(option.action)}
                className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors"
                aria-label={`${option.title}: ${option.description}`}
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {option.icon}
                </div>
                <p className="font-medium text-foreground text-sm">{option.title}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Help Chatbot */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Help Chatbot</h3>
                <p className="text-xs text-muted-foreground">
                  AI-powered FAQ assistant (OpenAI powered)
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowChatbot((prev) => !prev);
                announceToScreenReader(`Chatbot ${showChatbot ? "closed" : "opened"}`);
              }}
              className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold"
              aria-label={showChatbot ? "Hide chatbot" : "Show chatbot"}
              aria-expanded={showChatbot}
            >
              {showChatbot ? "Hide" : "Open"}
            </button>
          </div>

          {showChatbot && (
            <div className="space-y-3">
              <div className="h-56 overflow-y-auto bg-muted/40 rounded-xl p-3 space-y-2" role="log" aria-label="Chat conversation" aria-live="polite">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border text-foreground"
                      }`}
                      role="article"
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-3 py-2 text-sm bg-background border border-border text-muted-foreground" role="status" aria-label="Bot is typing">
                      Typing...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={a11y.chat.input}
                  aria-label={a11y.chat.input}
                  className="flex-1 h-11 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {chatInput.trim() ? (
                  <button
                    onClick={handleSendMessage}
                    className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                    aria-label={a11y.chat.send}
                    disabled={isBotTyping}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={toggleListening}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                      isListening
                        ? "bg-destructive animate-pulse"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    aria-label={isListening ? "Stop voice recording" : "Start voice recording"}
                    disabled={!isSupported || isBotTyping}
                    title={!isSupported ? "Voice input not supported" : ""}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-white" />
                    ) : (
                      <Mic className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => router.push("/complain")}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-foreground">Report an Issue</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="border-t border-border" />
            <button
              onClick={() => router.push("/history")}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-foreground">View Ride History</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="border-t border-border" />
            <button
              onClick={() => router.push("/payment")}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-left"
            >
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-foreground">Payment Issues</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    )
                  }
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {category.icon}
                  </div>
                  <span className="flex-1 font-medium text-foreground text-left">
                    {category.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedCategory === category.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* FAQs */}
                {expandedCategory === category.id && (
                  <div className="border-t border-border">
                    {category.faqs.map((faq, faqIndex) => (
                      <div key={faqIndex}>
                        {faqIndex > 0 && <div className="border-t border-border" />}
                        <button
                          onClick={() =>
                            setExpandedFaq(
                              expandedFaq === `${category.id}-${faqIndex}`
                                ? null
                                : `${category.id}-${faqIndex}`
                            )
                          }
                          className="w-full p-4 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {faq.question}
                              </p>
                              {expandedFaq === `${category.id}-${faqIndex}` && (
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </p>
                              )}
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                                expandedFaq === `${category.id}-${faqIndex}`
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-primary/10 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-foreground mb-2">
            Still need help?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is available 24/7 to assist you
          </p>
          <button
            onClick={() => handleSupportAction("chat")}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Start Live Chat
          </button>
        </div>
      </div>
    </div>
  );
}
