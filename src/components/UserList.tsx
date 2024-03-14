"use client";
import { getData } from "@/services/book";
import Link from "next/link";
import { useState, useEffect } from "react";

interface User {
  id: string;
  externalId: string;
  email: string;
  username: string;
  role: string;
  _count: {
    Loan: string;
  };
}

const getUsers = async (): Promise<User[]> => {
  const res = await getData(`/api/users`);
  console.log(res);
  return res.users;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (!confirmDelete) return;

      const loanData = await fetch(`http://localhost:3000/api/users?id=${id}`);
      const activeLoans = await loanData.json();
      if (activeLoans.user.Loan.length > 0) {
        alert("This user cannot be deleted because it is currently on loan.");
        return;
      }

      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedUsersData = await getUsers();
        setUsers(updatedUsersData);
      } else {
        console.error("Failed to delete user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        console.log(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
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
              Email
            </th>
            <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
              Roles
            </th>
            <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
              Total Borrowed
            </th>
            <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white whitespace-nowrap divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="px-6 py-4 border">{index + 1}</td>
              <td className="px-6 py-4 border">{user.email}</td>
              <td className="px-6 py-4 border">{user.username}</td>
              <td className="px-6 py-4 border">{user.role}</td>
              <td className="px-6 py-4 border">{user._count.Loan}</td>
              <td className="px-6 py-4 border">
                <Link href={`/admin/user/update/${user.externalId}`}>
                  <div className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </div>
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
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
