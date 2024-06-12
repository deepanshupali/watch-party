"use client";

import { useProfile } from "@/contexts/profileProvider";
import { logout } from "@/hooks/signInUser";
import { pusherClient } from "@/lib/pusher";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";

interface ChatMessageProps {
  user: string;
  message: string;
  time: string;
}
interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  __v: number;
}
interface PageProps {
  params: {
    roomId: string;
  };
}

interface ChatProps {
  messages: ChatMessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageProps[]>>;
  roomId: string;
  profile: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ user, message }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-400">
        <span className="font-bold">{user}</span>
      </div>
      <div className="mt-1">{message}</div>
    </div>
  );
};

const Chat: React.FC<ChatProps> = ({
  messages,
  setMessages,
  roomId,
  profile,
}) => {
  const handleSendMessage = async (message: string) => {
    const newMessage = {
      roomId,
      user: profile,
      message,
    };

    try {
      await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(comment);
    setComment("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} {...msg} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 bg-gray-700">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type comment"
          className="flex-1 p-2 rounded bg-gray-800 border-none text-white"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 rounded text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
};
const OnlineUsers: React.FC<{ onlineUsers: string[] }> = ({ onlineUsers }) => {
  return (
    <div>
      {onlineUsers.map((username, i) => (
        <div key={i} className="p-4 flex justify-between">
          <div className="p-2 border-b border-gray-700">{username}</div>
          <button>Invite</button>
        </div>
      ))}
    </div>
  );
};

const VideoPlayer: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      <video
        src="your-video-source.mp4"
        controls
        className="w-full h-full"
      ></video>
    </div>
  );
};

const WatchParty = ({ params }: PageProps) => {
  const { roomId } = params;
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const { profile } = useProfile();
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    console.log(storedUser);
    const channel = pusherClient.subscribe(`chat-${roomId}`);
    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch("/api/onlineusers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId, user: storedUser }), // Replace "current-user" with the actual username or user ID of the current user
        });

        if (response.ok) {
          const data = await response.json();
          setOnlineUsers(data.users);
        } else {
          console.error("Failed to fetch online users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };

    fetchOnlineUsers();

    channel.bind("online", (data: any) => {
      console.log(data.onlineUsers);
      setOnlineUsers(data.onlineUsers);
    });

    channel.bind("msg", (data: ChatMessageProps) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [roomId]);

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
          {showChat ? (
            <Chat
              messages={messages}
              setMessages={setMessages}
              roomId={roomId}
              profile={profile}
            />
          ) : (
            <OnlineUsers onlineUsers={onlineUsers} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchParty;
