"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const today = new Date().toLocaleDateString();

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center text-gray-700 bg-white p-4 rounded shadow mb-4">
        <div className="text-lg font-semibold">{user?.name}</div>
        <div className="text-gray-600">{today}</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link
          href="/profile/history"
          className={`px-4 py-2 rounded ${
            pathname.includes("/profile/history")
              ? "bg-black text-white"
              : "bg-white text-black border"
          }`}
        >
          History
        </Link>
        <Link
          href="/profile/account"
          className={`px-4 py-2 rounded ${
            pathname.includes("/profile/account")
              ? "bg-black text-white"
              : "bg-white text-black border"
          }`}
        >
          Account
        </Link>
        <Link
          href="/profile/make-quotation"
          className={`px-4 py-2 rounded ${
            pathname.includes("/profile/make-quotation")
              ? "bg-black text-white"
              : "bg-white text-black border"
          }`}
        >
          Make a Quotation
        </Link>
        <Link
          href="/profile/drafts"
          className={`px-4 py-2 rounded ${
            pathname.includes("/profile/drafts")
              ? "bg-black text-white"
              : "bg-white text-black border"
          }`}
        >
          Drafts
        </Link>
      </div>

      <div className="bg-white p-4 text-black rounded shadow">{children}</div>
    </div>
  );
}
