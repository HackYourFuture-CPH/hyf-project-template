/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.alterTable("customer_order", (t) => {
    // We target the existing user_id column
    // and explicitly allow it to be NULL for guests
    t.integer("user_id").unsigned().nullable().alter();
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.alterTable("customer_order", (t) => {
    // To undo this, we make it notNullable again
    t.integer("user_id").unsigned().notNullable().alter();
  });
}
