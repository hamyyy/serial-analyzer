
import { writable } from "svelte/store";
import type { PortInfo } from "../../server/interfaces";
import { socket } from "./socket.store";

export const BaudList = [9600, 19200, 38400, 57600, 115200] as const;
const info = writable<{
    connected: boolean;
    port?: string;
    baud?: number;
}>({
    connected: false,
});

function list(): Promise<PortInfo[]> {
    return new Promise((resolve, reject) => {
        socket.emit("listPorts", (ports, error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(ports);
        });
    });
}

function send(message: string) {
    socket.emit("serial", message);
}

function subscribe(callback: (message: string) => void) {
    socket.on("serialData", callback);
    return () => {
        socket.off("serialData", callback);
    }
}

function connect(port: string, baud: number) {
    return new Promise<void>((resolve, reject) => {
        socket.emit("serialConnect", port, baud, (success, error) => {
            if (success) {
                info.update((i) => ({ ...i, connected: true, port, baud }));
                resolve();
            } else {
                reject(error);
            }
        });
    });
}

function disconnect() {
    return new Promise<void>((resolve, reject) => {
        socket.emit("serialDisconnect", (success, error) => {
            if (success) {

                info.update((i) => ({ ...i, connected: false, port: undefined, baud: undefined }));
                resolve();
            } else {
                reject(error);
            }
        });
    });
}

function onConnect(callback: (port: string, baud: number) => void, once = false) {
    if (once) {
        socket.once("serialConnected", callback);
        return () => {};
    }

    socket.on("serialConnected", callback);
    return () => {
        socket.off("serialConnected", callback);
    }
}

function onDisconnect(callback: () => void, once = false) {
    if (once) {
        socket.once("serialClosed", callback);
        return () => {};
    }

    socket.on("serialClosed", callback);
    return () => {
        socket.off("serialClosed", callback);
    };
}

export const serial = {
    list,
    send,
    subscribe,
    connect,
    disconnect,
    info,
    onConnect,
    onDisconnect,
};