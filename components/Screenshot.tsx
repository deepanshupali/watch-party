"use client";
import Image from "next/image";
import React from "react";

interface ScreenshotProps {
  imageSrc: string;
  description: string;
}

const ScreenshotSection: React.FC = () => {
  const screenshots: ScreenshotProps[] = [
    {
      imageSrc: "/signin.png",
      description: "1. Sign in with your account or Sign up",
    },
    {
      imageSrc: "/joinroom.png",
      description: "2. Create a room",
    },
    {
      imageSrc: "/chat.png",
      description: "3. Copy the code and share with friends",
    },
    {
      imageSrc: "/use.png",
      description: "4. Paste a YouTube video link you want to watch",
    },
    {
      imageSrc: "/onlineusers.png",
      description: "5. Chat and see the online buddies",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {screenshots.map((screenshot, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8"
        >
          <div className="md:w-1/2 p-6 text-white">
            <p className="text-lg md:text-xl font-semibold">
              {screenshot.description}
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              width={800}
              height={400}
              src={screenshot.imageSrc}
              alt={`Screenshot ${index + 1}`}
              className="rounded-lg transform transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScreenshotSection;
