import { sendGetRequest, handleResponse } from './resHandler';

export async function getUserInfo() {
  const response = await sendGetRequest('/api/user');
  return await handleResponse(response);
}

const USER_ROUTER = { Developer: '/dev-dashboard', Client: '/client-dashboard' };
export function getUserPathByRole(userRole) {
  return USER_ROUTER[userRole];
}

export function checkURLMatchUserRole(URL, userRole) {
  if (!URL.startsWith(getUserPathByRole(userRole))) {
    throw new Error('User role ' + userRole + ' does not match URL ' + URL);
  }
}
