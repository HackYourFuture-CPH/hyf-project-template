import express from "express";
import * as db from "../database/pets.js";

const petsRouter = express.Router();

petsRouter.post("/api/pets", async (request, response) => {
  const pet = request.body;
  const petError = validatePetData(pet);

  if (petError) return response.status(400).send({ error: petError });

  await db.addPet(createPetObject(pet));

  response.status(201).json({ message: "Pet added successfully." });
});

petsRouter.get("/api/pets/:id", async (request, response) => {
  const id = Number(request.query);
  if (!id) return response.status(400).send({ error: `No pets here` });

  const pets = await db.getPetsByUserId(id);

  if (!pets) return response.status(404).send({ error: `User with such ID has no pets` });

  response.send(pets);
});

petsRouter.put("/api/pets/:id", async (request, response) => {
  const id = Number(request.params.id);
  const pet = request.body;

  if (!id) return response.status(400).send({ error: `Id is mandatory` });

  const petError = validatePetData(pet);

  if (petError) return response.status(400).send({ error: petError });

  const newPet = createPetObject(pet);

  await db.updatePetById(id, createPetObject(newPet));

  response.status(201).send({ message: "Pet updated successfully." });
});

petsRouter.delete("/api/pets/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!id) return response.status(400).send({ error: `Id is mandatory` });

  const isDeleted = await db.deletePetById(id);

  if (isDeleted) return response.send({ message: "Pet data deleted successfully." });

  response.status(404).send({ error: "Pet not found." });
});

const validatePetData = (pet) => {
  if (!pet) return `Pet data is required.`;

  if (
    !pet.name ||
    !pet.species ||
    !pet.breed ||
    !pet.sex ||
    !pet.color_markings ||
    !pet.date_of_birth ||
    !pet.country_of_birth ||
    !pet.microchip_number ||
    !pet.microchip_implant_date ||
    !pet.microchip_implant_location ||
    !pet.tattoo_number ||
    !pet.passport_number ||
    !pet.country_of_issue ||
    !pet.issue_date ||
    !pet.issuing_authority ||
    !pet.current_status ||
    !pet.created_at ||
    !pet.updated_at
  )
    return `All fields are required.`;
};

const createPetObject = (pet) => {
  const createPet = {
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    color_markings: pet.color_markings,
    date_of_birth: pet.date_of_birth,
    country_of_birth: pet.country_of_birth,
    microchip_number: pet.microchip_number,
    microchip_implant_date: pet.microchip_implant_date,
    microchip_implant_location: pet.microchip_implant_location,
    tattoo_number: pet.tattoo_number,
    passport_number: pet.passport_number,
    country_of_issue: pet.country_of_issue,
    issue_date: pet.issue_date,
    issuing_authority: pet.issuing_authority,
    current_status: pet.current_status,
    created_at: pet.created_at,
    updated_at: pet.updated_at,
  };

  return createPet;
};

export default petsRouter;
