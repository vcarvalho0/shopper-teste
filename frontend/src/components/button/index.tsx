import React, { ReactNode } from "react"
import { Spinner } from "../spinner"

type ButtonProps = {
  isLoading?: boolean
  children: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ isLoading, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className="w-full uppercase flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-900"
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}