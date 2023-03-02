
export interface ClientToServerEvents {
    greet: (msg: string, callback: (msg: string) => void) => void;
}

export interface ServerToClientEvents {
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}