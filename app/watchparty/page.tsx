"use client";
import { useRouter } from "next/navigation";
import React from "react";

const JoinRoomPage: React.FC = () => {
  let roomIdInput = "";
  const router = useRouter();

  const createRoom = async () => {
    // We will talk about api route shortly
    const res = await fetch("/api/rooms/create");

    const roomI: string = await res.text();
    localStorage.setItem("admin", "true");
    router.push(`watchparty/room/${roomI}`);
  };

  const joinRoom = async (roomId: string) => {
    router.push(`watchparty/room/${roomId}`);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
          Join a Room
        </h2>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="room-id"
              className="block text-lg font-medium text-gray-700"
            >
              Room ID
            </label>
            <input
              type="text"
              id="room-id"
              name="room-id"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              placeholder="Enter Room ID"
              onChange={({ target }) => (roomIdInput = target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => joinRoom(roomIdInput)}
            >
              Join
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center">
          <span className="px-2 text-lg text-gray-600">or</span>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={createRoom}
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomPage;
