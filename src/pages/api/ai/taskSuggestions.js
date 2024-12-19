import { generateTaskSuggestions } from "../../../../lib/aiHelper";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const suggestions = await generateTaskSuggestions(description);

    if (!suggestions) {
      return res.status(500).json({ error: "Failed to generate suggestions" });
    }

    res.status(200).json(suggestions);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}