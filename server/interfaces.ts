
export type PortInfo = import("@serialport/bindings-cpp").PortInfo;

export interface ClientToServerEvents {
    serial: (msg: string) => void;
    serialWithResponse: (msg: string, callback: (msg: string) => void) => void;
    listPorts: (callback: (ports: any[], error?: string) => void) => void;
    serialConnect: (port: string, baud: number, callback: (success: boolean, error?: string) => void) => void; 
    serialDisconnect: (callback: (success: boolean, error?: string) => void) => void; 
}

export interface ServerToClientEvents {
    serialConnected: (port: string, baud: number) => void;
    serialClosed: () => void;
    serialData: (msg: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}