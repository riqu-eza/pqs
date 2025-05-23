/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { ArtworkInput, QuotationInput } from "../../Types/quotation";
import { getQuotationSummary } from "../../lib/quotationformula";
import PaintSection from "./PaintSection";
import ArtworkSection from "./ArtworkSection";

export default function PaintQuotationForm() {
  const [formData, setFormData] = useState<QuotationInput>({
    quotationName: "",
    totalArea: 0,
    oilPaint: {
      area: 0,
      undercoatColors: [],
      topcoatColors: [],
      doubleArea: false,
    },
    waterPaint: { area: 0, undercoatColors: [], topcoatColors: [] },
    artworks: [],
  });
  const [loading, setLoading] = useState(false);
  const [quotationSummary, setQuotationSummary] = useState<any | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const addArtwork = () => {
    setFormData((prev) => ({
      ...prev,
      artworks: [
        ...prev.artworks,
        { name: "", litres: 0, id: "", colorCode: "" },
      ],
    }));
  };

  const updateArtwork = (index: number, artwork: ArtworkInput) => {
    const updated = [...formData.artworks];
    updated[index] = artwork;
    setFormData({ ...formData, artworks: updated });
  };

  const removeArtwork = (index: number) => {
    const updated = [...formData.artworks];
    updated.splice(index, 1);
    setFormData({ ...formData, artworks: updated });
  };
  const handleSubmit = async () => {
    setLoading(true);
    setQuotationSummary(null);
    setDownloadReady(false);
    setEmailSent(false);
    const token = localStorage.getItem("token");
    console.log(formData);
    try {
      const summary = await getQuotationSummary(formData);
      console.log("summary", summary);
      const res = await fetch("/api/quotation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ formData, summary }),
      });

      if (!res.ok) throw new Error("Failed to save quotation");

      const data = await res.json();
      console.log(data);
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

    setEmailLoading(true);
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
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePreviewAndDownloadPDF = async () => {
    if (!quotationSummary?._id) return;

    try {
      const res = await fetch(`/api/quotation/pdf?id=${quotationSummary._id}`);
      if (!res.ok) throw new Error("Failed to fetch PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Preview in new tab
      window.open(url, "_blank");

      // Auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${quotationSummary._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Optional: Revoke the blob URL after short delay (to allow both actions)
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("PDF fetch error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="space-y-4 p-4 bg-white rounded-xl shadow-lg">
        <label>Quotation Name:</label>
        <input
          type="text"
          value={formData.quotationName}
          onChange={(e) =>
            setFormData({ ...formData, quotationName: e.target.value })
          }
          className="w-full p-2 border rounded-md"
        />

        {/* Total Area Input */}
        <label className="block text-sm font-semibold">
          Total Area (m²):
          <input
            type="number"
            value={formData.totalArea}
            onChange={(e) =>
              setFormData({ ...formData, totalArea: Number(e.target.value) })
            }
            className="mt-2 w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* Oil Paint Section */}
        <PaintSection
          title="Gloss Paint"
          data={formData.oilPaint}
          onChange={(oilPaint) => setFormData({ ...formData, oilPaint })}
          allowDouble
        />

        {/* Water Paint Section */}
        <PaintSection
          title="Viln matt Paint"
          data={formData.waterPaint}
          onChange={(waterPaint) => setFormData({ ...formData, waterPaint })}
        />

        {/* Artwork Section */}
        <div>
          <h3 className="text-lg font-semibold">Artwork</h3>
          {formData.artworks.map((art, idx) => (
            <div
              key={idx}
              className="border p-2 my-2 rounded bg-gray-50 relative"
            >
              <ArtworkSection
                data={art}
                onChange={(val) => updateArtwork(idx, val)}
              />
              <button
                className="text-red-600 text-sm absolute top-2 right-2"
                onClick={() => removeArtwork(idx)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addArtwork}
            className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
          >
            + Add Artwork
          </button>
        </div>

        {/* Generate Quotation Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white ${
            loading ? "bg-gray-400" : "bg-blue-600"
          } mt-4`}
        >
          {loading ? "Generating..." : "Generate Quotation"}
        </button>

        {/* Quotation Summary */}
      </div>
      {quotationSummary && (
        <div className="mt-6 p-4 bg-white border rounded-xl shadow shadow-gray-300 text-sm sm:text-base">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Quotation Summary
          </h3>
          <p>
            <strong>Total Area:</strong> {quotationSummary.totalArea} m²
          </p>
          {/* Oil Paint Section */}
          <div className="mt-4">
            <h4 className="font-semibold text-blue-700">Gloss Paint</h4>
            <p>Area: {quotationSummary.oil.area} m²</p>

            {/* Undercoat */}
            <h5 className="mt-2 font-medium">Undercoat</h5>
            {quotationSummary.oil.undercoatBreakdown.map(
              (item: any, idx: number) => (
                <div key={idx} className="ml-4 mb-2">
                  <p>
                    Color: {item.colorName} ({item.colorCode})
                  </p>
                  <p>Litres: {item.litres}</p>
                  <p>
                    Packaging:{" "}
                    {Object.entries(item.packaging)
                      .map(([size, qty]) => `${qty} x ${size}L`)
                      .join(", ")}
                  </p>
                </div>
              )
            )}

            {/* Topcoat */}
            <h5 className="mt-2 font-medium">Topcoat</h5>
            {quotationSummary.oil.topcoatBreakdown.map(
              (item: any, idx: number) => (
                <div key={idx} className="ml-4 mb-2">
                  <p>
                    Color: {item.colorName} ({item.colorCode})
                  </p>
                  <p>Litres: {item.litres}</p>
                  <p>
                    Packaging:{" "}
                    {Object.entries(item.packaging)
                      .map(([size, qty]) => `${qty} x ${size}L`)
                      .join(", ")}
                  </p>
                </div>
              )
            )}

            {/* Thinner */}
            <h5 className="mt-2 font-medium">Solvents</h5>
            <div className="ml-4 mb-2">
              <p>Litres: {quotationSummary.oil.thinner.litres}</p>
              <p>
                Packaging:{" "}
                {Object.entries(quotationSummary.oil.thinner.packaging)
                  .map(([size, qty]) => `${qty} x ${size}L`)
                  .join(", ")}
              </p>
            </div>
          </div>
          {/* Water Paint Section */}
          <div className="mt-4">
            <h4 className="font-semibold text-blue-700">Viln matt Paint</h4>
            <p>Area: {quotationSummary.water.area} m²</p>
            
            {/* Undercoat */}
            <h5 className="mt-2 font-medium">Undercoat</h5>
            {quotationSummary.water.undercoatBreakdown.map(
              (item: any, idx: number) => (
                <div key={idx} className="ml-4 mb-2">
                  <p>
                    Color: {item.colorName} ({item.colorCode})
                  </p>
                  <p>Litres: {item.litres}</p>
                  <p>
                    Packaging:{" "}
                    {Object.entries(item.packaging)
                      .map(([size, qty]) => `${qty} x ${size}L`)
                      .join(", ")}
                  </p>
                </div>
              )
            )}

            {/* Topcoat */}
            <h5 className="mt-2 font-medium">Topcoat</h5>
            {quotationSummary.water.topcoatBreakdown.map(
              (item: any, idx: number) => (
                <div key={idx} className="ml-4 mb-2">
                  <p>
                    Color: {item.colorName} ({item.colorCode})
                  </p>
                  <p>Litres: {item.litres}</p>
                  <p>
                    Packaging:{" "}
                    {Object.entries(item.packaging)
                      .map(([size, qty]) => `${qty} x ${size}L`)
                      .join(", ")}
                  </p>
                </div>
              )
            )}
          </div>
          {/* Artwork Section */}
          <div className="mt-4">
            <h4 className="font-semibold text-blue-700">Artworks</h4>
            {quotationSummary.artworks.map((art: any, idx: number) => (
              <div key={idx} className="ml-4 mb-4">
                <p className="font-medium text-black">Name: {art.name}</p>
                {art.colors.map((color: any, colorIdx: number) => (
                  <div key={colorIdx} className="ml-4 mb-2">
                    <p>Color Code: {color.colorCode}</p>
                    <p>Litres: {color.litres}</p>
                    <p>
                      Packaging:{" "}
                      {Object.entries(color.packaging)
                        .map(([size, qty]) => `${qty} x ${size}L`)
                        .join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Email Button */}
          <button
            onClick={handleSendEmail}
            disabled={emailLoading || emailSent}
            className={`mt-4 w-full py-2 rounded-lg font-semibold transition duration-200 ${
              emailSent ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {emailLoading
              ? "Sending..."
              : emailSent
              ? "Email Sent!"
              : "Send Quotation via Email"}
          </button>
          <button
            onClick={handlePreviewAndDownloadPDF}
            disabled={!downloadReady || loading}
            className={`mt-3 w-full py-2 rounded-lg ${
              !downloadReady
                ? "bg-gray-400"
                : "bg-purple-600 hover:bg-purple-700"
            } text-white font-semibold transition duration-200 flex items-center justify-center gap-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 4a1 1 0 011-1h4v2H5v10h10V5h-3V3h4a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              <path d="M9 12V7h2v5h2l-3 3-3-3h2z" />
            </svg>
            {!downloadReady ? "Generating PDF..." : "Preview & Download PDF"}
          </button>
          
        </div>
      )}
    </div>
  );
}
