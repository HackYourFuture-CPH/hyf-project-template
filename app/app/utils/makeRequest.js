export const makeRequest = async (url, userData = {}, method = "POST") => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", //for cookie handling
      body: method !== "GET" ? JSON.stringify(userData) : undefined,
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Something went wrong");
    }

    return result;
  } catch (error) {
    throw new Error(error.message || "Network error, please try again later.");
  }
};
