import NavigationBarAdmin from "@/components/NavbarAdmin";
import { getData } from "@/services/book";

const getDashboard = async () => {
  const res = await getData(`${process.env.BASE_URL}/api/dashboard`);
  return res;
};

export default async function Page() {
  const data = await getDashboard();
  return (
    <div>
      <NavigationBarAdmin />
      <div className="m-auto m:w-1/2 sm:w-full">
        <div className="flex m-auto p-5 overflow-x-auto justify-center">
          <table className="text-l w-full font-bold text-left text-gray-500 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  Books
                </th>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  Total Loan
                </th>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  Books on Loan
                </th>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  Books Returned
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 border">{data.book}</td>
                <td className="px-6 py-4 border">{data.user}</td>
                <td className="px-6 py-4 border">{data.loan}</td>
                <td className="px-6 py-4 border">{data.borrow}</td>
                <td className="px-6 py-4 border">{data.returned}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
