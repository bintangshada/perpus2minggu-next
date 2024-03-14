"use client";
import NavigationBarAdmin from "@/components/NavbarAdmin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });
      if (response.ok) {
        console.log("Category created successfully");
        router.push("/admin/category");
      } else {
        console.error("Failed to create category:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div>
      <NavigationBarAdmin />
      <div className="px-5 pt-5">
        <Link href="/admin/category">
          <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
            <span>Go back</span>
          </button>
        </Link>
      </div>
      <div className="p-20">
        <div className="flex flex-col items-center justify-center pb-5 text-3xl text-bold">
          <h1>ADD CATEGORY</h1>
        </div>
        <form className="max-w-sm mx-auto border-4 p-3" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Category Name"
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
