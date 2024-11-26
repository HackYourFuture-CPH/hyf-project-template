import { defaultSuccessCallback, handleResponse, sendGetRequest } from './resHandler';

export const getAllClientsFromDeveloper = async developerId => {
  const response = await sendGetRequest(`/api/developer/${developerId}/AllClients`);
  return handleResponse(response, defaultSuccessCallback, () => {
    toast.error('Failed to fetch clients');
  });
};
