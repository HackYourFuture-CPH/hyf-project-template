/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
    await knex.schema.createTable("event", (t) => {
        t.increments("id").primary();
        t.decimal("price", 10, 2).notNullable();
        t.string("currency", 3).notNullable();
        t.string("title").notNullable();
        t.text("description");
        t.timestamps(true, true);
    });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("event");
}