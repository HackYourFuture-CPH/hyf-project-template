import { NextResponse } from 'next/server';
import knex from '@/app/api/knex';

export async function GET() {
  await knex.schema.createTableIfNotExists('test', function (table) {
    table.increments();
    table.string('name');
    table.timestamps();
  });

  await knex('test').insert({ name: 'test' });
  const data = await knex('test').select('*');

  return NextResponse.json(data);
}
