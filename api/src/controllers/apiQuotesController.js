import NodeCache from "node-cache";
const quotesCache = new NodeCache({ stdTTL: 600 });

export const fetchQuote = async (req, res) => {
  try {
    const cachedQuotes = quotesCache.get("quotes");
    if (cachedQuotes) {
      return res.json(cachedQuotes);
    }

    const response = await fetch("https://zenquotes.io/api/quotes/");
    const data = await response.json();

    quotesCache.set("quotes", data);

    res.json(data);
  } catch (error) {
    console.log("Error fetching quote:", error);
    res.status(500).json({ error: "Error fetching quote" });
  }
};
