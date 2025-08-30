import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json(); // { email, fullName, mobile }
    // TODO: later call your real backend here
    console.log("SIGNUP_SYNC:", body);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
