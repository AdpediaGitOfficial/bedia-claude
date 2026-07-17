// services/authService.ts

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "";

/* =========================
   TYPES
========================= */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

/* =========================
   LOGIN
========================= */

export const loginUser = async (
  data: LoginPayload
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      data,
      {
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw {
      message:
        error?.response?.data?.message ||
        "Login failed",
    };
  }
};

/* =========================
   REGISTER
========================= */

export const registerUser = async (
  data: SignupPayload
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      data,
      {
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw {
      message:
        error?.response?.data?.message ||
        "Signup failed",
    };
  }
};