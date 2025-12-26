import { io } from "socket.io-client";

let socket = null;

/**
 * Initialize socket connection ONCE
 * Must be called with userId after login
 */
export const initSocket = (userId) => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      withCredentials: true,
    });

    socket.on("connect", () => {

      // 🔐 Authenticate socket with backend
      if (userId) {
        socket.emit("authenticate", userId);
      }
    });

    socket.on("authenticated", (data) => {
      // console.log("🔐 Socket authenticated:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connect error:", error.message);
    });

    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });
  }

  return socket;
};

/**
 * Get existing socket instance
 * (Should be initialized already)
 */
export const getSocket = () => {
  if (!socket) {
    console.warn("⚠️ Socket not initialized yet");
  }
  return socket;
};

/**
 * Disconnect socket (on logout)
 */
export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Disconnecting socket");
    socket.disconnect();
    socket = null;
  }
};
