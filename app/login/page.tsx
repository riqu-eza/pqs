'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        router.push('/profile');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch {
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Login</h2>

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
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-black hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
