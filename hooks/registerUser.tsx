interface FormData {
  username: string;
  email: string;
  password: string;
}
export async function registerUser(formData: FormData) {
  try {
    const response = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    console.error("Error:", error);
    // You can handle the error as needed, e.g., log it, show a message to the user, etc.
  }
}
