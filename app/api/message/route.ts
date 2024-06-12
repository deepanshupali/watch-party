import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { roomId, user, message } = await req.json();

  try {
    await pusherServer.trigger(`chat-${roomId}`, "msg", {
      user,
      message,
    });
    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    return NextResponse.json(
      { message: "Error triggering Pusher event" },
      { status: 500 }
    );
  }
}
