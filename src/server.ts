import Fastify from "fastify";

const fastify = Fastify({
  logger: true
});

fastify.get("/", () => {
  return { hello: "world" };
});

try {
  await fastify.listen({ port: 8080 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
