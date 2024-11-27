import { useState } from "react";
import { FormHistory } from "../components/form-history";
import { format } from 'date-fns'
import { Car, Clock, CurrencyDollar, MapPin, RoadHorizon } from "@phosphor-icons/react";
import { ptBR } from "date-fns/locale";

export type RideEstimateHistory = {
  date: Date
  driver: {
    id: number
    name: string
  }
  origin: string
  destination: string
  distance: number
  duration: string
  value: number
}

export default function RideHistory() {
  const [rides, setRides] = useState<RideEstimateHistory[]>([])

  return (
    <div className="flex flex-col items-center mr-44 ml-44">
      <h1 className="text-3xl p-12">Histórico de Viagens</h1>
      <FormHistory setRides={setRides} />

      <div className="border-t border-gray-300 w-full my-4"></div>

      <div className="p-6 w-full">
        <h2 className="text-lg font-medium text-gray-700">Filtros</h2>

        {!rides.length && (
          <h2 className="text-2xl">Nenhuma viagem filtrada</h2>
        )}

        {rides.map((ride, index) => {
          return (
            <div className="container mx-auto px-4 py-8" key={index}>
              <div className="space-y-4">
                <div
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex flex-row items-start mb-2">
                        <span className="ml-2 font-bold">{format(new Date(ride.date), "d 'de' MMM 'de' yyyy", { locale: ptBR })}</span>
                        <span className="ml-2 font-bold">{format(new Date(ride.date), "HH:mm", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <MapPin className="mr-2 text-blue-500" />
                        <span className="font-semibold">Origem:</span>
                        <span className="ml-2">{ride.origin}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <MapPin className="mr-2 text-red-500" />
                        <span className="font-semibold">Destino:</span>
                        <span className="ml-2">{ride.destination}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Car className="mr-2" color="black" />
                        <span className="font-semibold">Motorista:</span>
                        <span className="ml-2">{ride.driver.name}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <Clock className="mr-2" color="black" />
                        <span className="font-semibold">Duração:</span>
                        <span className="ml-2">{ride.duration}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <RoadHorizon className="mr-2" color="black" />
                        <span className="font-semibold">Distancia:</span>
                        <span className="ml-2">{ride.distance / 1000} km</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center border-t pt-4">
                    <div className="flex items-center">
                      <CurrencyDollar className="mr-2 text-green-600" />
                      <span className="font-bold text-lg">
                        R$ {ride.value}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

