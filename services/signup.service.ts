import { SignupFormData } from "@/components/form/signup.types";

export const signupService = {
  submit: async (data: SignupFormData) => {
    // replace with real API later
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Signup data:", data);
  },
};
