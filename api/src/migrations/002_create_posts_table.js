// Migration to create posts table
export async function up(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.timestamps(true, true); // Creates created_at and updated_at columns
    
    // Foreign key constraint
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex) {
  return knex.schema.dropTable('posts');
}
