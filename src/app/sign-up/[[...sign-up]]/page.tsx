import { SignUp } from "@clerk/nextjs";

export default function Page() {
      return (
        <div className="flex flex-col items-center justify-center gap-10">
          <h1 className="text-4xl font-bold mt-20">SIGN UP</h1>
          <SignUp />
        </div>
      );
}