import axios from "axios";
import { env } from "@/env";
import { drivers } from "./drivers.json";

interface DriverRating {
  rating: number;
  comment: string;
}

interface DriverOptions {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: DriverRating;
  value: number;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

interface Location {
  latLng: LatLng;
}

interface Leg {
  startLocation: Location;
  endLocation: Location;
}

interface Route {
  legs: Leg[];
  distanceMeters: number;
  duration: string;
}

interface RoutesAPIResponse {
  routes: Route[];
}

interface RoutesAPIResponseNormalized {
  origin: LatLng;
  destination: LatLng;
  distance: number;
  duration: string;
  options: DriverOptions[];
  routeResponse: RoutesAPIResponse;
}

export class RoutesAPI {
  readonly googleFieldMask =
    "routes.distanceMeters,routes.duration,routes.legs.startLocation,routes.legs.endLocation";

  constructor(private request = axios) {}

  public async estimateRide(
    origin: string,
    destination: string
  ): Promise<RoutesAPIResponseNormalized> {
    const response = await this.request.post<RoutesAPIResponse>(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin: {
          address: origin
        },
        destination: {
          address: destination
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": this.googleFieldMask,
          "X-Goog-Api-Key": env.GOOGLE_API_KEY
        }
      }
    );

    return this.normalizeResponse(response.data);
  }

  private getAvailableDrivers(distanceInKm: number) {
    return drivers
      .filter((driver) => distanceInKm >= driver.minKm)
      .map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: {
          rating: driver.review.rating,
          comment: driver.review.comment
        },
        value: this.calculateDriverPrice(driver.pricePerKm, distanceInKm)
      }))
      .sort((a, b) => a.value - b.value);
  }

  private calculateDriverPrice(
    pricePerKm: number,
    distanceInKm: number
  ): number {
    return Number((pricePerKm * distanceInKm).toFixed(2));
  }

  private normalizeResponse(
    data: RoutesAPIResponse
  ): RoutesAPIResponseNormalized {
    const route = data.routes[0];
    const distanceInKm = route.distanceMeters / 1000;
    const durationInSeconds = parseInt(route.duration.replace("s", ""));

    return {
      origin: {
        latitude: route.legs[0].startLocation.latLng.latitude,
        longitude: route.legs[0].startLocation.latLng.longitude
      },
      destination: {
        latitude: route.legs[0].endLocation.latLng.latitude,
        longitude: route.legs[0].endLocation.latLng.longitude
      },
      distance: distanceInKm,
      duration: `${Math.floor(durationInSeconds / 60)} minutos`,
      options: this.getAvailableDrivers(distanceInKm),
      routeResponse: data
    };
  }
}
