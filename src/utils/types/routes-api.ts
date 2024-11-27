interface LatLng {
  latitude: number;
  longitude: number;
}

interface Location {
  latLng: LatLng;
}

interface RouteLeg {
  startLocation: Location;
  endLocation: Location;
}

interface GoogleRoute {
  legs: RouteLeg[];
  distanceMeters: number;
  duration: string;
}

export interface RoutesAPIResponse {
  routes: GoogleRoute[];
}

interface DriverRating {
  rating: number;
  comment: string;
}

interface DriverOption {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: DriverRating;
  value: number;
}

export interface RoutesResponseNormalized {
  origin: LatLng;
  destination: LatLng;
  distance: number;
  duration: string;
  options: DriverOption[];
  routeResponse: RoutesAPIResponse;
}
