"use client";
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
    <div className="flex m-auto p-5 overflow-x-auto justify-center">
      <div>
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
              <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                Actions
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
                <td className="px-6 py-4 border">
                  <div>
                    <button
                      onClick={() => handleEdit(loan.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit Status
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(loan.id)}
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
    </div>
  );
}
