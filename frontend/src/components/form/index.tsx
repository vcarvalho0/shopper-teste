import React from 'react'

type FormProps = {
  children?: React.ReactNode
  onSubmit: React.FormEventHandler<HTMLFormElement>
  title?: string
}

export function Form({ children, title, onSubmit }: FormProps) {
  return (
    <div className="bg-white py-8 px-6 rounded-sm shadow-2xl w-96">
      <h1 className="font-semibold text-3xl text-center text-gray-800">{title}</h1>
      <form className="mb-0 space-y-6" onSubmit={onSubmit} noValidate>
        {children}
      </form>
    </div>
  )
}
