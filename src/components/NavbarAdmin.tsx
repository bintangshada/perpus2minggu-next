"use client";
import React, { useEffect, useState } from "react";
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function NavigationBarAdmin() {
  const [activePath, setActivePath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  const isActive = (path: string): boolean => {
    return activePath === path;
  };
  const linkClassName = (path: string) =>
    `text-gray-700 hover:text-[#9A3412] font-bold px-3 py-2 rounded-md ${
      isActive(path) ? "bg-[#9A3412] text-white" : ""
    } mr-2`;

  return (
    <div className="bg-gray-600 text-neutral-100">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div>
          <Link title="Home" href="/dashboard">
            <h1 className="font-bold w-10 font-major text-xl text-inherit">
              2<span className="text-[#9A3412]">MI</span>n
              <span className="text-[#9A3412]">GG</span>u
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">HOME</Link>
          <Link href="/admin/book">BOOK</Link>
          <Link href="/admin/category">CATEGORY</Link>
          <Link href="/admin/user">USER</Link>
          <Link href="/admin/loan">LOAN</Link>
          <Link href="/admin/download">REPORT</Link>
        </div>
        <div>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </div>
  );
}
