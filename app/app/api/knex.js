import knex from 'knex';

const connection = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.POSTGRES_URL,
  },
});

export default connection;
