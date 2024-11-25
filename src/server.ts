import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerRoutes } from "./routes";

const app = Fastify({
  logger: true
});

app.register(cors, {
  origin: "*"
});

app.register(registerRoutes);

app.get("/", () => {
  return { hello: "world" };
});

try {
  await app.listen({ port: 8080 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
