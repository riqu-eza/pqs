/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { QuotationInput } from "../../Types/quotation";
import { getQuotationSummary } from "../../lib/quotationformula";
import PaintSection from "./PaintSection";
import ArtworkSection from "./ArtworkSection";

export default function PaintQuotationForm() {
  const [formData, setFormData] = useState<QuotationInput>({
    totalArea: 0,
    oilPaint: {
      area: 0,
      undercoatColor: "",
      topcoatColor: "",
      doubleArea: false,
    },
    waterPaint: { area: 0, undercoatColor: "", topcoatColor: "" },
    artwork: { name: "", litres: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [quotationSummary, setQuotationSummary] = useState<any | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setQuotationSummary(null);
    setDownloadReady(false);
    setEmailSent(false);

    try {
      const summary = await getQuotationSummary(formData);

      const res = await fetch("/api/quotation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, summary }),
      });

      if (!res.ok) throw new Error("Failed to save quotation");

      const data = await res.json();
      setQuotationSummary({ ...summary, _id: data.quotation._id });
      setDownloadReady(true);
    } catch (err) {
      console.error("Failed to generate or save quotation", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    const token = localStorage.getItem("token");
    if (!token || !quotationSummary?._id) return;

    try {
      const res = await fetch("/api/quotation/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quotationId: quotationSummary._id }),
      });

      if (res.ok) {
        setEmailSent(true);
      } else {
        throw new Error("Email failed");
      }
    } catch (err) {
      console.error("Email sending error:", err);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <label>
        Total Area (m²):
        <input
          type="number"
          value={formData.totalArea}
          onChange={(e) =>
            setFormData({ ...formData, totalArea: Number(e.target.value) })
          }
          className="border p-1 rounded ml-2"
        />
      </label>

      <PaintSection
        title="Oil Paint"
        data={formData.oilPaint}
        onChange={(oilPaint) => setFormData({ ...formData, oilPaint })}
        allowDouble
      />

      <PaintSection
        title="Water Paint"
        data={formData.waterPaint}
        onChange={(waterPaint) => setFormData({ ...formData, waterPaint })}
      />

      <ArtworkSection
        data={formData.artwork}
        onChange={(artwork) => setFormData({ ...formData, artwork })}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-500"
        }`}
      >
        {loading ? "Generating..." : "Generate Quotation"}
      </button>

      {quotationSummary && (
        <div className="mt-4 p-4 border rounded bg-white shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quotation Summary</h3>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Total Area:</strong> {quotationSummary.totalArea} m²
            </p>

            <div>
              <strong>Oil Paint:</strong>
              <ul className="ml-4 list-disc">
                <li>Area: {quotationSummary.oil.area} m²</li>
                <li>
                  Double Area: {quotationSummary.oil.doubleArea ? "Yes" : "No"}
                </li>
                <li>Undercoat Color: {quotationSummary.oil.undercoatColor}</li>
                <li>Topcoat Color: {quotationSummary.oil.topcoatColor}</li>
                <li>Total Litres: {quotationSummary.oil.litres}</li>
                <li>
                  Packaging:{" "}
                  {Object.entries(quotationSummary.oil.packaging)
                    .map(([size, qty]) => `${qty} x ${size}L`)
                    .join(", ")}
                </li>
              </ul>
            </div>

            <div>
              <strong>Water Paint:</strong>
              <ul className="ml-4 list-disc">
                <li>Area: {quotationSummary.water.area} m²</li>
                <li>
                  Undercoat Color: {quotationSummary.water.undercoatColor}
                </li>
                <li>Topcoat Color: {quotationSummary.water.topcoatColor}</li>
                <li>Total Litres: {quotationSummary.water.litres}</li>
                <li>
                  Packaging:{" "}
                  {Object.entries(quotationSummary.water.packaging)
                    .map(([size, qty]) => `${qty} x ${size}L`)
                    .join(", ")}
                </li>
              </ul>
            </div>

            <div>
              <strong>Artwork:</strong>
              <ul className="ml-4 list-disc">
                <li>Name: {quotationSummary.artwork.name}</li>
                <li>Litres: {quotationSummary.artwork.litres}</li>
              </ul>
            </div>
          </div>

          {downloadReady && (
            <div className="flex gap-4 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() =>
                  window.open(
                    `/api/quotation/pdf?id=${quotationSummary._id}`,
                    "_blank"
                  )
                }
              >
                Download PDF
              </button>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSendEmail}
              >
                Send to Email
              </button>
            </div>
          )}

          {emailSent && (
            <p className="text-green-700 mt-2">Quotation sent to your email.</p>
          )}
        </div>
      )}
    </div>
  );
}
