import { useState } from "react"
import { DriverProps, RideEstimate } from "../../pages/Ride"
import { Button } from "../button"
import { useNavigate } from "react-router-dom"

export type Review = {
  rating: number
  comment: string
}

type CardProps = {
  driver: DriverProps
  rideEstimate: RideEstimate
}

export function Card({
  driver,
  rideEstimate
}: CardProps) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const saveRide = async (selectedDriver: DriverProps) => {
    try {
      setLoading(true)

      const response = await fetch("http://localhost:8080/ride/confirm", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_id: rideEstimate.customerId,
          origin: rideEstimate.address.origin,
          destination: rideEstimate.address.destination,
          distance: rideEstimate.distance,
          duration: rideEstimate.duration,
          driver: {
            id: selectedDriver.id,
            name: selectedDriver.name
          },
          value: selectedDriver.value
        })
      })

      if (response.status === 200) {
        navigate("/ride/history")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-3 shadow-md bg-white w-full">
      <h2 className="text-xl font-semibold">{driver.name}</h2>
      <p className="text-gray-600">{driver.description}</p>
      <p className="text-gray-800 font-medium">Veículo: {driver.vehicle}</p>
      <div className="flex items-center justify-between my-2">
        <div>
          <p className="text-yellow-500">Avaliação: {driver.review.rating} ★</p>
          <p className="text-gray-500 text-sm italic">{driver.review.comment}</p>
        </div>
        <p className="text-green-600 font-bold">R$ {driver.value}</p>
      </div>
      <Button isLoading={loading} onClick={async () => await saveRide(driver)}>Escolher</Button>
    </div>
  )
}