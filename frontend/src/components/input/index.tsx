import React, { ReactNode } from "react"
import { UseFormRegisterReturn } from "react-hook-form"

type InputProps = {
  error?: string
  register: UseFormRegisterReturn
  icon?: ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ error, register, icon, ...props }: InputProps) {
  return (
    <div className="w-full relative">
      <div className="flex justify-end items-center">
        {icon && (
          <div className="absolute left-3 text-gray-500">{icon}</div>
        )}
        <input
          required
          {...props}
          {...register}
          className={`w-full h-12 pl-10 rounded-lg text-sm peer bg-gray-100 hover:bg-gray-200 focus:outline-none focus:border-gray-700-600 focus:ring-2 focus:ring-black ${!!error && 'focus:border-red-600 focus:ring-2 focus:ring-red-600'}`} />
      </div>
    </div>
  )
}