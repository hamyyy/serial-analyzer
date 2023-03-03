import "./app.scss"
import App from "./App.svelte";
import { Command } from "@tauri-apps/api/shell";
import { listen, TauriEvent } from "@tauri-apps/api/event";
import { socket } from "./stores/socket.store";

if ((import.meta as any).env.PROD) {
  console.log("Launching server");
  const cmd = Command.sidecar('binaries/server');
  cmd.spawn().then((child) => {
    console.log("Server running");
    /**
     * Killing server process when window is closed. Probably won't
     * work for multi window application
    */
    listen(TauriEvent.WINDOW_DESTROYED, () => {
      socket.disconnect();
      child.kill();
      console.log("Server killed");
    })

    cmd.on("close", () => {
      console.warn("Server closed")
    })

    cmd.on("error", (error) => {
      console.log(`Server: ${error}`)
    })

    cmd.stdout.on("data", (line) => {
      console.log(line);
    })
    cmd.stderr.on("data", (line) => {
      console.error(line);
    })
  })
}


const app = new App({
  target: document.getElementById("app")!,
});

export default app;
