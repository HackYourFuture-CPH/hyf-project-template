/**
 * @param {import("knex").Knex} knex
 */

export async function up(knex) {
  await knex.schema.alterTable("cart", (t) => {
    // This allows us to find a guest's cart via a UUID or Session ID
    t.string("guest_id").unique().nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("cart", (t) => {
    t.dropColumn("guest_id");
  });
}
