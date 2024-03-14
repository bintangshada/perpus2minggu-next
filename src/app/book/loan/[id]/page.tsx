"use client";
import NavigationBar from "@/components/Navbar";
import NavigationBarAdmin from "@/components/NavbarAdmin";
import { currentUser, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoanPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [quantity, setQuantity] = useState("");
  const [returnedAt, setReturnedAt] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const { user } = useUser();

  console.log(user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await fetch(`/api/book?id=${id}`);
        const bookData = await bookResponse.json();
        const book = bookData.book;
        console.log(bookResponse);
        console.log(bookData);
      } catch (error) {
        console.error("Error fetching book and category data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          book_id: id,
          returnedAt,
        }),
      });

      if (response.ok) {
        router.push("/book");
        router.refresh();
      } else {
        console.error("Failed to submit loan request");
      }
    } catch (error) {
      console.error("Error submitting loan request:", error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-20">
        <div className="flex flex-col items-center justify-center pb-5 text-3xl font-bold">
          <h1>Loan Book</h1>
        </div>
        <form className="max-w-sm mx-auto border-4 p-3" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="returnDate"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              value={returnedAt}
              onChange={(e) => setReturnedAt(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
