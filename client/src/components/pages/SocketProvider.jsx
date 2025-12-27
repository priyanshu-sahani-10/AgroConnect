import { useEffect } from "react";
import { useSelector } from "react-redux";
import { initSocket } from "../../services/socket";

export default function SocketProvider({ children }) {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?._id) {
      console.log("⏸️ No user logged in, socket not initialized");
      return;
    }

    // console.log("🔌 Initializing Socket.io for user:", user._id);

    const socket = initSocket(user._id);

    socket.on("connect", () => {
      // console.log("🟢 Socket connected (frontend)");
      window.dispatchEvent(new Event("socket-ready"));
    });

    return () => {
      console.log("🔌 Disconnecting socket for user:", user._id);
      socket.disconnect();
    };
  }, [user?._id]);

  return <>{children}</>;
}
