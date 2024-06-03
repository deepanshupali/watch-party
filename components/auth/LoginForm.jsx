"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
// import { signIn } from "next-auth/react";
// import { socket } from "@/app/socket";

const formSchema = z.object({
  emailAddress: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(3, { message: "Password is wrong, try again" }),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });
  //   async function updateUserStatus(email, isActive) {
  //     try {
  //       const response = await fetch("/api/setUserStatus", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email, isActive }),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log("User status updated successfully:", data);
  //       } else {
  //         const errorData = await response.json();
  //         console.error("Failed to update user status:", errorData);
  //       }
  //     } catch (error) {
  //       console.error("Error making API call:", error);
  //     }
  //   }

  const handleSubmit = async (data) => {
    const { emailAddress: email, password } = data;
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      //   updateUserStatus(email, true);
      socket.emit("user login", email);
      toast.success("Login Successful");
      router.push("/watchparty");
    } catch (error) {
      console.error("Login Failed:", error);
      toast("Login Failed");
    }
  };

  return (
    <main
      className={`flex justify-center items-center absolute bg-black w-screen h-[102vh] sm:h-screen bg-opacity-35 top-0 z-[100]  sm:px-0 px-2`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="relative  max-w-lg w-full flex flex-col gap-5  bg-white p-8  rounded-2xl "
        >
          <h2 className="text-center !text-4xl">Login</h2>

          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#f0f2f5] focus:bg-white border-none p-6"
                      placeholder="Email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="flex justify-between relative">
                    Password
                    <div
                      className="absolute top-[34px] right-4 cursor-pointer"
                      onClick={() => togglePassword()}
                    >
                      {showPassword ? (
                        <IoMdEyeOff size={24} />
                      ) : (
                        <IoEye size={24} />
                      )}
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      className="bg-[#f0f2f5] focus:bg-white border-none p-6 "
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button variant="outline" type="submit" className="w-full bg-main">
            Login
          </Button>
          <div className="flex flex-col justify-center items-center gap-3">
            <h3>OR</h3>
            <div className="flex justify-center gap-3 w-[230px] border-gray-300 border p-2 rounded-md hover:border-black hover:shadow-sm">
              <Image
                width={1}
                height={1}
                className="w-6 h-6"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              />
              <p>Login with Google</p>
            </div>
          </div>

          <Toaster position="top-left" />
        </form>
      </Form>
    </main>
  );
}
