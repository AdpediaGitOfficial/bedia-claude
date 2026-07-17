"use client";

import React, { useState } from "react";
import FormInput from "./FormInput";
import Button from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";
import { Content } from "../ui";
import { validateEmail,validatePassword } from "@/utils/validation";

import { loginUser } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import FormPasswordInput from "./FormPasswordInput";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginError {
  field: string;
  message: string;
}

const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [formData, setFormData] =
    useState<LoginFormData>(initialFormData);

  const [errors, setErrors] = useState<
    LoginError[]
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

    const newErrors: LoginError[] = [];

    // email validation
    const emailValidation = validateEmail(
      formData.email
    ) as { message: string } | null;

    if (!formData.email) {
      newErrors.push({
        field: "email",
        message: "Email is required",
      });
    } else if (emailValidation) {
      newErrors.push({
        field: "email",
        message: emailValidation.message,
      });
    }

    // password validation
    const passwordValidation = validatePassword(
      formData.password
    ) as { message: string } | null;

    if (!formData.password) {
      newErrors.push({
        field: "password",
        message: "Password is required",
      });
    } else if (passwordValidation) {
      newErrors.push({
        field: "password",
        message: passwordValidation.message,
      });
    }

    // stop if error
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // axios api call
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      /*
        expected api response

        {
          user: {
            id: "1",
            email: "test@gmail.com"
          },
          token: "abcd123"
        }
      */

      // save zustand
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
            error.message || "Login failed",
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
            Login successful 🎉
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

      {/* email */}
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        value={formData.email}
        placeholder="example@gmail.com"
        onChange={handleChange}
        error={
          errors.find(
            (err) => err.field === "email"
          )?.message
        }
        required
      />

      {/* password */}
      <div className="relative">
          <FormPasswordInput
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        error={
          errors.find(
            (err) => err.field === "password"
          )?.message
        }
        required
      />

        <button
          type="button"
          onClick={() =>
            router.push("/forgot-password")
          }
          className="w-full pt-5"
        >
          <Content className="text-right">
            Forget Password ?
          </Content>
        </button>
      </div>

      {/* submit button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Logging in..."
          : "Continue"}
      </Button>

      {/* signup */}
      <div className="text-center">
        <span className="text-sm text-gray-600">
          Don&apos;t have an account?
        </span>

        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="text-primary text-sm font-semibold hover:underline ml-1"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;