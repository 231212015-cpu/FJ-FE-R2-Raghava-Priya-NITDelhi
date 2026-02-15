// Accessibility utilities for ARIA labels,roles, and keyboard navigation

export const a11y = {
  // Navigation labels
  nav: {
    main: "Main navigation",
    sidebar: "Sidebar navigation",
    back: "Go back to previous page",
  },

  // Interactive elements
  buttons: {
    close: "Close dialog",
    menu: "Open menu",
    submit: "Submit form",
    cancel: "Cancel action",
  },

  // Form fields
  form: {
    email: "Email address",
    password: "Password",
    phone: "Phone number",
    destination: "Enter your destination",
    pickup: "Select pickup location",
  },

  // Status and feedback
  status: {
    loading: "Loading content",
    error: "Error message",
    success: "Success message",
    typing: "Typing indicator",
  },

  // Notifications
  notifications: {
    bell: "Notifications",
    unread: "Unread notifications",
    close: "Close notification",
  },

  // Ride-related
  ride: {
    map: "Map view of your ride",
    driver: "Driver information",
    status: "Ride status",
    cancel: "Cancel ride",
    complete: "Complete ride",
  },

  // Chat
  chat: {
    input: "Type your message",
    send: "Send message",
    messages: "Message history",
    typing: "Driver is typing",
  },
};

// Keyboard navigation helpers
export const useKeyboard = {
  // Check if key is Enter
  isEnter: (e: React.KeyboardEvent) => e.key === "Enter",

  // Check if key is Escape
  isEscape: (e: React.KeyboardEvent) => e.key === "Escape",

  // Check if key is Arrow Down
  isArrowDown: (e: React.KeyboardEvent) => e.key === "ArrowDown",

  // Check if key is Arrow Up
  isArrowUp: (e: React.KeyboardEvent) => e.key === "ArrowUp",

  // Check if Space is pressed
  isSpace: (e: React.KeyboardEvent) => e.key === " ",

  // Check if Tab is pressed
  isTab: (e: React.KeyboardEvent) => e.key === "Tab",
};

// Focus management
export const focusManagement = {
  // Focus first interactive element
  focusFirst: (container: HTMLElement) => {
    const focusableElements =
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  },

  // Focus trap - keep focus within container
  trapFocus: (
    container: HTMLElement,
    e: React.KeyboardEvent
  ) => {
    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey && activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  },

  // Restore focus after closing modal
  restoreFocus: (previousActiveElement: HTMLElement) => {
    previousActiveElement?.focus();
  },
};

// Screen reader announcements
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};

// Live region for dynamic content
export const createLiveRegion = (id: string, polite = true) => {
  const region = document.createElement("div");
  region.id = id;
  region.setAttribute("aria-live", polite ? "polite" : "assertive");
  region.setAttribute("aria-atomic", "true");
  region.className = "sr-only";
  document.body.appendChild(region);
  return region;
};

export const updateLiveRegion = (id: string, message: string) => {
  const region = document.getElementById(id);
  if (region) {
    region.textContent = message;
  }
};
