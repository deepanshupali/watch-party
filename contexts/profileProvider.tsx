"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define the shape of the context's value
interface ProfileContextType {
  profile: string;
  setUser: (user: string | null) => void;
}
interface ProfileProviderProps {
  children: ReactNode;
}

// Create the context with a default value
export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [profile, setProfile] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setProfile(storedUser);
    }
  }, []);
  const setUser = (user: string | null) => {
    if (user) {
      localStorage.setItem("username", user);
    } else {
      localStorage.removeItem("username");
    }
    setProfile(user!);
  };

  return (
    <ProfileContext.Provider value={{ profile, setUser }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
