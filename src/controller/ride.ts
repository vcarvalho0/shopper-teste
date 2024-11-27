import { RoutesAPI } from "@/services/routes-api";
import {
  confirmRideSchema,
  estimateRideSchema,
  getRideSchema
} from "@/utils/schemas/ride-schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/database";
import { RidesMapper } from "@/utils/mappers/ride-mapper";
import { z } from "zod";
import { Rides } from "@/utils/types";

const routesAPI = new RoutesAPI();

type EstimateRideBody = z.infer<typeof estimateRideSchema>;
type ConfirmRideBody = z.infer<typeof confirmRideSchema>;
type GetRideParams = z.infer<typeof getRideSchema>;

interface RidesResponse {
  customer_id: string;
  rides: Rides[];
}

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

      throw err;
    }
  }

  public async confirmRide(
    req: FastifyRequest<{ Body: ConfirmRideBody }>,
    reply: FastifyReply
  ) {
    try {
      const {
        customer_id,
        origin,
        destination,
        distance,
        duration,
        driver,
        value
      } = confirmRideSchema.parse(req.body);

      const findDriver = await prisma.drivers.findFirst({
        where: { id: driver.id, name: driver.name }
      });

      if (!findDriver) {
        return reply.code(404).send({
          error_code: "DRIVER_NOT_FOUND",
          error_description: "the selected driver was not found."
        });
      }

      if (distance < findDriver.minKm) {
        return reply.code(406).send({
          error_code: "INVALID_DISTANCE",
          error_description: `the selected driver only accepts mininal distance of ${findDriver.minKm} km.`
        });
      }

      await prisma.ride.create({
        data: {
          customer_id,
          origin,
          destination,
          value,
          distance,
          duration,
          date: new Date(),
          driverId: findDriver.id
        }
      });

      return reply.code(200).send({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return reply.code(400).send({
          error_code: "INVALID_DATA",
          error_description: err.errors[0].message
        });
      }

      throw err;
    }
  }

  public async getRides(
    req: FastifyRequest<{ Params: GetRideParams; Querystring: GetRideParams }>,
    reply: FastifyReply
  ) {
    const driverIdParam = Number(req.query.driver_id);
    const driverId = driverIdParam ? Number(driverIdParam) : undefined;

    const rides = await prisma.ride.findMany({
      where: {
        customer_id: req.params.customerId,
        driverId
      },
      include: { driver: true },
      orderBy: { date: "desc" }
    });

    if (driverId) {
      const findDriver = await prisma.drivers.findUnique({
        where: { id: driverIdParam }
      });

      if (!findDriver) {
        return reply.code(400).send({
          error_message: "INVALID_DRIVER",
          error_description: "the specified driver is not valid"
        });
      }
    }

    if (!rides.length) {
      return reply.code(404).send({
        error_message: "NO_RIDES_FOUND",
        error_description: "no rides found for this customer"
      });
    }

    const response: RidesResponse = {
      customer_id: req.params.customerId,
      rides: rides.map(RidesMapper.toRideResponse)
    };

    return reply.code(200).send(response);
  }
}
