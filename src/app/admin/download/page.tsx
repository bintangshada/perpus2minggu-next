"use client";
import NavigationBarAdmin from "@/components/NavbarAdmin";
import { getData } from "@/services/book";
import { table } from "console";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";

interface Loan {
  id: string;
  user: {
    id: string;
    username: string;
  };
  book: {
    id: string;
    title: string;
  };
  borrowedAt: string;
  returnedAt: string;
  status: string;
}

const getLoans = async (): Promise<Loan[]> => {
  const res = await getData(`/api/loan`);
  return res.loan;
};

export default function LoanList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/loan?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedLoansData = await getLoans();
        setLoans(updatedLoansData);
      } else {
        console.error("Failed to update loan:", response.statusText);
      }
    } catch (error) {
      console.log("Error updating loan:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this?"
      );
      if (!confirmDelete) return;

      const response = await fetch(`/api/loan?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedLoansData = await getLoans();
        setLoans(updatedLoansData);
      } else {
        console.error("Failed to delete user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loanData = await getLoans();
        setLoans(loanData);
        console.log(setLoans);
      } catch (error) {
        console.error("Error fetching Loan", error);
      }
    };

    fetchLoans();
  }, []);
  return (
    <>
      <NavigationBarAdmin />
      <div className="flex m-auto p-5 overflow-x-auto justify-center">
        <div>
          <div>
            <DownloadTableExcel
              filename="users table"
              sheet="users"
              currentTableRef={tableRef.current}
            >
              <button className="py-3.5 px-5 me-14 text-sm font-medium text-white focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-green-700 dark:bg-green-800  dark:border-gray-600 dark:hover:text-white dark:hover:bg-green-700">
                Export excel
              </button>
            </DownloadTableExcel>
          </div>
          <table
            ref={tableRef}
            className="text-l w-full font-bold text-left text-gray-500 divide-y divide-gray-200"
          >
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  Borrowed At
                </th>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  Returned At
                </th>
                <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white whitespace-nowrap divide-y divide-gray-200">
              {loans.map((loan, index) => (
                <tr key={loan.id}>
                  <td className="px-6 py-4 border">{index + 1}</td>
                  <td className="px-6 py-4 border">{loan.user.username}</td>
                  <td className="px-6 py-4 border">{loan.book.title}</td>
                  <td className="px-6 py-4 border">{loan.borrowedAt}</td>
                  <td className="px-6 py-4 border">{loan.returnedAt}</td>
                  <td className="px-6 py-4 border">{loan.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
