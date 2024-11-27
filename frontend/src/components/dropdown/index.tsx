import { useEffect, useState, useMemo } from "react"
import { UseFormSetValue } from "react-hook-form"
import { FormRideValidation } from "../form-ride"
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { toast } from "react-toastify"

type DropdownProps = {
  address: string
  setValue: UseFormSetValue<FormRideValidation>
  field: "origin" | "destination"
}

type PredictionProps = {
  description: string
  place_id: string
}

export function Dropdown({ address, field, setValue }: DropdownProps) {
  const [predictions, setPredictions] = useState<PredictionProps[]>([])
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null)
  const places = useMapsLibrary('places');

  const autocompleteService = useMemo(() => {
    if (!places) return null;

    return new places.AutocompleteService();
  }, [places]);

  useEffect(() => {
    const getPredictions = async () => {
      if (!autocompleteService || !address || address.length <= 2 || address === selectedPrediction) {
        setPredictions([]);
        return;
      }

      try {
        autocompleteService.getPlacePredictions(
          {
            input: address,
          },
          (results, status) => {
            if (status === places?.PlacesServiceStatus.OK) {
              setPredictions(results || []);
            } else {
              setPredictions([]);
            }
          }
        );
      } catch (error) {
        toast.error(`Error ao carregar endereços ${error}`)
        setPredictions([]);
      }
    };

    getPredictions();
  }, [address, autocompleteService, selectedPrediction, places]);

  const handleSelectPrediction = (prediction: PredictionProps) => {
    setValue(field, prediction.description)
    setSelectedPrediction(prediction.description)
    setPredictions([])
  }

  if (predictions.length === 0 || !address) {
    return null
  }

  return (
    <div className="relative w-full">
      <div className="absolute z-10 w-full rounded-lg border border-zinc-200 bg-white shadow-lg">
        <div className="max-h-[200px] overflow-y-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              onClick={() => handleSelectPrediction(prediction)}
              className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 cursor-pointer duration-100"
            >
              {prediction.description}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}