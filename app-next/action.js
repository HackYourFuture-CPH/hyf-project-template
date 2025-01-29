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
    const user = await connection("user")
      .select(
        "id",
        "username",
        "avatar_url",
        connection.raw(`TO_CHAR(dob, 'YYYY-MM-DD') AS dob`)
      )
      .where({ id: userId })
      .first();

    if (!user) {
      throw new Error("User not found.");
    }

    console.log("Fetched user profile from DB:", user);

    return {
      username: user.username,
      avatarUrl: user.avatar_url,
      dob: user.dob || null,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile.");
  }
}

export async function updateProfile(userId, dob, avatarUrl) {
  try {
    console.log("Updating profile with:", { userId, dob, avatarUrl });

    const formattedDob = dob ? dob.split("T")[0] : null;
    console.log("Formatted DOB for saving:", formattedDob);

    await connection("user").where({ id: userId }).update({
      updated_at: new Date(),
      avatar_url: avatarUrl,
      dob: formattedDob,
    });

    console.log("Profile updated successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile.");
  }
}

export async function saveReview(formData) {
  const rating = formData.get("rating");
  const title = formData.get("title");
  const review = formData.get("review");
  console.log("Received data in saveReview:", { rating, title, review });
  try {
    await connection("reviews").insert({
      rating: parseInt(rating, 10),
      title,
      review,
    });
    console.log("Review successfully saved.");
    return { success: true };
  } catch (error) {
    console.error("Error saving review to database:", error.message);
    throw new Error("Failed to save review.");
  }
}

export async function saveContactMessage(formData) {
  const { name, email, message } = formData;

  console.log("Received contact form data:", { name, email, message });

  try {
    const currentTime = new Date().toISOString();

    const result = await connection("contact_messages").insert({
      name,
      email,
      message,
      created_at: currentTime,
    });

    console.log("Contact message successfully saved:", result);
    return { success: true };
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw new Error("Failed to save contact message.");
  }
}
export async function addToFavorites(movieId) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      console.error("User ID not found in cookies");
      return { success: false, message: "User not authenticated." };
    }

    console.log("Adding movie to favorites:", { userId, movieId });

    const movieExists = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=8ec0629bf685d1704229f499278c23a5`
    );
    if (!movieExists.ok) {
      console.error("Movie does not exist in API:", movieId);
      return { success: false, message: "Movie does not exist." };
    }

    const existing = await connection("favorites")
      .where({ user_id: userId, movie_id: movieId })
      .first();

    if (existing) {
      console.log("Movie already in favorites.");
      return { success: false, message: "Movie already in favorites." };
    }

    await connection("favorites").insert({
      user_id: userId,
      movie_id: movieId,
    });

    console.log("Movie added to favorites successfully.");
    return { success: true, message: "Movie added to favorites." };
  } catch (error) {
    console.error("Error adding movie to favorites:", error);
    return {
      success: false,
      message: "Failed to add movie to favorites.",
      error,
    };
  }
}

export async function removeFromFavorites(movieId) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      console.error("User ID not found in cookies");
      return { success: false, message: "User not authenticated." };
    }

    console.log("Removing movie from favorites:", { userId, movieId });

    const result = await connection("favorites")
      .where({ user_id: userId, movie_id: movieId })
      .delete();

    if (result === 0) {
      console.warn("No favorite found to remove for:", { userId, movieId });
      return { success: false, message: "Movie not found in favorites." };
    }

    console.log("Movie removed from favorites successfully.");
    return { success: true, message: "Movie removed from favorites." };
  } catch (error) {
    console.error("Error removing movie from favorites:", error);
    return {
      success: false,
      message: "Failed to remove movie from favorites.",
      error,
    };
  }
}

export async function getFavorites() {
  try {
    console.log("Step 1: Extracting userId from cookies...");

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      console.error("User ID not found in cookies");
      return { success: false, message: "User not authenticated." };
    }

    console.log("Fetching favorites for user:", userId);

    console.log("Step 2: Fetching favorites from database...");
    const favorites = await connection("favorites")
      .where({ user_id: userId })
      .select("movie_id");

    console.log("Favorites fetched from database:", favorites);

    if (favorites.length === 0) {
      console.log("No favorites found for user:", userId);
      return {
        success: true,
        message: "No favorites found.",
        favorites: [],
      };
    }

    console.log("Step 3: Fetching movie details from API...");
    const movieIds = favorites.map((fav) => fav.movie_id);
    const movies = await Promise.all(
      movieIds.map(async (id) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=8ec0629bf685d1704229f499278c23a5`
          );
          console.log("API Response for movie ID", id, ":", response.status);

          if (response.ok) {
            return await response.json();
          } else {
            console.warn("Failed to fetch movie from API:", id);
            return null;
          }
        } catch (error) {
          console.error("Error fetching movie from API:", id, error);
          return null;
        }
      })
    );

    console.log("Step 4: Filtering valid movies...");
    const validMovies = movies.filter((movie) => movie !== null);
    console.log("Valid movies after filtering:", validMovies);

    console.log("Favorites fetched successfully:", validMovies);
    return { success: true, favorites: validMovies };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return { success: false, message: "Failed to fetch favorites.", error };
  }
}
export async function saveAvatar(userId, avatarUrl) {
  if (!userId || !avatarUrl) {
    throw new Error("Missing parameters: userId or avatarUrl");
  }

  try {
    console.log("Updating avatar for user:", userId);

    await connection("user").where({ id: userId }).update({
      avatar_url: avatarUrl, 
      updated_at: new Date(),
    });

    console.log("Avatar updated successfully for user:", userId);

    return { success: true };
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw new Error("Failed to update avatar.");
  }
}
