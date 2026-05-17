/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("cart_item", (t) => {
    t.increments("id").primary();

    // Link to the cart
    t.integer("cart_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("cart")
      .onDelete("CASCADE");

    // Link to the event
    t.integer("event_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("event")
      .onDelete("CASCADE");

    t.integer("quantity").notNullable().defaultTo(1);

    t.timestamps(true, true);
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("cart_item");
}
