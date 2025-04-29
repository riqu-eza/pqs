/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Sign Up</h2>

        <label className="block text-gray-800 mb-1" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          className="block w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-gray-800 mb-1" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="block w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-gray-800 mb-1" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="block w-full mb-6 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg transition"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        {success && <p className="text-green-600 mt-2 text-sm">Signup successful!</p>}

        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-black hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
