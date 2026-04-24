import { SessionEvents } from "@/domain/events/SessionEvents";
import { EventBus } from "./EventBus";

const event = new EventBus<SessionEvents>();

event.on("session.qr.generated", async (payload) => {
  console.log("QR:", payload.qr);
});

event.on("session.connected", async (payload) => {
  console.log("Conectado:", payload.sessionId);
});

event.on("message.received", async (payload) => {
  console.log("Mensagem:", payload.data);
});

export const eventBusSession = event;
