import { NextResponse } from "next/server";
import pool from "../db";

export async function POST(req) {
  try {
    const { volunteer_id, available_from, available_to } = await req.json();

    const query = `
      INSERT INTO available_time (volunteer_id, available_from, available_to)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      volunteer_id,
      available_from,
      available_to,
    ]);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add availability" },
      { status: 500 }
    );
  }
}
