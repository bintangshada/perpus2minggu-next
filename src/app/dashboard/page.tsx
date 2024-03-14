import NavigationBar from "@/components/Navbar";
import { currentUser, useUser } from "@clerk/nextjs";
import { user } from "@nextui-org/react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  return (
    <>
      <div className="flex flex-col">
        <NavigationBar />
        <div className="md:h-[90dvh] xl:h-[80dvh]">
          <div className="text-center bg-[url('/bg-elegant.avif')] md:h-[70dvh] xl:h-[60dvh] xl:bg-contain max-[1288px]:object-contain max-[1288px]:bg-cover flex flex-col justify-center items-center">
            <div className="flex flex-col md:flex-row gap-2 md:gap-10 w-[90%] justify-center items-center pt-4">
              <div className="flex flex-col justify-center items-center gap-10">
                <h1 className="font-major font-bold text-xl sm:text-3xl">
                  Selamat Datang{" "}
                  <span className="text-[#9A3412]">{user?.username}</span> di
                  Website Perpustakaan 2 Minggu
                </h1>
                <p className="mx-14 font-poppins text-center xl:w-[70%]">
                  Pinjam buku dengan mudah menggunakan website perpustakaan
                  kami, ayoo tunggu apalagi pinjam buku favoritemu sekarang
                  juga.
                </p>
                <Link href="/book">
                  <button className="bg-white rounded-xl border-2 border-[#ffa08d] border-solid shadow-2xl font-poppins shadow-red-100 px-5 py-3 hover:bg-[#9A3412] hover:text-white hover:scale-105 transition hover:duration-300">
                    Pinjam Buku Yukk..
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="text-center text-xl mx-2 md:text-3xl xl:text-4xl">
          <h1 className="font-major font-extrabold">
            Peminjaman Buku Terfavorit
          </h1>
        </div> */}
      </div>
      <hr className="sm:mb-10 text-black border" />
    </>
  );
}
