import { getPaginationParams } from "../utils/pagination.js";
import fetch from "node-fetch";

const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;

export const searchGoogleBooks = async (req, res) => {
  const {
    title,
    author,
    genre,
    language,
    filterType,
    printType,
    orderBy,
    page = 1,
    pageSize = 10,
  } = req.query;
  const { offset, limit } = getPaginationParams(page, pageSize);

  let query = "";
  if (title) query += `intitle:${title}`;
  if (author) query += (query ? "+" : "") + `inauthor:${author}`;
  if (genre) query += (query ? "+" : "") + `subject:${genre}`;

  if (!query) {
    return res
      .status(400)
      .json({ error: "At least one search parameter is required." });
  }

  const queryParams = new URLSearchParams({
    q: query,
    startIndex: offset,
    maxResults: limit,
    key: googleBooksApiKey,
  });

  if (language) queryParams.append("langRestrict", language);
  if (filterType !== "all") queryParams.append("filter", filterType);
  if (printType !== "all") queryParams.append("printType", printType);
  if (orderBy) queryParams.append("orderBy", orderBy);

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${queryParams.toString()}`
    );

    const data = await response.json();

    if (!data.items) {
      return res.json([]);
    }

    const books = data.items.map((item) => ({
      google_book_id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors
        ? item.volumeInfo.authors.join(", ")
        : "Unknown",
      description: item.volumeInfo.description || null,
      genre: item.volumeInfo.categories ? item.volumeInfo.categories[0] : null,
      cover_image: item.volumeInfo.imageLinks?.thumbnail || null,
    }));

    return res.json(books);
  } catch (error) {
    console.error("Error searching Google Books:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
