import { appRouter } from "./root";
import {
  type CreateWSSContextFnOptions,
  applyWSSHandler,
} from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";

// This is how you initialize a context for the server
function createContext(_opts: CreateWSSContextFnOptions) {
  return {};
}

const wss = new WebSocketServer({ port: 3001 });
const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createContext,
});

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log("✅ WebSocket Server listening on ws://localhost:3001");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
