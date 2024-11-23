import { toast } from 'react-toastify';

export async function handleResponse(
  response,
  successCallback = defaultSuccessCallback,
  errorCallback = defaultErrorCallback
) {
  if (response.ok) {
    const contentType = response.headers.get('Content-Type');

    // If response is JSON
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      successCallback(result);
      return result;
    }

    // If response is a PDF file
    if (contentType && contentType.includes('application/pdf')) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  } else {
    const responseText = await response.text();
    errorCallback(responseText);
  }
}

export const defaultSuccessCallback = result => {};
export const defaultErrorCallback = errorText => {
  toast.error(errorText);
};

export async function sendPostJsonRequest(url, data = {}, optionsHeaders = {}, optionsFields = {}) {
  return await fetch(url, {
    ...optionsFields,
    method: 'POST',
    headers: { ...optionsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function sendGetRequest(url, optionsHeaders = {}, optionsFields = {}) {
  return await fetch(url, {
    ...optionsFields,
    method: 'GET',
    headers: optionsHeaders,
  });
}

export async function sendDeleteRequest(url, optionsHeaders = {}, optionsFields = {}) {
  return await fetch(url, {
    ...optionsFields,
    method: 'DELETE',
    headers: optionsHeaders,
  });
}
