export const makeRequest = async (endpoint, userData = {}, method = "POST") => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Base URL not found");
  }
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: method !== "GET" ? JSON.stringify(userData) : undefined,
    });

    if (response.status === 204) {
      return null;
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Something went wrong");
    }

    return result;
  } catch (error) {
    throw new Error(error.message || "Network error, please try again later.");
  }
};
