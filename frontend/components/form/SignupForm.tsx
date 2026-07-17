"use client";

import React, { useState } from "react";
import {
  validateSignupForm,
  getFieldError,
  ValidationError,
} from "@/utils/validation";

import { SignupFormData } from "./signup.types";

import FormInput from "./FormInput";
import FormPasswordInput from "./FormPasswordInput";

import Button from "@/components/ui/PrimaryButton";
import { Content } from "../ui";

import { useRouter } from "next/navigation";

import { registerUser } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

const initialFormData: SignupFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupForm = () => {
  const [formData, setFormData] =
    useState<SignupFormData>(initialFormData);

  const [errors, setErrors] = useState<
    ValidationError[]
  >([]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitSuccess, setSubmitSuccess] =
    useState(false);

  const router = useRouter();

  // zustand
  const setUser = useAuthStore(
    (state) => state.setUser
  );

  // input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // remove old error
    setErrors((prev) =>
      prev.filter((err) => err.field !== name)
    );
  };

  // submit
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // validate
    const validation =
      validateSignupForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // api call
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      /*
        expected response

        {
          result: {
            email: "test@gmail.com",
            token: "abcd123",
            role: "user"
          }
        }
      */

      // save auth
      setUser({
        email: response.result.user.email,
        token: response.result.token,
        role: response.result.role,
        userId: response.result.user.userId,
      });

      setSubmitSuccess(true);

      // reset form
      setFormData(initialFormData);

      // redirect
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      setErrors([
        {
          field: "form",
          message:
            error.message ||
            "Signup failed",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {/* success */}
      {submitSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm">
            Account created successfully 🎉
          </p>
        </div>
      )}

      {/* form error */}
      {errors.find(
        (err) => err.field === "form"
      ) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            {
              errors.find(
                (err) => err.field === "form"
              )?.message
            }
          </p>
        </div>
      )}

      {/* name */}
      <FormInput
        name="name"
        label="Your Name"
        value={formData.name}
        onChange={handleChange}
        error={
          getFieldError(errors, "name") ||
          undefined
        }
        required
      />

      {/* email */}
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        value={formData.email}
        placeholder="example@gmail.com"
        onChange={handleChange}
        error={
          getFieldError(errors, "email") ||
          undefined
        }
        required
      />

      {/* password */}
      <FormPasswordInput
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        error={
          getFieldError(errors, "password") ||
          undefined
        }
        required
      />

      {/* confirm password */}
      <FormPasswordInput
        name="confirmPassword"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={
          getFieldError(
            errors,
            "confirmPassword"
          ) || undefined
        }
        required
      />

      {/* submit */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Creating Account..."
          : "Register Now"}
      </Button>

      {/* login */}
      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?
        </span>

        <button
          type="button"
          onClick={() =>
            router.push("/login")
          }
          className="text-primary text-sm font-semibold hover:underline ml-1"
        >
          Log in
        </button>
      </div>
    </form>
  );
};

export default SignupForm;