import { toast } from 'react-toastify';

export async function handleResponse(
  response,
  successCallback = defaultSuccessCallback,
  errorCallback = defaultErrorCallback
) {
  if (response.ok) {
    const result = await response.json();
    successCallback(result);
    return result;
  } else {
    const responseText = await response.text();
    errorCallback(responseText);
  }
}

const defaultSuccessCallback = result => {};
const defaultErrorCallback = errorText => {
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
