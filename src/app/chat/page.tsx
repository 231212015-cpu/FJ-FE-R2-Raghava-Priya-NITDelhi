"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Send,
  Phone,
  MoreVertical,
  Image as ImageIcon,
  Mic,
  MicOff,
  Smile,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { a11y, useKeyboard, announceToScreenReader } from "@/lib/accessibility";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface Message {
  id: string;
  senderId: string;
  senderType: "user" | "driver";
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

const mockDriver = {
  id: "driver-1",
  name: "Rajesh Kumar",
  avatar: "/assets/avatar-male-2.svg",
  isOnline: true,
};

// Mock initial messages
const initialMessages: Message[] = [
  {
    id: "1",
    senderId: "driver-1",
    senderType: "driver",
    content: "Hi! I'm on my way to pick you up.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "read",
  },
  {
    id: "2",
    senderId: "user-1",
    senderType: "user",
    content: "Great! I'm waiting at the main entrance.",
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    status: "read",
  },
  {
    id: "3",
    senderId: "driver-1",
    senderType: "driver",
    content: "I'll be there in about 3 minutes. I'm in a white Maruti Dzire.",
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    status: "read",
  },
];

// Quick replies
const quickReplies = [
  "I'm here",
  "On my way",
  "5 more minutes",
  "Can you wait?",
  "I see you!",
];

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice recognition
  const { isListening, isSupported, toggleListening } = useVoiceRecognition({
    onResult: (transcript) => {
      setInputText((prev) => prev + " " + transcript);
      announceToScreenReader(`Voice input: ${transcript}`);
    },
    onError: (error) => {
      console.error("Voice error:", error);
    },
    continuous: false,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate driver typing and response
  useEffect(() => {
    if (messages.length > initialMessages.length) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderType === "user") {
        // Simulate driver typing
        setTimeout(() => setIsTyping(true), 1000);
        
        // Simulate driver response
        setTimeout(() => {
          setIsTyping(false);
          const responses = [
            "Got it, thanks!",
            "Okay, see you soon!",
            "No problem!",
            "Sure thing!",
            "Understood!",
          ];
          const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];
          
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              senderId: "driver-1",
              senderType: "driver",
              content: randomResponse,
              timestamp: new Date(),
              status: "delivered",
            },
          ]);
        }, 2500);
      }
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || "user-1",
      senderType: "user",
      content: text.trim(),
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      announceToScreenReader(`Message sent: ${inputText}`);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (useKeyboard.isEnter(e) && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        sendMessage(inputText);
        announceToScreenReader(`Message sent: ${inputText}`);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 sm:p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label={a11y.nav.back}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary overflow-hidden">
                <Image
                  src={mockDriver.avatar}
                  alt={mockDriver.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              {mockDriver.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" aria-label="Driver online" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{mockDriver.name}</h2>
              <p className="text-xs text-muted-foreground" aria-live="polite">
                {isTyping ? "Typing..." : mockDriver.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/call")}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="Call driver"
          >
            <Phone className="w-5 h-5 text-primary-foreground" />
          </button>
          <button 
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-label={a11y.chat.messages} aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderType === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] ${
                message.senderType === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              } rounded-2xl px-4 py-2.5 ${
                message.senderType === "user"
                  ? "rounded-br-md"
                  : "rounded-bl-md"
              }`}
              role="article"
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderType === "user"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3" aria-label={a11y.status.typing} role="status">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 pb-2 overflow-x-auto">
        <div className="flex gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => {
                sendMessage(reply);
                announceToScreenReader(`Quick reply sent: ${reply}`);
              }}
              className="flex-shrink-0 px-4 py-2 bg-muted rounded-full text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
              aria-label={`Send quick reply: ${reply}`}
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background safe-area-bottom">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors flex-shrink-0"
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={a11y.chat.input}
              aria-label={a11y.chat.input}
              className="w-full h-12 px-4 pr-12 rounded-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Attach image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>

          {inputText.trim() ? (
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
              aria-label={a11y.chat.send}
            >
              <Send className="w-5 h-5 text-primary-foreground" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleListening}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                isListening
                  ? "bg-destructive animate-pulse"
                  : "bg-muted hover:bg-muted/80"
              }`}
              aria-label={isListening ? "Stop voice recording" : "Start voice recording"}
              disabled={!isSupported}
              title={!isSupported ? "Voice input not supported in this browser" : ""}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
