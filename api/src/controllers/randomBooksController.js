import NodeCache from "node-cache";
import fetch from "node-fetch";
const RandomBooksCache = new NodeCache({ stdTTL: 5000 });

export const fetchRandomBooks = async (req, res) => {
  try {
    const cachedBooks = RandomBooksCache.get("books");
    if (cachedBooks) {
      return res.json(cachedBooks);
    }

    let response = await fetch(
      "https://www.googleapis.com/books/v1/volumes?q=book&maxResults=30"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    let data = await response.json();

    RandomBooksCache.set("books", data);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching books" });
  }
};
