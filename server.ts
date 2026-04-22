import Fastify from "fastify";
import cors from "@fastify/cors";
import HandlerRequest from "@/interfaces/plugins/HandlerRequest";
import { SessionManager } from "@/infrastructure/repositories/SessionManager";
import { WebhookDispatcher } from "@/infrastructure/repositories/WebhookDispatcher";
import { BaileysConnector } from "@/infrastructure/repositories/Baileys/BaileysConnector";
import { SessionBootstrap } from "@/interfaces/plugins/SessionBootstrap";

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: "*",
});
await fastify.register(HandlerRequest);

// fastify.register(JWTRoutes, { prefix: "/" });

fastify.get("/status", async () => {
  return { status: true };
});

async function start() {
  const sessions = new SessionManager();
  const webhook = new WebhookDispatcher();
  const connector = new BaileysConnector(webhook, sessions);

  const bootstrap = new SessionBootstrap(connector);
  await bootstrap.init();

  await fastify.listen({ port: 3060, host: "0.0.0.0" });

  console.log("🚀 Server rodando + sessões inicializadas");
}

start();
