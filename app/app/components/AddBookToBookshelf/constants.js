export const filterOptions = {
  printTypes: ["all", "books", "magazines"],

  orderBy: ["relevance", "newest"],

  languages: [
    { code: "", label: "All Languages" },
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "da", label: "Danish" },
    { code: "ru", label: "Russian" },
  ],

  genres: [
    { value: "all", label: "All Genres" },
    { value: "fiction", label: "Fiction" },
    { value: "nonfiction", label: "Non-Fiction" },
    { value: "mystery", label: "Mystery" },
    { value: "fantasy", label: "Fantasy" },
    { value: "romance", label: "Romance" },
    { value: "science_fiction", label: "Science Fiction" },
    { value: "thriller", label: "Thriller" },
    { value: "horror", label: "Horror" },
    { value: "historical_fiction", label: "Historical Fiction" },
    { value: "biography", label: "Biography" },
    { value: "history", label: "History" },
    { value: "science", label: "Science" },
    { value: "technology", label: "Technology" },
    { value: "business", label: "Business" },
    { value: "self_help", label: "Self-Help" },
    { value: "poetry", label: "Poetry" },
    { value: "drama", label: "Drama" },
    { value: "art", label: "Art" },
    { value: "cooking", label: "Cooking" },
  ],

  maxResults: [10, 20, 30, 40],

  filterTypes: [
    { value: "all", label: "All Books" },
    { value: "free-ebooks", label: "Free eBooks" },
    { value: "paid-ebooks", label: "Paid eBooks" },
    { value: "ebooks", label: "eBooks Only" },
  ],
};

export const defaultFilters = {
  printType: "all",
  orderBy: "relevance",
  language: "",
  genre: "all",
  maxResults: 10,
  filterType: "all",
};

export const formatSearchQuery = (params) => {
  const { title, author, genre } = params;
  let query = "";

  if (title) query += `intitle:${title} `;
  if (author) query += `inauthor:${author} `;
  if (genre && genre !== "all") query += `subject:${genre} `;

  return query.trim();
};
