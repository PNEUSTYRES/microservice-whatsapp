// container.ts
import { SessionManager } from "./src/infrastructure/repositories/SessionManager";
import { BaileysConnector } from "./src/infrastructure/repositories/Baileys/BaileysConnector";
import { eventBusSession } from "./src/infrastructure/events/EventBusSession";

export const sessionManager = new SessionManager();

export const baileysConnector = new BaileysConnector(
  sessionManager,
  eventBusSession,
);
