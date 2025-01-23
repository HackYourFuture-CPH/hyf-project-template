import { NextResponse } from 'next/server';
import knex from '@/app/api/knex';

export async function GET() {
  try {
    const questions = await knex('questions')
      .select('id', 'question', 'answers')
      .orderByRaw('RANDOM()')
      .limit(40);

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const userAnswers = await req.json();

    const questionIds = Object.keys(userAnswers);

    const correctAnswers = await knex('questions')
      .whereIn('id', questionIds)
      .select('id', 'correctanswers');

    const results = correctAnswers.map((question) => ({
      questionId: question.id,
      isCorrect: userAnswers[question.id] === question.correctanswers,
    }));

    const score = results.filter((result) => result.isCorrect).length;

    return NextResponse.json({ results, score });
  } catch (error) {
    console.error('Error validating answers:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
