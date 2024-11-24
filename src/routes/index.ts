import { RideController } from "@/controller/ride";
import { FastifyInstance } from "fastify";

const rideController = new RideController();

export function registerRoutes(fastify: FastifyInstance) {
  fastify.post("/ride/estimate", rideController.estimateRide);
}
