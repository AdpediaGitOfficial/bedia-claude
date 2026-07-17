/**
 * Reusable Form Input Component
 * Follows Single Responsibility: handles input rendering and validation display only
 */

import React from 'react'
import { Content } from '../ui'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
  required?: boolean
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, required = false, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
            <Content className="block mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Content>
        <div className="relative">
          <input
            ref={ref}
            className={`w-full 2xl:p-6 p-4  bg-[#E5E0C933]  border-[0.6px]   border-transparent transition-colors duration-600 focus:outline-none focus:border-[#0D463D99] focus:bg-white 2xl:text-lg text-sm leading-none hover:border-[#0D463D99] ${
              error ? 'border-red-500 bg-red-50' : 'hover:bg-white'
            } ${className}`}
            {...props}
          />
          {icon && <div className="absolute right-4 top-3.5 text-gray-400">{icon}</div>}
        </div>
        {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput
