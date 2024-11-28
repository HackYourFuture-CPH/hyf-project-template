export const makeRequest = async (url, userData) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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
