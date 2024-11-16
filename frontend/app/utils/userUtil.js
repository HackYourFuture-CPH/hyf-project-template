import { sendGetRequest, handleResponse } from './resHandler';

export async function getUserInfo() {
  const response = await sendGetRequest('/api/user');
  return await handleResponse(response);
}

const USER_ROUTER = { Developer: '/dev-dashboard', Client: '/client-dashboard' };

export function getUserPathByRole(userRole) {
  checkUserRole(userRole);
  return USER_ROUTER[userRole];
}

function checkUserRole(userRole) {
  if (!(userRole in USER_ROUTER)) {
    throw new Error('User role is neither Developer nor Client');
  }
}

export function checkURLMatchUserRole(URL, userRole) {
  if (!URL.startsWith(getUserPathByRole(userRole))) {
    throw new Error('User role ' + userRole + ' does not match URL ' + URL);
  }
}
