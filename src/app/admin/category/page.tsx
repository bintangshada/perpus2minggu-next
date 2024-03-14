import CategoryList from "@/components/CategoryList";
import NavigationBarAdmin from "@/components/NavbarAdmin";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <NavigationBarAdmin />
      <div>
        <div className="m-auto">
          <div className="m-auto flex items-center gap-4 pt-5 px-5 justify-end">
            <div>
              <Link href="/admin/category/create">
                <button
                  type="button"
                  className="py-3.5 px-5 me-14 text-sm font-medium text-white focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-blue-700 dark:bg-blue-800  dark:border-gray-600 dark:hover:text-white dark:hover:bg-blue-700"
                >
                  add
                </button>
              </Link>
            </div>
          </div>
        </div>
        <CategoryList />
      </div>
    </>
  );
}
