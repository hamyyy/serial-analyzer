import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../server/interfaces";

const sio: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:17655");
export { sio as socket };

sio.on("connect", () => {
    console.log("connected");
});

sio.on("disconnect", () => {
    console.log("disconnected");
});