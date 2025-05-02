'use client';

import { useEffect, useState } from 'react';

type Quotation = {
  _id: string;
  formData: {
    totalArea: number;
    oilPaint: {
      area: number;
      undercoatColor: string;
      topcoatColor: string;
      doubleArea: boolean;
    };
    waterPaint: {
      area: number;
      undercoatColor: string;
      topcoatColor: string;
    };
    artwork: {
      name: string;
      litres: number;
      id: string;
    };
  };
  summary: {
    totalArea: number;
    oil: {
      area: number;
      doubleArea: boolean;
      undercoatColor: string;
      topcoatColor: string;
      litres: number;
      packaging: Record<string, number>;
    };
    water: {
      area: number;
      undercoatColor: string;
      topcoatColor: string;
      litres: number;
      packaging: Record<string, number>;
    };
    artwork: {
      id: string;
      name: string;
      litres: number;
      colorCode: string;
    };
  };
  createdAt: string;
};

export default function QuotationHistory() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/quotation/create', {
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

  // Helper function to render the quotation data
  const renderQuotation = (quotation: Quotation) => {
    const { formData, summary, createdAt } = quotation;

    return (
      <div key={quotation._id} className="p-4 border rounded shadow bg-white">
        <div className="text-lg font-bold">Quotation for {formData.artwork.name}</div>
        <div className="text-gray-600">Total Area: {formData.totalArea} m²</div>

        {/* Oil Paint Details */}
        <div>
          <strong>Oil Paint:</strong>
          <div>Area: {summary.oil.area} m²</div>
          <div>Double Area: {summary.oil.doubleArea ? 'Yes' : 'No'}</div>
          <div>
            Undercoat Color: {summary.oil.undercoatColor}, Topcoat Color: {summary.oil.topcoatColor}
          </div>
          <div>Total Litres: {summary.oil.litres}</div>
          <div>
            Packaging:{' '}
            {Object.entries(summary.oil.packaging)
              .map(([size, qty]) => `${qty} x ${size}L`)
              .join(', ')}
          </div>
        </div>

        {/* Water Paint Details */}
        <div>
          <strong>Water Paint:</strong>
          <div>Area: {summary.water.area} m²</div>
          <div>
            Undercoat Color: {summary.water.undercoatColor}, Topcoat Color: {summary.water.topcoatColor}
          </div>
          <div>Total Litres: {summary.water.litres}</div>
          <div>
            Packaging:{' '}
            {Object.entries(summary.water.packaging)
              .map(([size, qty]) => `${qty} x ${size}L`)
              .join(', ')}
          </div>
        </div>

        {/* Artwork Details */}
        <div>
          <strong>Artwork:</strong>
          <div>Name: {summary.artwork.name}</div>
          <div>Litres: {summary.artwork.litres}</div>
          <div>Color Code: {summary.artwork.colorCode}</div>
        </div>

        {/* Quotation Date */}
        <div className="text-sm text-gray-400">
          Created on: {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {quotations.map((quotation) => renderQuotation(quotation))}
    </div>
  );
}
