
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./interfaces";
import { SerialPort } from "serialport"

const httpServer = createServer();
export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
  (httpServer, { cors: { origin: "*" } });

let connectCounter = 0;

export let socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> = null;

io.on("connection", (connection) => {
  connectCounter++;
  console.log("Client connected: " + connectCounter);

  connection.on("disconnect", () => {
    connectCounter--;
    console.log("Client disconnected: " + connectCounter);

    if (connectCounter === 0) {
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
}


io.listen(17655);

////////////////////


