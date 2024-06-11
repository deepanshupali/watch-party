import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/dbConnect";
import Register from "@/lib/models/Register";

export async function GET(req: any) {
  try {
    await dbConnect();
    const users = await Register.find({});
    console.log(users);
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
