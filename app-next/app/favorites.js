import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from "@/action";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ success: false, message: "Invalid data." });
    }

   
    return res
      .status(200)
      .json({ success: true, message: "Added to favorites." });
  }

  if (req.method === "DELETE") {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ success: false, message: "Invalid data." });
    }

    
    return res
      .status(200)
      .json({ success: true, message: "Removed from favorites." });
  }

  res.setHeader("Allow", ["POST", "DELETE"]);
  return res
    .status(405)
    .json({ success: false, message: "Method Not Allowed" });
}
