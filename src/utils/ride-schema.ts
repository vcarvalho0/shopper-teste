import { z } from "zod";

export const estimateRideSchema = z
  .object({
    customer_id: z
      .string({
        required_error: "customer id cannot be empty",
        invalid_type_error: "customer id must be a string"
      })
      .min(1),
    origin: z
      .string({
        required_error: "origin id cannot be empty",
        invalid_type_error: "origin must be a string"
      })
      .min(1),
    destination: z
      .string({
        required_error: "destination cannot be empty",
        invalid_type_error: "destination must be a string"
      })
      .min(1)
  })
  .refine((data) => data.origin !== data.destination, {
    message: "origin and destination cannot be the same",
    path: ["destination"]
  });

export const confirmRideSchema = z.object({});
