import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
import { useEffect, useState } from "react"

type LatLng = {
  latitude: number
  longitude: number
}

export type DirectionsLatLng = {
  origin: LatLng,
  destination: LatLng
}

export function GoogleMapsMap({ origin, destination }: DirectionsLatLng) {
  return (
    <div>
      <Map
        className="h-[45vw] w-[45vw] rounded-xl shadow-xl overflow-hidden"
        disableDefaultUI={true}
        defaultZoom={3}
        defaultCenter={{
          lat: origin.latitude,
          lng: origin.longitude
        }}
        mapId={"DEMO_MAP_ID"}
        colorScheme="DARK"
        gestureHandling={"greedy"}
      >
        <Directions
          origin={{
            latitude: origin.latitude,
            longitude: origin.longitude
          }}
          destination={{
            latitude: destination.latitude,
            longitude: destination.longitude
          }} />
      </Map>
    </div>
  )
}

function Directions({ origin, destination }: DirectionsLatLng) {
  const map = useMap()
  const routesLibrary = useMapsLibrary("routes")
  const [directionService, setDirectionService] = useState<google.maps.DirectionsService>()
  const [directionRenderer, setDirectionRenderer] = useState<google.maps.DirectionsRenderer>()

  useEffect(() => {
    if (!routesLibrary || !map) return

    setDirectionService(new routesLibrary.DirectionsService())
    setDirectionRenderer(new routesLibrary.DirectionsRenderer({ map }))
  }, [routesLibrary, map])

  useEffect(() => {
    if (!directionService || !directionRenderer) return

    directionService.route({
      origin: { lat: origin.latitude, lng: origin.longitude },
      destination: { lat: destination.latitude, lng: destination.longitude },
      travelMode: google.maps.TravelMode.DRIVING,
    }).then(response => {
      directionRenderer.setDirections(response)
    })
  }, [directionService, directionRenderer, origin, destination])

  return null
}