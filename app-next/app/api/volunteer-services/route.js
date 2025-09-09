import { NextResponse } from "next/server";
import pool from "../db";

export async function POST(req) {
  try {
    const { volunteer_id, service_id } = await req.json();

    const query = `
      INSERT INTO volunteer_services (volunteer_id, service_id)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const result = await pool.query(query, [volunteer_id, service_id]);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add volunteer-service" },
      { status: 500 }
    );
  }
}
