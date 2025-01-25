
"use server";

import connection from "./lib/database_client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function register(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Registration data:", name, email, password);

  const [userId] = await connection("user")
    .insert({
      username: name,
      email,
      password,
    })
    .returning("id"); 

  console.log("User successfully registered:", {
    username: name,
    email,
    userId,
  });

  const cookieStore = cookies();

  await cookieStore.set({
    name: "username",
    value: name,
    httpOnly: false,
    secure: false,
    path: "/",
  });

  await cookieStore.set({
    name: "userId",
    value: userId,
    httpOnly: false,
    secure: false,
    path: "/",
  });

  console.log("Cookies successfully set for:", { name, userId });

  redirect("/login");
}

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Login attempt with:", email, password);

  const user = await connection("user").where({ email, password }).first();

  if (user) {
    console.log("User found:", user);

    const cookieStore = cookies();

    await cookieStore.set({
      name: "username",
      value: user.username,
      httpOnly: false,
      secure: false,
      path: "/",
    });

    await cookieStore.set({
      name: "userId",
      value: user.id,
      httpOnly: false,
      secure: false,
      path: "/",
    });

    console.log("Cookies set successfully for:", user.username);

    redirect("/");
  } else {
    console.error("Invalid credentials for email:", email);
    throw new Error("Invalid credentials");
  }
}

export async function logout() {
  const cookieStore = cookies();

  await cookieStore.set({
    name: "username",
    value: "",
    httpOnly: false,
    secure: false,
    path: "/",
    expires: new Date(0),
  });

  await cookieStore.set({
    name: "userId",
    value: "",
    httpOnly: false,
    secure: false,
    path: "/",
    expires: new Date(0),
  });

  console.log("User successfully logged out");

  redirect("/");
}



export async function getUserProfile(userId) {
  try {
    const user = await connection("user").where({ id: userId }).first();

    if (!user) {
      throw new Error("User not found.");
    }

    console.log(`Fetched user profile:`, user);

    return {
      username: user.username,
      avatarUrl: user.avatar_url,
      dob: user.dob,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile.");
  }
}

export async function updateProfile(userId, dob, avatarUrl) {
  try {
    console.log("Updating profile with:", { userId, dob, avatarUrl });

    await connection("user")
      .where({ id: userId })
      .update({
        updated_at: new Date(),
        avatar_url: avatarUrl,
        dob: dob || null, 
      });

    console.log("Profile updated successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile.");
  }
}
