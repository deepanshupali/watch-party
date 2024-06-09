"use server";
import { dbConnect } from "@/lib/dbConnect";
import Register from "@/lib/models/Register";

import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { email, password } = await req.json();
  console.log(email, password);
  await dbConnect();

  try {
    const user = await Register.findOne({ email });
    if (!user || password != user.password) {
      return NextResponse.json({ message: "Invalid" }, { status: 400 });
    }
    const token = "thistoken";
    return NextResponse.json({ message: token }, { status: 200 });
  } catch (err: any) {
    NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "User registered" }, { status: 200 });
}
