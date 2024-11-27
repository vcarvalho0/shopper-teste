import { Drivers, Ride } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

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
  value: Decimal;
}

export type RidesWithDrivers = Ride & {
  driver: Drivers;
};
