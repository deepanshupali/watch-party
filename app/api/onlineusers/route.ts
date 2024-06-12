import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

// Assuming `onlineUsers` is a global object to store online users for each room
const onlineUsers: Record<string, string[]> = {};

export async function POST(req: Request) {
  const { roomId, user } = await req.json();
  console.log(onlineUsers);

  try {
    // Check if the user is already in the onlineUsers array for the specific room
    if (!onlineUsers[roomId]) {
      onlineUsers[roomId] = [user];
    } else if (!onlineUsers[roomId].includes(user)) {
      onlineUsers[roomId].push(user);
    }

    // Trigger the Pusher event with the updated onlineUsers array
    await pusherServer.trigger(`chat-${roomId}`, "online", {
      onlineUsers: onlineUsers[roomId],
    });

    return NextResponse.json({ users: onlineUsers[roomId] }, { status: 200 });
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    return NextResponse.json(
      { message: "Error triggering Pusher event" },
      { status: 500 }
    );
  }
}
