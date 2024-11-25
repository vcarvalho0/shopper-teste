import { RideController } from "@/controller/ride";
import { FastifyInstance } from "fastify";

const rideController = new RideController();

export function registerRoutes(fastify: FastifyInstance) {
  fastify.post("/ride/estimate", rideController.estimateRide);
  fastify.patch("/ride/confirm", rideController.confirmRide);
  fastify.get("/ride/:customerId", rideController.getRides);
}
