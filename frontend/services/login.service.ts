// interface LoginFormData {
//   email: string;
//   password: string;
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// export const loginService = {
//   submit: async (data: LoginFormData) => {
//     const res = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });

//     const result = await res.json();
//     if (!res.ok) {
//       throw new Error(result.message || "Login failed");
//     }

//     return result;
//   },
// };
