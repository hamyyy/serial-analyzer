
export type PortInfo = import("@serialport/bindings-cpp").PortInfo;

export interface ClientToServerEvents {
    serial: (msg: string) => void;
    serialWithResponse: (msg: string, callback: (msg: string) => void) => void;
    listPorts: (callback: (ports: any[]) => void) => void;
}

export interface ServerToClientEvents {
    serial: (msg: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}