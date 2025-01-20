"use server";

import connection from "./lib/database_client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function register(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Registration data:", name, email, password);

  await connection("user").insert({
    username: name,
    email,
    password,
  });

  console.log("User successfully registered:", { username: name, email });

  const cookieStore = await cookies();

  await cookieStore.set({
    name: "username",
    value: name,
    httpOnly: false,
    secure: false,
    path: "/",
  });

  console.log("Cookie successfully set for:", name);

  redirect("/");
}

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Login attempt with:", email, password);

  const user = await connection("user").where({ email, password }).first();

  if (user) {
    console.log("User found:", user);

    const cookieStore = await cookies();

    await cookieStore.set({
      name: "username",
      value: user.username,
      httpOnly: false,
      secure: false,
      path: "/",
    });

    console.log("Cookie set successfully for:", user.username);

    redirect("/");
  } else {
    console.error("Invalid credentials for email:", email);
    throw new Error("Invalid credentials");
  }
}

export async function updateAvatar(userId, avatarUrl) {
  try {
    await connection("user")
      .where({ id: userId })
      .update({ avatar_url: avatarUrl });

    console.log(`Avatar updated for user ${userId}: ${avatarUrl}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw new Error("Failed to update avatar.");
  }
}

export async function getUserProfile(userId) {
  try {
    const user = await connection("user").where({ id: userId }).first();

    if (!user) {
      throw new Error("User not found.");
    }

    console.log(`Profile fetched for user ${userId}:`, user);

    return {
      username: user.username,
      avatarUrl: user.avatar_url,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile.");
  }
}
