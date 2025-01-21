import { NextResponse } from 'next/server';
import knex from '@/app/api/knex';

export async function GET() {
  try {
    const result = await knex('questions').orderByRaw('RANDOM()').limit(40);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
