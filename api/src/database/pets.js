import dbClient from "./database_client.js";

export async function getPetByUserId(userId) {
  return dbClient("pets").select("*").where("owner_user_id", userId);
}

export async function getPetByName(petName) {
  return dbClient("pets").select("*").where("name", petName);
}

export async function getPetById(id) {
  return dbClient("pets").select("*").where("id", id);
}

export async function getPetByMicrochipNumber(microchipNumber) {
  return dbClient("pets").select("*").where("microchip_number", microchipNumber);
}

export async function getPetByPassportNumber(passportNumber) {
  return dbClient("pets").select("*").where("passport_number", passportNumber);
}

export async function updatePetById(id, pet) {
  return dbClient("pets").where("id", id).update(pet);
}

export async function addPet(pet) {
  return dbClient("pets").insert(pet);
}

export async function deletePetById(id) {
  return dbClient("pets").where("id", id).del();
}
