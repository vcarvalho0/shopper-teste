import { Ride } from "@prisma/client";

interface Driver {
  id: number;
  name: string;
}

export interface Rides {
  id: number;
  date: Date;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: Driver;
  value: number;
}

export class RidesMapper {
  static toRideResponse(ride: Ride): Rides {
    return {
      id: ride.id,
      date: ride.date,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: {
        id: ride.driverId,
        name: ride.driverName
      },
      value: ride.value
    };
  }
}
