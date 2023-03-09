
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./interfaces";
import { ReadlineParser, SerialPort } from "serialport"

const httpServer = createServer();
export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
  (httpServer, { cors: { origin: "*" } });

let connectCounter = 0;

export let socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

let connectedPort: SerialPort | null = null;
let parser: ReadlineParser | null = null;

const timeoutID = setTimeout(() => process.exit(0), 10000);
io.on("connection", (connection) => {
  connectCounter++;
  clearTimeout(timeoutID);
  console.log("Client connected: " + connectCounter);

  connection.on("disconnect", () => {
    connectCounter--;
    connectedPort?.close();
    console.log("Client disconnected: " + connectCounter);

    if (connectCounter === 0 && !process.env.TAURI_DEBUG) {
      setTimeout(() => {
        if (connectCounter === 0) {
          console.log("No clients connected, exiting");
          process.exit(0);
        }
      }, 5000);
    }
  });

  if (connectCounter > 1) {
    connection.disconnect(true);
    return;
  }

  // connection.on("greet", (msg, cb) => {
  //     cb(`Hello, ${msg}, from NodeJS!`);
  //     // io.emit("r/greet", `Hello, ${msg}, from NodeJS!`);
  // });

  setupSerial(connection);
});


function setupSerial(socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
  socket.on("listPorts", (callback) => {
    SerialPort.list().then(ports => {
      callback(ports);
    });
  });

  socket.on("serialConnect", async (port, baud, callback) => {
    if (connectedPort && connectedPort.isOpen) await new Promise<void>((resolve: any) => connectedPort?.close(resolve));

    try {
      connectedPort = new SerialPort({
        path: port,
        baudRate: baud
      });
    } catch (e) {
      callback(false, e.stack ?? e.message);
      console.error(e);
      return;
    }

    parser = connectedPort.pipe(new ReadlineParser({ delimiter: "\n" }));

    connectedPort.on("open", () => {
      callback(true);
      socket.emit("serialConnected", port, baud);
      console.log("Connected to " + port + " at " + baud);
    });
    connectedPort.on("error", (e) => {
      callback(false, e.stack ?? e.message);
    });
    connectedPort.on("close", () => {
      socket.emit("serialClosed");
      console.log("Disconnected from serial port");
    });


    parser.on("data", (data) => {
      socket.emit("serialData", data.toString());
    });
  });

  socket.on("serialDisconnect", (callback) => {
    connectedPort?.close((err) => {    
      if (err) {
        callback(false, err.stack ?? err.message);
      } else {
        callback(true);
        connectedPort = null;
      }
    });
    if (!connectedPort) {
      callback(true);
    }
  });
}


io.listen(17655);

////////////////////


