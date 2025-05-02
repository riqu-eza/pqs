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
    {/* Header: Name + Date */}
    <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-black mb-6">
      <div className="text-xl font-bold">{user?.name}</div>
      <div className="text-sm text-gray-500">{today}</div>
    </div>
  
    {/* Navigation Tabs */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
      {[
        { href: "/profile/history", label: "History" },
        { href: "/profile/account", label: "Account" },
        { href: "/profile/make-quotation", label: "Make a Quotation" },
        // { href: "/profile/drafts", label: "Drafts" },
      ].map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`w-full text-center px-4 py-2 rounded-xl border transition-colors ${
            pathname.includes(href)
              ? "bg-black text-white"
              : "bg-white text-black border-gray-300 hover:bg-gray-50"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  
    {/* Content Area */}
    <div className="bg-white p-4 rounded-xl shadow text-black">
      {children}
    </div>
  </div>
  
  );
}
