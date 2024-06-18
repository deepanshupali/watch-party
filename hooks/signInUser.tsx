"use server";
import { cookies } from "next/headers";

interface FormData {
  email: string;
  password: string;
}

export async function signInUser(formData: FormData) {
  try {
    const response = await fetch(
      "https://watch-party-rho.vercel.app/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const cookieStore = cookies();
    const hasCookie = cookieStore.has("token");

    if (hasCookie) {
      cookies().delete("token");
    }
    const result = await response.json();
    console.log(result);
    cookies().set({
      name: "token",
      value: result.message,
      httpOnly: true,
    });

    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}
export const logout = async () => {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has("token");
  if (hasCookie) {
    cookies().delete("token");
  }
};
