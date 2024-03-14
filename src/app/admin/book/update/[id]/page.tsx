"use client";
import NavigationBarAdmin from "@/components/NavbarAdmin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState<File>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await fetch(`/api/book?id=${id}`);
        const bookData = await bookResponse.json();
        const book = bookData.book;
        console.log(book);
        console.log(bookResponse);

        setTitle(book.title);
        setAuthor(book.author);
        setQuantity(book.quantity.toString());
        setSelectedCategory(book.id_category);
        setImage(book.image);

        const categoryResponse = await fetch("/api/category");
        const categoryData = await categoryResponse.json();
        setCategoryOptions(categoryData.categories);
      } catch (error) {
        console.error("Error fetching book and category data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("quantity", quantity);
    formData.append("category", selectedCategory);
    if (image) formData.append("image", image);
    try {
      const response = await fetch(`/api/book?id=${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        console.log("Book updated successfully");
        router.push("/admin/book");
      } else {
        console.error("Failed to update book:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <div>
      <NavigationBarAdmin />
      <div className="px-5 pt-5">
        <Link href="/admin/book">
          <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
            <span>Go back</span>
          </button>
        </Link>
      </div>
      <div className="p-20">
        <div className="flex flex-col items-center justify-center pb-5 text-3xl font-bold">
          <h1>Update Book</h1>
        </div>
        <form className="max-w-sm mx-auto border-4 p-3" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="author"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="quantity"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Category:
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="">Select a category</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label
              htmlFor="image"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files?.[0])}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
          >
            Update Book
          </button>
        </form>
      </div>
    </div>
  );
}
