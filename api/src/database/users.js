import dbClient from "./database_client.js";

export async function addUser(user) {
  return dbClient("users").insert(user);
}

export async function deleteUserByGoogleId(id) {
  return dbClient("users").where("google_id", id).del();
}

export async function getUserByGoogleId(googleId) {
  return dbClient("users").select("*").where("google_id", googleId);
}

export async function updateUserByGoogleId(googleId, user) {
  return dbClient("users").where("id", googleId).update(user);
}

export async function getUserByName(userName) {
  return dbClient("users").select("*").where("full_name", userName);
}

export async function getUserByPhoneNumber(phone) {
  return dbClient("users").select("*").where("phone", phone);
}

export async function getUserByEmail(email) {
  return dbClient("users").select("*").where("email", email);
}
