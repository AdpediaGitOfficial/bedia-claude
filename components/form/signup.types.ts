export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface SignupService {
  submit(data: SignupFormData): Promise<void>
}
