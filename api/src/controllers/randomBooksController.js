import NodeCache from "node-cache";
import fetch from "node-fetch";
const RandomBooksCache = new NodeCache({ stdTTL: 5000 });

export const fetchRandomBooks = async (req, res) => {
  try {
    const cachedBooks = RandomBooksCache.get("books");
    if (cachedBooks) {
      return res.json(cachedBooks);
    }

    let data = await fetch(
      "https://www.googleapis.com/books/v1/volumes?q=book&maxResults=30"
    );
    data = await data.json();
    if (!data.items || data.items.length === 0) {
      const fallbackResponse = await fetch("http://localhost:3001/api/books");
      data = await fallbackResponse.json();
    }

    RandomBooksCache.set("books", data);

    res.json(data);
  } catch (error) {
    console.log("Error fetching books:", error);
    res.status(500).json({ error: "Error fetching books" });
  }
};
