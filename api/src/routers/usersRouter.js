import express from "express";
import * as db from "../database/users.js";

const usersRouter = express.Router();

usersRouter.post("/api/users", async (request, response) => {
  const user = request.body;
  const userError = validateUserData(user);

  if (userError) return response.status(400).send({ error: userError });

  await db.addUser(createUserObject(user));

  response.status(201).json({ message: "user added successfully." });
});

usersRouter.get("/api/users/:id", async (request, response) => {
  const id = Number(request.query);
  if (!id) return response.status(400).send({ error: `No users here` });

  const user = await db.getUserByGoogleId(id);

  if (!user) return response.status(404).send({ error: `user with such ID has no users` });

  response.send(user);
});

usersRouter.put("/api/users/:id", async (request, response) => {
  const id = Number(request.params.id);
  const user = request.body;

  if (!id) return response.status(400).send({ error: `Id is mandatory` });

  const userError = validateUserData(user);

  if (userError) return response.status(400).send({ error: userError });

  const newuser = createUserObject(user);

  await db.updateUserByGoogleId(id, createUserObject(newuser));

  response.status(201).send({ message: "user updated successfully." });
});

usersRouter.delete("/api/users/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!id) return response.status(400).send({ error: `Id is mandatory` });

  const isDeleted = await db.deleteUserByGoogleId(id);

  if (isDeleted) return response.send({ message: "user data deleted successfully." });

  response.status(404).send({ error: "user not found." });
});

const validateUserData = (user) => {
  if (!user) return `user data is required.`;

  if (
    !user.full_name ||
    !user.email ||
    !user.google_id ||
    !user.phone ||
    !user.address ||
    !user.date_of_birth ||
    !user.country_of_birth ||
    !user.passport_number ||
    !user.created_at ||
    !user.updated_at
  )
    return `All fields are required.`;
};

const createUserObject = (user) => {
  const createUser = {
    full_name: user.full_name,
    email: user.email,
    google_id: user.google_id,
    phone: user.phone,
    address: user.address,
    date_of_birth: user.date_of_birth,
    passport_number: user.passport_number,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return createUser;
};

export default usersRouter;
