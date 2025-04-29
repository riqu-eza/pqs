'use client';

import { useEffect, useState } from 'react';

type Quotation = {
  _id: string;
  title: string;
  amount: number;
  createdAt: string;
};

export default function QuotationHistory() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/quotations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setQuotations(data.quotations);
      }

      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Loading quotation history...</p>;

  if (quotations.length === 0) {
    return <p>No quotations found.</p>;
  }

  return (
    <div className="space-y-4">
      {quotations.map((q) => (
        <div key={q._id} className="p-4 border rounded shadow bg-white">
          <div className="text-lg font-bold">{q.title}</div>
          <div className="text-gray-600">Amount: ${q.amount}</div>
          <div className="text-sm text-gray-400">Created on: {new Date(q.createdAt).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}
