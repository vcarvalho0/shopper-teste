import axios from "axios";
import { prisma } from "@/database";
import { RoutesAPIResponse, RoutesResponseNormalized } from "@/utils/types";

export class RoutesAPI {
  readonly googleFieldMask =
    "routes.distanceMeters,routes.duration,routes.legs.startLocation,routes.legs.endLocation";

  constructor(private request = axios) {}

  public async estimateRide(
    origin: string,
    destination: string
  ): Promise<RoutesResponseNormalized> {
    try {
      const response = await this.request.post<RoutesAPIResponse>(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          origin: { address: origin },
          destination: { address: destination },
          travelMode: "DRIVE"
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-FieldMask": this.googleFieldMask,
            "X-Goog-Api-Key": process.env.GOOGLE_API_KEY
          }
        }
      );

      return this.normalizeResponse(response.data);
    } catch (err) {
      throw new Error(`Fail while trying to estimate the route: ${err}`);
    }
  }

  private async getAvailableDrivers(distanceInKm: number) {
    const drivers = await prisma.drivers.findMany({
      where: {
        minKm: {
          lte: distanceInKm
        }
      },
      include: { review: true }
    });

    return drivers
      .map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: {
          rating: driver.review.rating,
          comment: driver.review.comment
        },
        value: this.calculateDriverPrice(
          driver.pricePerKm.toNumber(),
          distanceInKm
        )
      }))
      .sort((a, b) => a.value - b.value);
  }

  private calculateDriverPrice(
    pricePerKm: number,
    distanceInKm: number
  ): number {
    return Number((pricePerKm * distanceInKm).toFixed(2));
  }

  private async normalizeResponse(
    data: RoutesAPIResponse
  ): Promise<RoutesResponseNormalized> {
    const route = data.routes[0];
    const distanceInKm = route.distanceMeters / 1000;
    const durationInSeconds = route.duration.replace("s", "");

    return {
      origin: {
        latitude: route.legs[0].startLocation.latLng.latitude,
        longitude: route.legs[0].startLocation.latLng.longitude
      },
      destination: {
        latitude: route.legs[0].endLocation.latLng.latitude,
        longitude: route.legs[0].endLocation.latLng.longitude
      },
      distance: route.distanceMeters,
      duration: `${Math.floor(parseInt(durationInSeconds) / 60)} minutos`,
      options: await this.getAvailableDrivers(distanceInKm),
      routeResponse: data
    };
  }
}
