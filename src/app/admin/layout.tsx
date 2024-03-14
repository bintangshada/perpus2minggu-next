"use client";
import { getData } from "@/services/book";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, user } = useUser();
    const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      const isAdmin = (user?.publicMetadata?.roles as string).includes("admin");
      if (!isAdmin) {
        router.push("/dashboard");
      }
    }
  }, [isSignedIn, user, router]);

  return <>{children}</>;
}
