import { createApp } from "./app.js";
import { env } from "./config/environment.js";

const app = createApp();

const server = app.listen(env.apiPort, env.apiHost, () => {
  console.log(`Sellit backend listening on http://${env.apiHost}:${env.apiPort}`);
});

server.on("error", (error) => {
  console.error("Failed to start backend server", error);
  process.exit(1);
});
