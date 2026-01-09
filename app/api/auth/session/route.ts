import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { accessToken } = await req.json();

  const res = NextResponse.json({ ok: true });

  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
