// makeRequest function to handle API requests
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
  
      return result; // Return the result to the caller
    } catch (error) {
      throw new Error(error.message || "Network error, please try again later.");
    }
  };
  