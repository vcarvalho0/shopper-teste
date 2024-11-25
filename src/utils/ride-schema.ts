import { z } from "zod";

export const estimateRideSchema = z
  .object({
    customer_id: z.string({ required_error: "customer id is required" }).min(1),
    origin: z.string({ required_error: "origin is required" }).min(1),
    destination: z.string({ required_error: "destination is required" }).min(1)
  })
  .refine((data) => data.origin !== data.destination, {
    message: "origin and destination cannot be the same",
    path: ["destination"]
  });

export const confirmRideSchema = z
  .object({
    customer_id: z.string({ required_error: "customer id is required" }).min(1),
    origin: z.string({ required_error: "origin is required" }).min(1),
    destination: z.string({ required_error: "destination is required" }).min(1),
    distance: z.number({ required_error: "distance is required" }).min(1),
    duration: z.string({ required_error: "duration is required" }).min(1),
    driver: z.object(
      {
        id: z.number().min(1),
        name: z.string().min(1)
      },
      { required_error: "driver is required" }
    ),
    value: z.number({ required_error: "value is required" }).min(1)
  })
  .refine((data) => data.origin !== data.destination, {
    message: "origin and destination cannot be the same",
    path: ["destination"]
  });

export const getRideSchema = z.object({
  customerId: z.string({ required_error: "customer id is required" }).min(1),
  driver_id: z.number().optional()
});
