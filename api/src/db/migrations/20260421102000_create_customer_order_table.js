/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("customer_order", (t) => {
    t.increments("id").primary();

    // Link to the user
    t.integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.decimal("total_price", 10, 2).notNullable();
    t.string("status").notNullable().defaultTo("pending");
    t.timestamps(true, true);
  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("customer_order");
}
