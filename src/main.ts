import "./app.scss"
import App from "./App.svelte";
import { Command } from "@tauri-apps/api/shell";
import { listen, TauriEvent } from "@tauri-apps/api/event";
import { socket } from "./stores/socket.store";


const cmd = Command.sidecar('binaries/server');

cmd.spawn().then((child) => {
  /**
   * Killing server process when window is closed. Probably won't
   * work for multi window application
   */
  listen(TauriEvent.WINDOW_DESTROYED, () => {
    socket.disconnect();
    child.kill();
  })
});


const app = new App({
  target: document.getElementById("app")!,
});

export default app;
