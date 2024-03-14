import { getData } from "@/services/book";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const getBooks = async () => {
  const res = await getData(`${process.env.BASE_URL}/api/book`);
  return res;
};
export default async function BookList() {
  const data = await getBooks();
  const books = data.books;
  return (
    <>
      <div className="mx-14">
        <div className="m-auto flex items-center pt-5 justify-end">
          <div className="w-full sm:w-full md:w-1/3">
            <form className="max-w mx-full">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search Mockups, Logos..."
                  required
                />
                <button
                  type="submit"
                  className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 place-items-center">
            {books &&
              books.length > 0 &&
              books.map((book: any) => (
                <div
                  key={book.id}
                  className="w-full max-w-sm border border-gray-200 rounded-lg bg-slate-500"
                >
                  <Link href={`/book/detail/${book.id}`}>
                    <Image
                      className="p-8 rounded-t-lg h-60 w-full object-cover"
                      src={book.image}
                      alt="product image"
                      width={300}
                      height={300}
                    />
                  </Link>
                  <div className="px-5 pb-5">
                    <div className="border-gray-900 rounded-full bg-slate-700 inline-block px-3 py-1">
                      <p className="text-xs font-light tracking-tight text-gray-900 dark:text-white truncate">
                        {book.category.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h5 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white truncate">
                        {book.title}
                      </h5>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="items-center justify-between">
                        <h5 className="text-l font-semibold tracking-tight text-gray-700 truncate">
                          {book.author}
                        </h5>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/book/review/${book.id}`}>
                          <button
                            type="button"
                            className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
                          >
                            Review
                          </button>
                        </Link>
                        <Link href={`/book/loan/${book.id}`}>
                          <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Pinjam
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
