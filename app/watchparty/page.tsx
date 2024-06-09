"use client";

import { logout } from "@/hooks/signInUser";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

interface ChatMessageProps {
  user: string;
  message: string;
  time: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ user, message, time }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-400">
        <span className="font-bold">{user}</span>
        <span>{time}</span>
      </div>
      <div className="mt-1">{message}</div>
    </div>
  );
};

const CommentInput: React.FC = () => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle submit logic
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-4 bg-gray-700">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Type comment"
        className="flex-1 p-2 rounded bg-gray-800 border-none text-white"
      />
      <button type="submit" className="ml-2 p-2 bg-blue-500 rounded text-white">
        Send
      </button>
    </form>
  );
};

const Chat: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessage
          user="Luis Adam"
          message="Yeah that guy deserves no dates"
          time="24:12"
        />
        <ChatMessage
          user="Musni Dhaifina"
          message="One thousand percent"
          time="24:30"
        />
        <ChatMessage user="Antonius JPG" message="😂😂😂" time="28:11" />
        <ChatMessage
          user="Nobel Winardi"
          message="She is giving off way too much 'I'm a cool Boy Energy'"
          time="29:53"
        />
        <ChatMessage
          user="Angela Yonara"
          message="She's talking to a man vs her regular voice when alone makes me wanna slap her"
          time="30:27"
        />
      </div>
      <CommentInput />
    </div>
  );
};

const OnlineUsers: React.FC = () => {
  return (
    <div className="p-4">
      <div className="p-2 border-b border-gray-700">User 1</div>
      <div className="p-2 border-b border-gray-700">User 2</div>
      <div className="p-2 border-b border-gray-700">User 3</div>
      {/* Add more users as needed */}
    </div>
  );
};

const VideoPlayer: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* This is where you can integrate your actual video player */}
      <video
        src="your-video-source.mp4"
        controls
        className="w-full h-full"
      ></video>
    </div>
  );
};

const WatchParty: React.FC = () => {
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-3 w-3/4">
        <VideoPlayer />
      </div>
      <div className="flex-1 flex flex-col bg-gray-800 text-white">
        <div className="flex p-4">
          <button
            onClick={() => setShowChat(true)}
            className={`flex-1 py-2 ${showChat ? "font-bold" : ""}`}
          >
            Chat
          </button>
          <button
            onClick={() => setShowChat(false)}
            className={`flex-1 py-2 ${!showChat ? "font-bold" : ""}`}
          >
            Online Users
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <button
            onClick={() => logout()}
            className={`flex-1 py-2 ${!showChat ? "font-bold" : ""}`}
          >
            signout
          </button>
          {showChat ? <Chat /> : <OnlineUsers />}
        </div>
      </div>
    </div>
  );
};

export default WatchParty;
