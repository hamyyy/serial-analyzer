
import type { PortInfo } from "../../server/interfaces";
import { socket } from "./socket.store";

export function listPorts(): Promise<PortInfo[]> {
    return new Promise((resolve, reject) => {
        socket.emit("listPorts", (ports: PortInfo[]) => {
            resolve(ports);
        });
    });
}

export function sendSerial(message: string) {
    socket.emit("serial", message);
}

export function subscribeSerial(callback: (message: string) => void) {
    socket.on("serial", callback);
    return () => {
        socket.off("serial", callback);
    }
}