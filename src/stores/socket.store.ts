import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../../server/interfaces";


export let socket: Socket<ServerToClientEvents, ClientToServerEvents> = null;

export function connectWebSocket() {   
    socket = io("http://localhost:17655");
    socket.on("connect", () => {
        console.info("Connected to server");
    });
    
    socket.on("disconnect", () => {
        console.warn("Disconnected from server");
    });
}

export function disconnectWebSocket() {
    socket.disconnect();
}