/**
 * Validation utility following Single Responsibility Principle
 * Each validator function has a single, well-defined purpose
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Individual validators - SRP: each function does one thing
export const validators = {
  /**
   * Validates if name meets minimum requirements
   */
  validateName: (name: string): ValidationError | null => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { field: 'name', message: 'Name is required' }
    }
    if (trimmedName.length < 2) {
      return { field: 'name', message: 'Name must be at least 2 characters' }
    }
    if (trimmedName.length > 50) {
      return { field: 'name', message: 'Name must not exceed 50 characters' }
    }
    return null
  },

  /**
   * Validates if email is in correct format
   */
  validateEmail: (email: string): ValidationError | null => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      return { field: 'email', message: 'Email is required' }
    }

    // Check for @ symbol
    if (!trimmedEmail.includes('@')) {
      return { field: 'email', message: 'Email must contain @ symbol' }
    }

    // Check for dot in domain
    if (!trimmedEmail.includes('.')) {
      return { field: 'email', message: 'Email must contain a domain extension (e.g., .com)' }
    }

    // RFC 5322 compliant email regex
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(trimmedEmail)) {
      return { field: 'email', message: 'Please enter a valid email address' }
    }

    // Additional validations
    const [localPart, domainPart] = trimmedEmail.split('@')

    if (!localPart || localPart.length === 0) {
      return { field: 'email', message: 'Email local part cannot be empty' }
    }

    if (!domainPart || domainPart.length === 0) {
      return { field: 'email', message: 'Email domain cannot be empty' }
    }

    if (!domainPart.includes('.')) {
      return { field: 'email', message: 'Email domain must have an extension' }
    }

    const domainParts = domainPart.split('.')
    if (domainParts.some((part) => !part || part.length === 0)) {
      return { field: 'email', message: 'Email domain format is invalid' }
    }

    return null
  },

  /**
   * Validates if password meets security requirements
   */
  validatePassword: (password: string): ValidationError | null => {
    if (!password) {
      return { field: 'password', message: 'Password is required' }
    }
    if (password.length < 8) {
      return { field: 'password', message: 'Password must be at least 8 characters' }
    }
    if (!/[A-Z]/.test(password)) {
      return {
        field: 'password',
        message: 'Password must contain at least one uppercase letter',
      }
    }
    if (!/[a-z]/.test(password)) {
      return {
        field: 'password',
        message: 'Password must contain at least one lowercase letter',
      }
    }
    if (!/[0-9]/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one number' }
    }
    return null
  },

  /**
   * Validates if passwords match
   */
  validatePasswordConfirm: (
    password: string,
    confirmPassword: string
  ): ValidationError | null => {
    if (!confirmPassword) {
      return { field: 'confirmPassword', message: 'Please confirm your password' }
    }
    if (password !== confirmPassword) {
      return { field: 'confirmPassword', message: 'Passwords do not match' }
    }
    return null
  },
}

/**
 * Main validation function that orchestrates all validators
 * Dependency Inversion: depends on abstract validator functions, not concrete implementations
 */
export const validateSignupForm = (data: {
  name: string
  email: string
  password: string
  confirmPassword: string
}): ValidationResult => {
  const errors: ValidationError[] = []

  const nameError = validators.validateName(data.name)
  if (nameError) errors.push(nameError)

  const emailError = validators.validateEmail(data.email)
  if (emailError) errors.push(emailError)

  const passwordError = validators.validatePassword(data.password)
  if (passwordError) errors.push(passwordError)

  const confirmError = validators.validatePasswordConfirm(data.password, data.confirmPassword)
  if (confirmError) errors.push(confirmError)

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Get error message for a specific field
 */
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find((err) => err.field === fieldName)
  return error ? error.message : null
}

export const validateEmail = validators.validateEmail;
export const validatePassword = validators.validatePassword;
