/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("order_item", (t) => {
    t.increments("id").primary();

    // Link to the order
    t.integer("customer_order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("customer_order")
      .onDelete("CASCADE");

    // Link to the event
    t.integer("event_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("event")
      .onDelete("RESTRICT");

    t.integer("quantity").notNullable().defaultTo(1);
    t.decimal("unit_price", 10, 2).notNullable();
    t.timestamps(true, true);
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("order_item");
}
