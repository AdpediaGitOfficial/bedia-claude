import React from 'react'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  ariaLabel: string
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`p-2  hover:bg-gray-100 transition-colors duration-200 ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  )
}

export default IconButton



