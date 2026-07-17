/**
 * Reusable Form Password Input Component
 * Includes show/hide password toggle
 */

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Content } from '../ui'

interface FormPasswordInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type'
  > {
  label: string
  error?: string
  required?: boolean
}

const FormPasswordInput = React.forwardRef<
  HTMLInputElement,
  FormPasswordInputProps
>(
  (
    {
      label,
      error,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="w-full">
        <Content className="block mb-2">
          {label}
          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </Content>

        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full 2xl:p-6 p-4 pr-14 bg-[#E5E0C933]  border-[0.6px] border-transparent transition-colors duration-300 focus:outline-none focus:border-[#0D463D99] focus:bg-white 2xl:text-lg text-sm leading-none hover:border-[#0D463D99] ${
              error
                ? 'border-red-500 bg-red-50'
                : 'hover:bg-white'
            } ${className}`}
            {...props}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(prev => !prev)
            }
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0D463D] transition-colors"
          >
            {showPassword ? (
              <EyeOff size={22} />
            ) : (
              <Eye size={22} />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-sm font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormPasswordInput.displayName =
  'FormPasswordInput'

export default FormPasswordInput