"use client";

import { useEffect, useState } from "react";

export default function AccountPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

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
  if (loading) return <p className="p-6">Loading...</p>;

    return (
      <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Account Details</h2>

      {user ? (
        <div className="flex items-center space-x-4 mt-4">
          {/* Avatar Placeholder */}
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div>
            <p className="text-lg font-medium">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    );
  }
  