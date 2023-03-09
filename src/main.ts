import "./app.scss"
import App from "./App.svelte";
import { startServer } from "./util/startServer";

if ((import.meta as any).env.PROD) {
  startServer();
}

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
