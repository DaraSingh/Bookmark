"use client";
import Link from "next/link";
import { useSession,signOut } from "next-auth/react";
export default function Home() {
  const {data:session}=useSession();

  if(!session){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Link href="/login">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-indigo-600">MyApp 🚀</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome, {session.user.name} 🎉
        </h2>
        <p className="text-gray-600 max-w-xl">
          You have successfully logged in using Google Authentication.
          This is your protected dashboard page built with Next.js.
        </p>
      </div>
    </div>
  );
}
