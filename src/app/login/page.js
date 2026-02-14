"use client";
import React from 'react'
import {signIn} from "next-auth/react"
function page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 mb-8">
          Sign in with Google to continue
        </p>

        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-lg hover:bg-green-800"
        >
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default page
