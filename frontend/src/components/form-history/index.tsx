import { z } from 'zod'
import { Button } from '../button'
import { useForm } from 'react-hook-form'
import { Input } from '../input'
import { MagnifyingGlass } from "@phosphor-icons/react"
import { zodResolver } from '@hookform/resolvers/zod'
import { RideEstimateHistory } from '../../pages/RideHistory'
import { toast, ToastContainer } from 'react-toastify'

type FormHistoryProps = {
  setRides: React.Dispatch<React.SetStateAction<RideEstimateHistory[]>>
}

export function FormHistory({ setRides }: FormHistoryProps) {
  const formHistoryValidationSchema = z.object({
    customerId: z.string({ required_error: "Esse campo é obrigatório" }).min(1),
    driverId: z.string()
  })

  type FormHistoryValidation = z.infer<typeof formHistoryValidationSchema>

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormHistoryValidation>(
    {
      resolver: zodResolver(formHistoryValidationSchema)
    }
  )

  const onSubmit = async (data: FormHistoryValidation) => {
    try {
      const driverId = Number(data.driverId)
      const response = await fetch(`http://localhost:8080/ride/${data.customerId}${driverId ? `?driver_id=${driverId}` : ""}`)

      const result = await response.json()

      if (response.status === 404) {
        throw new Error("ID de usuário não foi encontrado")
      }

      setRides(result.rides)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown Error"
      toast.error(`Erro: ${errorMessage}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer position="bottom-right" />
      <div className="flex p-6 rounded-m">
        <div className="mb-4 px-4">
          <label className="block text-sm font-medium text-gray-700">
            ID do Usuário
          </label>
          <Input
            type="text"
            placeholder="ID do usuário"
            icon={<MagnifyingGlass color="black" />}
            register={register("customerId")}
          />
          {errors.customerId && (
            <span className="flex text-red-600 font-medium text-xs my-1">
              {errors.customerId?.message}
            </span>
          )}
        </div>
        <div className="mb-4 px-4">
          <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
            Seletor de Motorista
          </label>
          <select
            {...register("driverId")}
            id="driver"
            className="mt-1 h-10 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">Mostrar Todos</option>
            <option value="1">Hommer Simpson</option>
            <option value="2">Dominic Toretto</option>
            <option value="3">James Bond</option>
          </select>
        </div>
        <div className="flex items-center">
          <Button type="submit">Filtrar</Button>
        </div>
      </div>
    </form>
  )
}