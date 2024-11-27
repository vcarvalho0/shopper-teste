import { Decimal } from "@prisma/client/runtime/library";
import { Rides, RidesWithDrivers } from "../types";

export class RidesMapper {
  static toRideResponse(ride: RidesWithDrivers): Rides {
    return {
      id: ride.id,
      date: ride.date,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: {
        id: ride.driver.id,
        name: ride.driver.name
      },
      value: new Decimal(ride.value)
    };
  }
}
