import { useForm } from "react-hook-form";
import { Form } from "../form";
import { Input } from "../input";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { Dropdown } from "../dropdown";
import { MapPin, Flag, User } from "@phosphor-icons/react"
import { useNavigate } from 'react-router-dom'
import { Button } from "../button";
import { toast, ToastContainer } from "react-toastify";

const formRideValidationSchema = z.object({
  customerId: z.string().min(1, { message: "Esse campo é obrigatório" }),
  origin: z.string().min(1, { message: "Esse campo é obrigatório" }),
  destination: z.string().min(1, { message: "Esse campo é obrigatório" })
})

export type FormRideValidation = z.infer<typeof formRideValidationSchema>

export function FormRide() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
    setValue,
  } = useForm<FormRideValidation>(
    {
      resolver: zodResolver(formRideValidationSchema),
      defaultValues: { customerId: "", destination: "", origin: "" }
    }
  )
  const navigate = useNavigate()

  const origin = watch("origin")
  const destination = watch("destination")

  const onSubmit = async (data: FormRideValidation) => {
    try {
      const response = await fetch("http://localhost:8080/ride/estimate", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          customer_id: data.customerId,
          origin: data.origin,
          destination: data.destination
        })
      })

      if (!import.meta.env.VITE_GOOGLE_API_KEY) {
        toast.error("Missing GOOGLE_API_KEY in env")
      }

      const result = await response.json()

      if (response.status === 200) {
        navigate("/ride", {
          state: {
            ...result,
            customerId: data.customerId,
            address: {
              origin: data.origin,
              destination: data.destination
            }
          }
        })
      }
    } catch (error) {
      toast.error(`Erro ao estimar viagem tente novamente ${error}`)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} title="Estimar Viagem">
      <ToastContainer position="bottom-right" />
      <div className="flex justify-center flex-col my-8 space-x-1 space-y-4">
        <div>
          <Input
            type="text"
            placeholder="ID do usuário"
            icon={<User color="black" />}
            error={errors.customerId?.message}
            register={register("customerId")}
          />
          {errors.customerId && (
            <span className="flex text-red-600 font-medium text-xs my-1">
              {errors.customerId?.message}
            </span>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Endereço de origem"
            icon={<MapPin color="black" />}
            error={errors.origin?.message}
            register={register("origin")}
          />
          <Dropdown
            address={origin}
            field="origin"
            setValue={setValue}
          />
          {errors.origin && (
            <span className="flex text-red-600 font-medium text-xs my-1">
              {errors.destination?.message}
            </span>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Endereço de destino"
            icon={<Flag color="black" />}
            error={errors.destination?.message}
            register={register("destination")}
          />
          <Dropdown
            address={destination}
            field="destination"
            setValue={setValue}
          />
          {errors.destination && (
            <span className="flex text-red-600 font-medium text-xs my-1">
              {errors.destination?.message}
            </span>
          )}
        </div>
        <Button isLoading={isSubmitting} type="submit">Solicitar</Button>
      </div>
    </Form >
  )
}