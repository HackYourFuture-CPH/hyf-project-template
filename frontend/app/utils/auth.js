import { sendPostJsonRequest, handleResponse } from './resHandler';

export const handleSignUp = async data => {
  const response = await sendPostJsonRequest('/api/users', data);
  return await handleResponse(response, () => {
    window.location.href = '/';
  });
};

export const handleLogIn = async (email, password, loginCallback) => {
  const response = await sendPostJsonRequest('/api/login', { email, password }, {}, { credentials: 'include' });
  return handleResponse(response, loginCallback);
};

export const handleLogOut = async logoutCallBack => {
  const response = await sendPostJsonRequest('/api/logout');
  return handleResponse(response, logoutCallBack);
};
