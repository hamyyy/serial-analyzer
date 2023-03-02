import { Server } from "socket.io";
import { createServer } from "http";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./interfaces";

const httpServer = createServer();
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
  (httpServer, { cors: { origin: "*" } });

let connectCounter = 0;

io.on("connection", (socket) => {

  connectCounter++;
  socket.on("disconnect", () => {
    connectCounter--;

    if (connectCounter === 0) process.exit(0);
  });

  if (connectCounter > 1) {
    socket.disconnect(true);
    return;
  }

  socket.on("greet", (msg, cb) => {
    cb(`Hello, ${msg}, from NodeJS!`);
    // io.emit("r/greet", `Hello, ${msg}, from NodeJS!`);
  });
});

io.listen(17655);