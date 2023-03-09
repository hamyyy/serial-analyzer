import { io, Socket } from "socket.io-client";
import { writable } from "svelte/store";
import type { ClientToServerEvents, ServerToClientEvents } from "../../server/interfaces";


export let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
export let socketInfo = writable({
    connected: false,
});

export function connectWebSocket() {
    socket = io("http://localhost:17655");
    socket.on("connect", () => {
        console.info("Connected to server");
        socketInfo.update((info) => {
            info.connected = true;
            return info;
        });
    });

    socket.on("disconnect", () => {
        console.warn("Disconnected from server");
        socketInfo.update((info) => {
            info.connected = false;
            return info;
        });
    });
}

export function disconnectWebSocket() {
    socket.disconnect();
}