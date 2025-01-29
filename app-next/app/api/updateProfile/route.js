import { updateProfile } from "@/action";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId, dob, avatarUrl } = req.body;

      if (!userId || !avatarUrl) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      await updateProfile(userId, dob, avatarUrl);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error in updateProfile API:", error);
      return res.status(500).json({ error: "Failed to update profile." });
    }
  }

  res.status(405).json({ error: "Method not allowed." });
}
