import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-around p-5">
      <li>Logo</li>
      <li>Home</li>
      <Button variant="outline" asChild>
        <Link href="/login">Login</Link>
      </Button>
    </nav>
  );
};

export default Navbar;
