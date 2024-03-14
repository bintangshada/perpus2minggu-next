"use client";
import NavigationBarAdmin from "@/components/NavbarAdmin";
import { getData } from "@/services/book";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [review, setReview] = useState("");
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await fetch(`/api/book?id=${id}`);
        const bookData = await bookResponse.json();
        const book = bookData.book;
      } catch (error) {
        console.error("Error fetching book and category data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmSubmit = window.confirm(
      "Are you sure about your review? Reviews cannot be deleted or changed, make sure your review is appropriate. Your review is very influential for other borrowers."
    );
    if (!confirmSubmit) return;
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          book_id: id,
          review,
        }),
      });

      if (response.ok) {
        router.push("/book");
        router.refresh();
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div>
      <NavigationBarAdmin />
      <div className="px-5 pt-5">
        <Link href="/book">
          <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
            <span>Go back</span>
          </button>
        </Link>
      </div>
      <div className="p-20">
        <div className="flex flex-col items-center justify-center pb-5 text-3xl text-bold">
          <h1>ADD REVIEW</h1>
        </div>
        <form className="max-w-sm mx-auto border-4 p-3" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Review
            </label>
            <textarea
              id="title"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Book Review"
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
