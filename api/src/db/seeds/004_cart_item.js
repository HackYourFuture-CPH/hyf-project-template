/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
  await knex("cart_item").del(); // Clear existing users

  await knex("cart_item").insert([
    {
      id: 1,
      cart_id: 1,
      event_id: 1,
      quantity: 2,
      created_at: new Date(),
    },
  ]);
}
