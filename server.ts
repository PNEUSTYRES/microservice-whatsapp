import Fastify from "fastify";
import cors from "@fastify/cors";
import HandlerRequest from "@/interfaces/plugins/HandlerRequest";

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: "*",
});
await fastify.register(HandlerRequest);

// fastify.register(JWTRoutes, { prefix: "/" });

fastify.get("/status", async () => {
  return { status: true };
});

fastify.listen({ port: 3060, host: "0.0.0.0" });
