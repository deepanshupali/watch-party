import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { roomId, videoId, action } = await req.json();
  console.log(roomId, videoId, action);
  try {
    if (action == "sendId") {
      await pusherServer.trigger(`video-${roomId}`, "videoId", {
        videoId,
      });
    } else if (action == "play") {
      await pusherServer.trigger(`video-${roomId}`, "play", {
        play: true,
      });
    } else if (action == "pause") {
      await pusherServer.trigger(`video-${roomId}`, "pause", {
        play: false,
      });
    }

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
