import { io, Socket } from "socket.io-client"
let socket: Socket | null = null
export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
      transports: ["websocket"]
    })

    socket.on("connect", () => {
      console.log("🔌 Connected to WebSocket server")
    })

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket server")
    })
  }
  return socket
}
