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
      artworks: [...prev.artworks, { name: "", litres: 0, id: "" }],
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
          title="Oil Paint"
          data={formData.oilPaint}
          onChange={(oilPaint) => setFormData({ ...formData, oilPaint })}
          allowDouble
        />

        {/* Water Paint Section */}
        <PaintSection
          title="Water Paint"
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
        {quotationSummary && (
          <div className="mt-6 p-4 bg-white border rounded-xl shadow shadow-gray-300 text-sm sm:text-base">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Quotation Summary
            </h3>

            <div className="space-y-4 text-gray-800">
              <p>
                <strong>Total Area:</strong> {quotationSummary.totalArea} m²
              </p>

              {/* Oil Paint Details */}
              <div>
                <strong className="text-black">Oil Paint:</strong>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Area: {quotationSummary.oil.area} m²</li>
                  {/* <li>
                    Double Area:{" "}
                    {quotationSummary.oil.doubleArea ? "Yes" : "No"}
                  </li>
                  <li>
                    Undercoat Color: {quotationSummary.oil.undercoatColor}
                  </li>
                  <li>Topcoat Color: {quotationSummary.oil.topcoatColor}</li> */}
                  <li>
                    Undercoat Litres: {quotationSummary.oil.undercoatLitres}
                  </li>
                  <li>Topcoat Litres: {quotationSummary.oil.topcoatLitres}</li>

                  {quotationSummary.oil.undercoatBreakdown?.length > 0 && (
                    <li>
                      Undercoat Packaging:
                      <ul className="ml-4 list-disc">
                        {quotationSummary.oil.undercoatBreakdown.map(
                          (color) => (
                            <li key={color.colorCode}>
                              {color.colorCode} :{" "}
                              {Object.entries(color.packaging)
                                .map(([size, qty]) => `${qty} x ${size}L`)
                                .join(", ")}
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                  )}

                  {quotationSummary.oil.topcoatBreakdown?.length > 0 && (
                    <li>
                      Topcoat Packaging:
                      <ul className="ml-4 list-disc">
                        {quotationSummary.oil.topcoatBreakdown.map((color) => (
                          <li key={color.colorCode}>
                            {color.colorCode} :{" "}
                            {Object.entries(color.packaging)
                              .map(([size, qty]) => `${qty} x ${size}L`)
                              .join(", ")}
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
              </div>

              {/* Water Paint Details */}
              <div>
                <strong className="text-black">Water Paint:</strong>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Area: {quotationSummary.water.area} m²</li>
                  {/* <li>
                    Undercoat Color: {quotationSummary.water.undercoatColor}
                  </li>
                  <li>Topcoat Color: {quotationSummary.water.topcoatColor}</li> */}
                  <li>
                    Undercoat Litres: {quotationSummary.water.undercoatLitres}
                  </li>
                  <li>
                    Topcoat Litres: {quotationSummary.water.topcoatLitres}
                  </li>

                  {quotationSummary.water.undercoatBreakdown?.length > 0 && (
                    <li>
                      Undercoat Packaging:
                      <ul className="ml-4 list-disc">
                        {quotationSummary.water.undercoatBreakdown.map(
                          (color) => (
                            <li key={color.colorCode}>
                              {color.colorCode} :{" "}
                              {Object.entries(color.packaging)
                                .map(([size, qty]) => `${qty} x ${size}L`)
                                .join(", ")}
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                  )}

                  {quotationSummary.water.topcoatBreakdown?.length > 0 && (
                    <li>
                      Topcoat Packaging:
                      <ul className="ml-4 list-disc">
                        {quotationSummary.water.topcoatBreakdown.map(
                          (color) => (
                            <li key={color.colorCode}>
                              {color.colorCode} :{" "}
                              {Object.entries(color.packaging)
                                .map(([size, qty]) => `${qty} x ${size}L`)
                                .join(", ")}
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                  )}
                </ul>
              </div>

              {/* Artwork Details */}
              {quotationSummary.artworks?.length > 0 && (
                <div>
                  <strong className="text-black">Artworks:</strong>
                  <ul className="ml-4 list-disc space-y-2">
                    {quotationSummary.artworks.map((art) => (
                      <li key={art.id}>
                        <div>
                          <strong>Name:</strong> {art.name}
                        </div>
                        <div>
                          <strong>Litres:</strong> {art.litres}
                        </div>
                        <div>
                          <strong>Color Code:</strong> {art.colorCode}
                        </div>
                        <div>
                          <strong>Packaging:</strong>{" "}
                          {Object.entries(art.packaging)
                            .map(([size, qty]) => `${qty} x ${size}L`)
                            .join(", ")}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Buttons for Download & Email */}
            {downloadReady && (
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-md"
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
                  className={`w-full sm:w-auto px-4 py-2 rounded-md text-white ${
                    emailLoading ? "bg-gray-400" : "bg-gray-800"
                  }`}
                  onClick={handleSendEmail}
                  disabled={emailLoading}
                >
                  {emailLoading ? "Sending..." : "Send to Email"}
                </button>
              </div>
            )}

            {emailSent && (
              <p className="text-green-700 mt-2">
                Quotation sent to your email.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
