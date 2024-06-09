import { dbConnect } from "@/lib/dbConnect";
import Register from "@/lib/models/Register";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { email, password, username } = await req.json();
  console.log(email, password, username);
  await dbConnect();

  try {
    const existingUser = await Register.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }
    const newUser = new Register({
      username,
      email,
      password,
    });
    await newUser.save();
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
