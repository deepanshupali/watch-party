export async function registerUser() {
  try {
    const response = await fetch("api/register", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    // You can handle the error as needed, e.g., log it, show a message to the user, etc.
  }
}
