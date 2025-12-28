import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket({ enabled, onOrderUpdate }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true, // if your socket auth relies on cookies
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      // console.log("socket connected", socket.id);
    });

    socket.on("order:update", (payload) => {
      onOrderUpdate?.(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, onOrderUpdate]);

  return socketRef;
}
