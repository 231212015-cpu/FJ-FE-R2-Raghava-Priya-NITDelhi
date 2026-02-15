// This is a client-side Socket.io helper for real-time chat
// To enable Socket.io in production, you'll need to:
// 1. npm install express socket.io
// 2. Create a separate Node.js server
// 3. Configure WebSocket URL in environment variables

import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (socket) return socket;

  // In production, replace with your actual socket server URL
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

  try {
    socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return socket;
  } catch (error) {
    console.error("Socket initialization error:", error);
    return null;
  }
};

export const getSocket = () => socket;

export const sendMessage = (
  driverId: string,
  message: string,
  callback?: (ack: any) => void
) => {
  if (!socket) {
    console.warn("Socket not initialized");
    return;
  }

  socket.emit("send_message", { driverId, message }, callback);
};

export const onMessageReceived = (callback: (data: any) => void) => {
  if (!socket) {
    console.warn("Socket not initialized");
    return;
  }

  socket.on("receive_message", callback);
};

export const subscribeToLocationUpdates = (
  rideId: string,
  callback: (location: { lat: number; lng: number }) => void
) => {
  if (!socket) {
    console.warn("Socket not initialized");
    return;
  }

  socket.emit("subscribe_location", rideId);
  socket.on(`location_update_${rideId}`, callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
