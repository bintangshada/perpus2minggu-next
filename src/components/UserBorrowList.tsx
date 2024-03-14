"use client";
import { getData } from "@/services/book";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const getLoans = async (id: any) => {
  const res = await getData(`api/users?id=${id}`);
  console.log(res);
  return res;
};

export default function UserBorrowList(props: any) {
  const [loans, setLoans] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loanData = await getLoans(user?.id);
        setLoans(loanData);
        console.log(loanData);
      } catch (error) {
        console.error("Error fetching Loan", error);
      }
    };

    fetchLoans();
  }, [user?.id]);
  console.log(loans)
  return (
    <div className="flex m-auto p-5 overflow-x-auto justify-center">
      <div>
        <table className="text-l w-full font-bold text-left text-gray-500 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                Books
              </th>
            </tr>
          </thead>
          <tbody className="bg-white whitespace-nowrap divide-y divide-gray-200">
            {loans.length > 0 ? (
              loans.map((loan, index) => (
                <tr key={index}>
                  <td>{loan.book_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No loans available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
