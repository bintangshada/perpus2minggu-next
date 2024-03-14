import BookListAdmin from "@/components/BookListAdmin";
import NavigationBarAdmin from "@/components/NavbarAdmin";
import { getData } from "@/services/book";
import Link from "next/link";

const getBooks = async () => {
  const res = await getData(`${process.env.BASE_URL}/api/book`);
  return res;
};
export default async function Page() {
  const data = await getBooks();
  const books = data.book;
  return (
    <>
      <NavigationBarAdmin />
      <BookListAdmin />
    </>
  );
}
