/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("cart", (t) => {
    t.increments("id").primary();

    // user_id is nullable to support unauthenticated (guest) carts
    t.integer("user_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");

    // "One active cart" rule helper
    t.boolean("is_active").notNullable().defaultTo(true);

    t.timestamps(true, true);
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("cart");
}
