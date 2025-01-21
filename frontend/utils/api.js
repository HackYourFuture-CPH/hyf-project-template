import { toast } from "react-toastify";

export function api(route) {
  return `${process.env.NEXT_PUBLIC_API_URL}/api${route}`;
}

export async function handleApiResponse(
  response,
  onSuccessCallback,
  onErrorCallback
) {
  try {
    if (response.ok) {
      const result = await response.json();
      if (onSuccessCallback) {
        onSuccessCallback(result);
      } else {
        toast.success("Request was successful");
      }
      return result;
    } else {
      const errorText = await response.text();
      if (errorText) {
        if (onErrorCallback) {
          onErrorCallback(errorText);
        } else {
          toast.error(errorText);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  } catch (error) {
    if (onErrorCallback) {
      onErrorCallback(error.message);
    } else {
      toast.error("An error occurred during the request. Please try again.");
    }
  }
}

export async function makePostRequest(
  url,
  body,
  optionFields = {},
  onSuccessCallback,
  onErrorCallback
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
      ...optionFields,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return await handleApiResponse(
      response,
      onSuccessCallback,
      onErrorCallback
    );
  } catch (error) {
    console.error("API request error:", error.message);
    toast.error("Something went wrong. Please try again.");
    throw error;
  }
}

export async function makeGetRequest(
  url,
  optionFields = {},
  onSuccessCallback,
  onErrorCallback
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
      ...optionFields,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await handleApiResponse(
      response,
      onSuccessCallback,
      onErrorCallback
    );
  } catch (error) {
    console.error("API request error:", error);
    toast.error("Something went wrong. Please try again.");
    throw error;
  }
}
