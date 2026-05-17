/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
  await knex("user").del(); // Clear existing users

  await knex("user").insert([
    {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
