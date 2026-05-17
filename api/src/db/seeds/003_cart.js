/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
  await knex("cart").del(); // Clear existing users

  await knex("cart").insert([
    {
      id: 1,
      user_id: 1, // An authenticated user's cart
      is_active: true,
      created_at: new Date(),
    },
    {
      id: 2,
      user_id: null, // An unauthenticated user's cart
      is_active: true,
      created_at: new Date(),
    },
  ]);
}
