import { RoutesAPI } from "@/services/routes-api";
import { estimateRideSchema } from "@/utils/ride-schema";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const routesAPI = new RoutesAPI();

type EstimateRideBody = z.infer<typeof estimateRideSchema>;

export class RideController {
  public async estimateRide(
    req: FastifyRequest<{ Body: EstimateRideBody }>,
    reply: FastifyReply
  ) {
    try {
      const { origin, destination } = estimateRideSchema.parse(req.body);

      const estimatedRide = await routesAPI.estimateRide(origin, destination);

      return reply.code(200).send(estimatedRide);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return reply.code(400).send({
          error_code: "INVALID_DATA",
          error_description: err.errors[0].message
        });
      }

      if (err instanceof Error) {
        return reply.code(500).send({
          error_code: "INTERNAL_SERVER_ERROR",
          error_description: err.message
        });
      }
    }
  }
}
