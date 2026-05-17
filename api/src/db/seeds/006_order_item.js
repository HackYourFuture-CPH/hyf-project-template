/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
  await knex("order_item").del();

  await knex("order_item").insert([
    {
      id: 1,
      customer_order_id: 1,
      event_id: 1,
      quantity: 1,
      unit_price: 500.0,
    },
  ]);
}
