"use server";
import connection from "./lib/database_client";
import { redirect } from "next/navigation";

export async function register(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(name, email, password);

  await connection("user").insert({
    username: name,
    email,
    password,
  });
}

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(email, password);

  const user = await connection("user").where({ email, password });
    console.log(user);
    
    if (user.length > 0) {
      redirect("/");
    }
     throw new Error("Invalid credentials");
}
