/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
  await knex("customer_order").del(); // Clear existing users

  await knex("customer_order").insert([
    {
      id: 1,
      user_id: 1,
      total_price: 200.0,
      status: "paid",
      created_at: new Date(),
    },
  ]);
}
