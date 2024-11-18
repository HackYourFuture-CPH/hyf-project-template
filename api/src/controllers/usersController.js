import knex from "../database_client.js";
import { buildUserDto } from "../services/userService.js";
import { bucket } from "../utils/cloudStorage.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await knex("Users")
      .where({ user_id: parseInt(req.user.userId) })
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: buildUserDto(user),
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

export const updateUserDetails = async (req, res) => {
  const { first_name, last_name, email, username, about } = req.body;
  try {
    const user = await knex("Users")
      .where({ user_id: parseInt(req.user.userId) })
      .first();

    if (!user) return res.status(404).json({ error: "User not found" });

    if (username && user.username !== username) {
      const existingUser = await knex("Users").where({ username }).first();
      if (existingUser)
        return res.status(400).json({ error: "Username already exists" });
    }

    if (email && user.email !== email) {
      const existingUser = await knex("Users").where({ email }).first();
      if (existingUser)
        return res.status(400).json({ error: "Email already exists" });
    }

    let profile_image_url = user.profile_image_url;

    if (req.file) {
      const file = bucket.file(`user-profiles/${req.file.originalname}`);
      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
      //upload the file
      await new Promise((resolve, reject) => {
        stream.on("error", (err) => {
          console.error("Upload error:", err);
          reject(new Error("Error uploading file"));
        });

        stream.on("finish", async () => {
          try {
            // After file upload is finished, generate a signed URL
            const [url] = await file.getSignedUrl({
              action: "read",
              expires: "03-01-2030",
            });
            profile_image_url = url; // Set the uploaded image URL
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        stream.end(req.file.buffer);
      });
    }
    //update the user details

    await knex("Users")
      .where({ user_id: parseInt(req.user.userId) })
      .update({
        first_name: first_name ?? user.first_name,
        last_name: last_name ?? user.last_name,
        email: email ?? user.email,
        username: username ?? user.username,
        about: about ?? user.about,
        profile_image_url: profile_image_url ?? user.profile_image_url,
      });

    const updatedUser = await knex("Users")
      .where({ user_id: parseInt(req.user.userId) })
      .first();
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await knex.transaction(async (trx) => {
      const user = await trx("Users")
        .where({ user_id: parseInt(req.user.userId) })
        .first();
      if (!user) return res.status(404).json({ error: "User not found" });
      await trx("Notes")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("Quotes")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("ReadingGoals")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("Reviews")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("UserBooks")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("Users")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
