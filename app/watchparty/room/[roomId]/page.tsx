"use client";
import { useProfile } from "@/contexts/profileProvider";
import { logout } from "@/hooks/signInUser";
import { pusherClient } from "@/lib/pusher";
import { IoIosLogOut } from "react-icons/io";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { useRouter } from "next/navigation";
import CopyButton from "@/components/CopyToClip";

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
      <div className="mt-1 text-gray-200">{message}</div>
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
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900 rounded-t-md">
        {messages.map((msg, index) => (
          <ChatMessage key={index} {...msg} />
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex p-4 bg-gray-700 rounded-b-md"
      >
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 rounded-l-md bg-gray-800 border-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 rounded-r-md text-white hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

const OnlineUsers: React.FC<{ onlineUsers: string[] }> = ({ onlineUsers }) => {
  return (
    <div className="p-4 space-y-4">
      {onlineUsers.map((username, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-gray-900 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          <div className="text-white font-semibold">{username}</div>
        </div>
      ))}
    </div>
  );
};

const WatchParty: React.FC<PageProps> = ({ params }) => {
  const { roomId } = params;
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const { profile } = useProfile();
  const [videoId, setVideoId] = useState<string>("");
  const [admin, setAdmin] = useState<boolean>(false);
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const playerRef = useRef<any>(null);
  const [user, setUser] = useState<string>("");
  const opts = {
    height: "500",
    width: "1000",
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
  };
  const playVideo = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };
  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  useEffect(() => {
    const storedUse = localStorage.getItem("username");
    const isAdmin = localStorage.getItem("admin") === "true";
    const channel = pusherClient.subscribe(`chat-${roomId}`);
    const video = pusherClient.subscribe(`video-${roomId}`);
    setAdmin(isAdmin);

    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch("/api/onlineusers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId, user: storedUse }), // Replace "current-user" with the actual username or user ID of the current user
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

    channel.bind("online", (data: { onlineUsers: any }) => {
      setOnlineUsers(data.onlineUsers);
    });

    channel.bind("msg", (data: ChatMessageProps) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    video.bind("videoId", (data: { videoId: string }) => {
      setVideoId(data.videoId);
    });
    video.bind("play", (data: { time: any }) => {
      if (isAdmin) {
        return;
      }

      playerRef.current.seekTo(data.time);
      playVideo();
    });
    video.bind("pause", (data: { time: any }) => {
      if (admin) {
        return;
      }

      pauseVideo();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [roomId]);

  const extractVideoId = (url: string): string | null => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleEnterClick = async () => {
    const id = extractVideoId(url);
    await sendVideoId(id, "sendId");
    // if (id) setVideoId(id);
  };
  const handlePause = async () => {
    const id = extractVideoId(url);
    const currentTime = playerRef.current.getCurrentTime();
    await sendVideoId(id, "pause", currentTime);
    // if (id) setVideoId(id);
  };
  const handlePlay = async () => {
    const id = extractVideoId(url);
    const currentTime = playerRef.current.getCurrentTime();
    await sendVideoId(id, "play", currentTime);
    // if (id) setVideoId(id);
  };
  const onPlayerStateChange = async () => {
    const id = extractVideoId(url);

    const currentTime = playerRef.current.getCurrentTime();
    await sendVideoId(id, "seek", currentTime);
  };

  const sendVideoId = async (id: any, action: any, time?: number) => {
    try {
      const response = await fetch("/api/videoaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, videoId: id, action: action, time }), // Replace "current-user" with the actual username or user ID of the current user
      });

      if (response.ok) {
      } else {
        console.error("Failed to send video id:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending video id:", error);
    }
  };
  async function logoutMain() {
    localStorage.removeItem("admin");
    await logout();
    router.push("/");
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* <div>
        <h1 className="absolute right-[500px] top-10">
          Welcome {storedUser!.charAt(0).toUpperCase() + storedUser!.slice(1)}
        </h1>
      </div> */}

      <div className="flex flex-col flex-3 items-center justify-center gap-28 w-3/4">
        <div className="flex items-center mb-4 w-3/4 gap-3">
          <input
            type="text"
            placeholder="Enter YouTube video URL"
            className="py-3 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black flex-grow"
            onChange={handleInputChange}
          />
          <button
            onClick={handleEnterClick}
            className="py-3 px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-700"
          >
            Enter
          </button>
        </div>
        {videoId && (
          <div style={{ position: "relative" }}>
            <YouTube
              opts={opts}
              videoId={videoId}
              onReady={onPlayerReady}
              onPlay={() => {
                if (localStorage.getItem("admin") === "true") {
                  handlePlay();
                }
              }}
              onPause={() => {
                if (localStorage.getItem("admin") === "true") {
                  handlePause();
                }
              }}
              style={{
                zIndex: localStorage.getItem("admin") === "true" ? 2 : 0,
              }}
            />
          </div>
        )}
      </div>
      {/* Chat side starts */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg shadow-lg m-4 overflow-hidden">
        <div className="flex p-4 bg-gray-900">
          <button
            onClick={() => setShowChat(true)}
            className={`flex-1 py-2 px-4 text-center ${
              showChat ? "bg-blue-700 font-bold" : "bg-gray-700"
            } rounded-l-lg transition-colors duration-300`}
          >
            Chat
          </button>
          <button
            onClick={() => setShowChat(false)}
            className={`flex-1 py-2 px-4 text-center ${
              !showChat ? "bg-blue-700 font-bold" : "bg-gray-700"
            } rounded-r-lg transition-colors duration-300`}
          >
            Online Users
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-800">
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
      <IoIosLogOut
        onClick={() => logoutMain()}
        size={30}
        className="absolute right-[28%] top-9 text-white cursor-pointer hover:text-red-500"
      />
      <CopyButton textToCopy={roomId} />
    </div>
  );
};

export default WatchParty;
