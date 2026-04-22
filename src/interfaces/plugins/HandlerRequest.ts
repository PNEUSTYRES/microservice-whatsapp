import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { DomainError } from "@/domain/utils/DomainError";

type ControllerFn<T = unknown> = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<T>;

// erro
export const HandlerError = (controllerFn: ControllerFn) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await controllerFn(request, reply);

      return result;
    } catch (err) {
      if (err instanceof DomainError) {
        return reply.code(200).send({ error: err.message, status: 409 });
      }

      console.log(err);
      return reply
        .code(500)
        .send({ error: "Erro interno do servidor.", status: 500 });
    }
  };
};

const HandlerRequest: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", async (req, reply) => {
    return HandlerError(async () => {})(req, reply);
  });
};

export default fp(HandlerRequest);
