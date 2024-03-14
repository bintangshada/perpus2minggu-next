"use client";
import { getData } from "@/services/book";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  Book: {
    id: string;
    title: string;
  }[];
}

const getCategories = async (): Promise<{ categories: Category[] }> => {
  const res = await getData(`/api/category`);
  return res;
};

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  const handleDelete = async (id: string) => {
    try {
      const categoryToDelete = categories.find(
        (category) => category.id === id
      );
      if (!categoryToDelete) {
        console.error("Category not found");
        return;
      }

      if (categoryToDelete.Book.length > 0) {
        alert("Cannot delete category with books in it");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (!confirmDelete) return;
      const response = await fetch(`/api/category?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== id));
      } else {
        console.error("Failed to delete category:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex m-auto p-5 overflow-x-auto justify-center">
      <table className="text-l w-full font-bold text-left text-gray-500 divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
              Books
            </th>
            <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white whitespace-nowrap divide-y divide-gray-200">
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td className="px-6 py-4 border">{index + 1}</td>
              <td className="px-6 py-4 border">
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
              </td>
              <td className="px-6 py-4 border font-semibold">
                {category.Book.map((book, bookIndex) => (
                  <div key={book.id}>
                    {bookIndex + 1}. {book.title}
                  </div>
                ))}
              </td>
              <td className="px-6 py-4 border">
                <Link href={`/admin/category/update/${category.id}`}>
                  <div className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </div>
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
