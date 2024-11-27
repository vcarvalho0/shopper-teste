import "./config/module-alias";
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

async function startServer() {
  try {
    await app.listen({ port: 8080, host: "0.0.0.0" });
    console.log("Server listening on http://localhost:8080");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();
