// Migration to create users table
export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').unique().notNullable();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('mobile').unique().notNullable();
    table.string('profile_image').nullable();
    table.boolean('is_active').defaultTo(true);
    table.enum('role', ['user', 'admin', 'moderator']).defaultTo('user');
    table.timestamp('email_verified_at').nullable();
    table.timestamp('last_login_at').nullable();
    table.timestamps(true, true); // Creates created_at and updated_at columns
    
    // Indexes for better performance
    table.index(['email']);
    table.index(['username']);
    table.index(['mobile']);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('users');
}
