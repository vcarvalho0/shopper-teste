import { useLocation } from "react-router-dom";
import { DirectionsLatLng, GoogleMapsMap } from "../components/map";
import { Card } from "../components/card";

type Review = {
  rating: number
  comment: string
}

export type DriverProps = {
  id?: number
  name: string
  description: string
  vehicle: string
  review: Review
  value: number
}

type AddressOriginDestination = {
  origin: string
  destination: string
}

export type RideEstimate = DirectionsLatLng & {
  customerId: string
  address: AddressOriginDestination
  distance: number
  duration: string
  options: DriverProps[]
}

export default function Ride() {
  const location = useLocation()
  const data = location.state as RideEstimate

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex justify-center items-center">
        <GoogleMapsMap
          origin={{
            latitude: data.origin.latitude,
            longitude: data.origin.longitude
          }}
          destination={{
            latitude: data.destination.latitude,
            longitude: data.destination.longitude
          }}
        />
      </div>
      <div className="p-10 overflow-y-auto">
        <h1 className="p-4 text-3xl overflow-y-auto">Opções de motoristas</h1>
        <div className="space-y-4">
          {data.options.length > 0 ? (
            data.options.map((drivers, index) => {
              return (
                <Card
                  key={index}
                  driver={drivers}
                  rideEstimate={data}
                />
              );
            })
          ) : (
            <p className="text-2xl text-center text-gray-500">Não há motoristas disponíveis para essa distância.</p>
          )}
        </div>
      </div>
    </div>
  )
}
