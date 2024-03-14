"use client";
import NavigationBarAdmin from "@/components/NavbarAdmin";
import { getData } from "@/services/book";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookDetail({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookData = await getData(
          `http://localhost:3000/api/book?id=${params.id}`
        );
        setBook(bookData);
        console.log(bookData);
      } catch (error) {
        console.error("Failed to fetch book data:", error);
      }
    };
    fetchData();
  }, [params.id, router]);

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this book?"
      );
      if (!confirmDelete) return;

      const loanData = await fetch(
        `http://localhost:3000/api/book?id=${params.id}`
      );
      const activeLoans = await loanData.json();
      if (activeLoans.book.Loan.length > 0) {
        alert(
          "This book cannot be deleted because it is currently on loan. You have to delete first in loan."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/book?id=${params.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Book deleted successfully", response);
        router.push("/admin/book");
      } else {
        console.error("Failed to delete book:");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <>
      <NavigationBarAdmin />
      <div className="px-5 pt-5">
        <Link href="/admin/book">
          <button
            type="button"
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
          >
            <span>
              <p>Go back</p>
            </span>
          </button>
        </Link>
      </div>
      <div className="container mx-auto my-10">
        <div className="w-1/2 mx-auto border border-gray-600">
          <Image
            src={book.book.imageData}
            alt=""
            className="w-full object-cover aspect-square col-span-2"
            width={500}
            height={500}
          />
          <div className="bg-white p-4 px-6">
            <div className="flex justify-between py-3">
              <h3 className="text-xl font-bold">{book.book.title}</h3>
              <div className="border-gray-900 rounded-full bg-slate-700 inline-block px-3 py-1">
                <p className="text-xs font-light tracking-tight text-gray-900 dark:text-white truncate">
                  {book.book.category.name}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="truncate">Author: {book.book.author}</p>
              <div className="flex gap-4">
                <Link href={`/admin/book/update/${book.book.id}`}>
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    EDIT
                  </button>
                </Link>
                <button
                  onClick={handleDelete}
                  type="button"
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex m-auto p-5 overflow-x-auto justify-center">
        <table className="text-l w-full font-bold text-left text-gray-700 divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-gray-700 uppercase mx-96">
                Review
              </th>
            </tr>
          </thead>
          <tbody className="bg-white whitespace-nowrap divide-y divide-gray-200">
            {book.book.Review &&
              book.book.Review.map((review: any) => (
                <tr key={review.id}>
                  <td className="px-6 py-4 border">{review.user.username}</td>
                  <td className="px-6 py-4 border">{review.reviews}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
