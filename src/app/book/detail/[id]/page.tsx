import NavigationBar from "@/components/Navbar";
import { getData } from "@/services/book";
import Image from "next/image";
import Link from "next/link";

export default async function BookDetail(props: any) {
  const { params } = props;
  try {
    const book = await getData(
      `${process.env.BASE_URL}/api/book?id=${params.id}`
    );
    return (
      <>
        <NavigationBar />
        <div className="px-5 pt-5">
          <Link href="/book">
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
  } catch (error) {
    console.error("Failed to fetch book data:", error);
    return <div>Error: Failed to fetch book data. Please try again later.</div>;
  }
}
