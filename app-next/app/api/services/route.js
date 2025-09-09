import { NextResponse } from "next/server";
import pool from "../db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM services"); // your table name
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
