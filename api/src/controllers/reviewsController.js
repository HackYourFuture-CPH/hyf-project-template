import knex from "../database_client.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await knex("Reviews")
      .select("Reviews.*", "Users.username")
      .leftJoin("Users", "Reviews.user_id", "Users.user_id");
    res.status(200).json(reviews);
  } catch (error) {
    console.log("Error fetching reviews", error);
    res.status(500).json({ error: error.message });
  }
};

export const getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await knex("Reviews")
      .select("Reviews.*", "Users.username")
      .leftJoin("Users", "Reviews.user_id", "Users.user_id")
      .where("Reviews.review_id", req.params.id)
      .first();
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    console.log("Error fetching review by ID", error);
    res.status(500).json({ error: error.message });
  }
};

export const createReview = async (req, res) => {
  const { rating, review_text } = req.body;
  const book_id = req.params.bookId;
  const user_id = req.user.userId; //from authenticate middleware

  if (!book_id || !rating || !review_text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingReview = await knex("Reviews")
      .where({
        user_id,
        book_id,
      })
      .first();
    if (existingReview) {
      return res.status(400).json({ error: "Review already exists" });
    }
    const [newReviewId] = await knex("Reviews").insert({
      user_id,
      book_id,
      rating,
      review_text,
      created_at: new Date(),
    });
    const newReview = await knex("Reviews")
      .select("Reviews.*", "Users.username")
      .leftJoin("Users", "Reviews.user_id", "Users.user_id")
      .where("Reviews.review_id", newReviewId)
      .first();

    res.status(201).json(newReview);
  } catch (error) {
    console.log("Error creating review", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, review_text } = req.body;
  const user_id = req.user.userId;

  if (!rating && !review_text) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    const existingReview = await knex("Reviews")
      .where({
        review_id: id,
        user_id: user_id,
      })
      .first();

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    await knex("Reviews")
      .where({
        review_id: id,
        user_id: user_id,
      })
      .update({
        rating: rating ?? existingReview.rating,
        review_text: review_text ?? existingReview.review_text,
        updated_at: new Date(),
      });

    const updatedReview = await knex("Reviews")
      .select("Reviews.*", "Users.username")
      .leftJoin("Users", "Reviews.user_id", "Users.user_id")
      .where("Reviews.review_id", id)
      .first();

    res.status(200).json(updatedReview);
  } catch (error) {
    console.log("Error updating review", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    const existingReview = await knex("Reviews")
      .where({
        review_id: id,
        user_id: user_id,
      })
      .first();

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    await knex("Reviews").where("review_id", id).del();

    res.status(204).send();
  } catch (error) {
    console.log("Error deleting review", error);
    res.status(500).json({ error: error.message });
  }
};
