import Fastify from "fastify";
import cors from "@fastify/cors";
import HandlerRequest from "@/interfaces/plugins/HandlerRequest";
import { SessionRoutes } from "@/interfaces/routes/SessionRoutes";
import { SessionBootstrap } from "@/interfaces/plugins/SessionBootstrap";
import { SessionRepositoryPrisma } from "@/infrastructure/repositories/SessionRepositoryPrisma";
import { baileysConnector } from "container";

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: "*",
});

await fastify.register(HandlerRequest);

fastify.register(SessionRoutes, { prefix: "/" });
fastify.get("/status", async () => {
  return { status: true };
});

async function start() {
  const repositorySession = new SessionRepositoryPrisma();

  const sessionBootstrap = new SessionBootstrap(
    baileysConnector,
    repositorySession,
  );

  await sessionBootstrap.init();
  await fastify.listen({ port: 3060, host: "0.0.0.0" });

  console.log("🚀 Server rodando + sessões inicializadas");
}

start();
