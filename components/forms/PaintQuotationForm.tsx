/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { ArtworkInput, QuotationInput } from "../../Types/quotation";
import { getQuotationSummary } from "../../lib/quotationformula";
import PaintSection from "./PaintSection";
import ArtworkSection from "./ArtworkSection";

// ========== Reusable Components ==========

const StepProgress = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: string[];
}) => (
  <div className="flex justify-between px-6 py-4 border-b">
    {steps.map((step, index) => (
      <div key={index} className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= index ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {index + 1}
        </div>
        <span
          className={`text-xs mt-1 ${
            currentStep >= index ? "font-semibold" : "text-gray-500"
          }`}
        >
          {step}
        </span>
      </div>
    ))}
  </div>
);

const NavigationButtons = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  isGenerating,
}: {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isGenerating?: boolean;
}) => (
  <div className="flex justify-between p-4 border-t">
    <button
      onClick={onPrev}
      disabled={currentStep === 0}
      className={`px-4 py-2 rounded-md ${
        currentStep === 0 ? "bg-gray-300" : "bg-gray-600 hover:bg-gray-700"
      } text-white`}
    >
      Previous
    </button>
    <button
      onClick={onNext}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      disabled={isGenerating}
    >
      {currentStep === totalSteps - 1
        ? isGenerating
          ? "Generating..."
          : "Generate"
        : "Next"}
    </button>
  </div>
);

const BasicInfoStep = ({
  formData,
  setFormData,
}: {
  formData: QuotationInput;
  setFormData: (data: QuotationInput) => void;
}) => (
  <div className="space-y-4 p-6">
    <h2 className="text-xl font-bold mb-4">Basic Information</h2>
    <div>
      <label className="block text-sm font-semibold mb-1">
        Quotation Name:
      </label>
      <input
        type="text"
        value={formData.quotationName}
        onChange={(e) =>
          setFormData({ ...formData, quotationName: e.target.value })
        }
        className="w-full p-2 border rounded-md"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-1">
        Total Area (m²):
      </label>
      <input
        type="number"
        value={formData.totalArea}
        onChange={(e) =>
          setFormData({ ...formData, totalArea: Number(e.target.value) })
        }
        className="w-full p-2 border rounded-md"
        required
        min="0"
      />
    </div>
  </div>
);

const PaintTypeStep = ({
  title,
  formData,
  setFormData,
  paintType,
}: {
  title: string;
  formData: QuotationInput;
  setFormData: (data: QuotationInput) => void;
  paintType: "oilPaint" | "waterPaint";
}) => (
  <div className="space-y-4 p-6">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <PaintSection
      title={title}
      data={formData[paintType]}
      onChange={(data) => setFormData({ ...formData, [paintType]: data })}
      allowDouble={paintType === "oilPaint"}
    />
  </div>
);

const ArtworkStep = ({
  formData,
  setFormData,
}: {
  formData: QuotationInput;
  setFormData: (data: QuotationInput) => void;
}) => {
  const addArtwork = () => {
    setFormData({
      ...formData,
      artworks: [
        ...formData.artworks,
        { name: "", id: "", colors: [] },
      ],
    });
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

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold mb-4">Artwork</h2>
      {formData.artworks.map((art, idx) => (
        <div key={idx} className="border p-2 my-2 rounded bg-gray-50 relative">
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
  );
};

const SummaryStep = ({ formData }: { formData: QuotationInput }) => (
  <div className="space-y-4 p-6">
    <h2 className="text-xl font-bold mb-4">Review Your Quotation</h2>
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Basic Information
        </h3>
        <div className="ml-4 text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Quotation Name:</span>{" "}
            {formData.quotationName}
          </p>
          <p>
            <span className="font-medium">Total Area:</span>{" "}
            {formData.totalArea} m²
          </p>
        </div>
      </div>

      {/* Gloss Paint */}
      {/* Gloss Paint */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Gloss Paint
        </h3>
        <div className="ml-4 text-gray-700 space-y-2">
          <p>
            <span className="font-medium">Area:</span> {formData.oilPaint.area}{" "}
            m²
          </p>
          <p>
            <span className="font-medium">Double Area:</span>{" "}
            {formData.oilPaint.doubleArea ? "Yes" : "No"}
          </p>

          {/* Undercoat Colors */}
          <div>
            <p className="font-medium text-gray-600">Undercoat Colors:</p>
            {formData.oilPaint.undercoatColors?.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {formData.oilPaint.undercoatColors.map((color, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{color.name}</span> (
                    {color.code}) - {color.percentage}%
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                No undercoat colors specified
              </p>
            )}
          </div>

          {/* Topcoat Colors */}
          <div>
            <p className="font-medium text-gray-600 mt-2">Topcoat Colors:</p>
            {formData.oilPaint.topcoatColors?.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {formData.oilPaint.topcoatColors.map((color, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{color.name}</span> (
                    {color.code}) - {color.percentage}%
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                No topcoat colors specified
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Vinyl Matt Paint */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Vinyl Matt Paint
        </h3>
        <div className="ml-4 text-gray-700 space-y-2">
          <p>
            <span className="font-medium">Area:</span>{" "}
            {formData.waterPaint.area} m²
          </p>

          {/* Undercoat Colors */}
          <div>
            <p className="font-medium text-gray-600">Undercoat Colors:</p>
            {formData.waterPaint.undercoatColors?.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {formData.waterPaint.undercoatColors.map((color, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{color.name}</span> (
                    {color.code}) - {color.percentage}%
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                No undercoat colors specified
              </p>
            )}
          </div>

          {/* Topcoat Colors */}
          <div>
            <p className="font-medium text-gray-600 mt-2">Topcoat Colors:</p>
            {formData.waterPaint.topcoatColors?.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {formData.waterPaint.topcoatColors.map((color, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{color.name}</span> (
                    {color.code}) - {color.percentage}%
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                No topcoat colors specified
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Artwork Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Artwork</h3>
        {formData.artworks.length > 0 ? (
          formData.artworks.map((art, idx) => (
            <div
              key={idx}
              className="ml-4 mb-4 border-l-4 border-blue-200 pl-4"
            >
              <p className="text-gray-700 font-medium">Name: {art.name}</p>
              {art.colors && art.colors.length > 0 ? (
                <div className="mt-1">
                  <p className="font-medium text-gray-600">Colors:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {art.colors.map((color, colorIdx) => (
                      <li key={colorIdx}>
                        <span className="font-medium">{color.colorName}</span> (
                        {color.colorCode}) - {color.litres}L
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 italic">No colors specified</p>
              )}
            </div>
          ))
        ) : (
          <p className="ml-4 text-gray-500 italic">No artwork added</p>
        )}
      </div>
    </div>
  </div>
);

const ResultStep = ({
  quotationSummary,
  onDownload,
  onEmail,
  onNewQuotation,
  downloadReady,
  emailSent,
  emailLoading,
}: {
  quotationSummary: any;
  onDownload: () => void;
  onEmail: () => void;
  onNewQuotation: () => void;
  downloadReady: boolean;
  emailSent: boolean;
  emailLoading: boolean;
}) => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-6 text-center">Quotation Preview</h2>
    <div className="border rounded-lg p-4 mb-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">
        Summary Overview
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="font-medium">Quotation Reference:</p>
          <p>{quotationSummary._id}</p>
        </div>
        <div>
          <p className="font-medium">Total Area:</p>
          <p>{quotationSummary.totalArea} m²</p>
        </div>
      </div>

      {/* Paint Sections */}
      <div className="space-y-6">
        {quotationSummary.oil.area > 0 && (
          <div>
            <h4 className="font-semibold text-blue-700 border-b pb-1">
              Gloss Paint
            </h4>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <span className="font-medium">Area:</span>
              <span className="col-span-2">{quotationSummary.oil.area} m²</span>

              <span className="font-medium">Undercoat:</span>
              <div className="col-span-2">
                {quotationSummary.oil.undercoatBreakdown.map(
                  (item: any, idx: number) => (
                    <div key={idx} className="mb-1">
                      <p>
                        {item.colorName} ({item.colorCode}) - {item.litres}L
                      </p>
                      <p className="text-sm text-gray-600">
                        {Object.entries(item.packaging)
                          .map(([size, qty]) => `${qty} × ${size}L`)
                          .join(", ")}
                      </p>
                    </div>
                  )
                )}
              </div>

              <span className="font-medium">Topcoat:</span>
              <div className="col-span-2">
                {quotationSummary.oil.topcoatBreakdown.map(
                  (item: any, idx: number) => (
                    <div key={idx} className="mb-1">
                      <p>
                        {item.colorName} ({item.colorCode}) - {item.litres}L
                      </p>
                      <p className="text-sm text-gray-600">
                        {Object.entries(item.packaging)
                          .map(([size, qty]) => `${qty} × ${size}L`)
                          .join(", ")}
                      </p>
                    </div>
                  )
                )}
              </div>

              <span className="font-medium">Solvents:</span>
              <div className="col-span-2">
                <p>{quotationSummary.oil.thinner.litres}L</p>
                <p className="text-sm text-gray-600">
                  {Object.entries(quotationSummary.oil.thinner.packaging)
                    .map(([size, qty]) => `${qty} × ${size}L`)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {quotationSummary.water.area > 0 && (
          <div>
            <h4 className="font-semibold text-blue-700 border-b pb-1">
              Vinly matt Paint
            </h4>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <span className="font-medium">Area:</span>
              <span className="col-span-2">
                {quotationSummary.water.area} m²
              </span>

              <span className="font-medium">Undercoat:</span>
              <div className="col-span-2">
                {quotationSummary.water.undercoatBreakdown.map(
                  (item: any, idx: number) => (
                    <div key={idx} className="mb-1">
                      <p>
                        {item.colorName} ({item.colorCode}) - {item.litres}L
                      </p>
                      <p className="text-sm text-gray-600">
                        {Object.entries(item.packaging)
                          .map(([size, qty]) => `${qty} × ${size}L`)
                          .join(", ")}
                      </p>
                    </div>
                  )
                )}
              </div>

              <span className="font-medium">Topcoat:</span>
              <div className="col-span-2">
                {quotationSummary.water.topcoatBreakdown.map(
                  (item: any, idx: number) => (
                    <div key={idx} className="mb-1">
                      <p>
                        {item.colorName} ({item.colorCode}) - {item.litres}L
                      </p>
                      <p className="text-sm text-gray-600">
                        {Object.entries(item.packaging)
                          .map(([size, qty]) => `${qty} × ${size}L`)
                          .join(", ")}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {quotationSummary.artworks.length > 0 && (
          <div>
            <h4 className="font-semibold text-blue-700 border-b pb-1">
              Artworks
            </h4>
            {quotationSummary.artworks.map((art: any, idx: number) => (
              <div key={idx} className="mt-3">
                <p className="font-medium">{art.name}</p>
                <div className="grid grid-cols-3 gap-2 ml-2">
                  {art.colors.map((color: any, colorIdx: number) => (
                    <div key={colorIdx} className="col-span-3">
                      <p>
                        Color: {color.colorCode} - {color.colorName} -{" "}
                        {color.litres}L
                      </p>
                      <p className="text-sm text-gray-600">
                        {Object.entries(color.packaging)
                          .map(([size, qty]) => `${qty} × ${size}L`)
                          .join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Review your quotation above before sending or downloading. This is
            exactly what will be included in your PDF and email.
          </p>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3">
      <button
        onClick={onEmail}
        disabled={emailLoading || emailSent}
        className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${
          emailSent ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
        } text-white flex items-center justify-center gap-2`}
      >
        {emailLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </>
        ) : emailSent ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Email Sent!
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Send Quotation via Email
          </>
        )}
      </button>

      <button
        onClick={onDownload}
        disabled={!downloadReady}
        className={`w-full py-2 rounded-lg ${
          !downloadReady ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
        } text-white font-semibold transition duration-200 flex items-center justify-center gap-2`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        {!downloadReady ? "Preparing PDF..." : "Download PDF Quotation"}
      </button>

      <button
        onClick={onNewQuotation}
        className="w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Create New Quotation
      </button>
    </div>
  </div>
);

// ========== Main Component ==========

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

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quotationSummary, setQuotationSummary] = useState<any | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const steps = [
    "Basic Info",
    "Gloss Paint",
    "Vinly matt Paint",
    "Artwork",
    "Summary",
  ];

  const nextStep = () => {
    if (currentStep === steps.length - 1) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setQuotationSummary(null);
    setDownloadReady(false);
    setEmailSent(false);
    const token = localStorage.getItem("token");
    console.log("bodyform sent", formData);
    try {
      const summary = await getQuotationSummary(formData);
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
      console.log("quotation", data);

      setQuotationSummary({ ...summary, _id: data.quotation._id });
      setDownloadReady(true);
      setCurrentStep(steps.length); // Move to results step
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
      window.open(url, "_blank");

      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${quotationSummary._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("PDF fetch error:", err);
    }
  };

  const handleNewQuotation = () => {
    setFormData({
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
    setQuotationSummary(null);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <StepProgress currentStep={currentStep} steps={steps} />

        {currentStep === 0 && (
          <BasicInfoStep formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 1 && (
          <PaintTypeStep
            title="Gloss Paint"
            formData={formData}
            setFormData={setFormData}
            paintType="oilPaint"
          />
        )}
        {currentStep === 2 && (
          <PaintTypeStep
            title="Vinly matt Paint"
            formData={formData}
            setFormData={setFormData}
            paintType="waterPaint"
          />
        )}
        {currentStep === 3 && (
          <ArtworkStep formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 4 && <SummaryStep formData={formData} />}
        {currentStep === steps.length && (
          <ResultStep
            quotationSummary={quotationSummary}
            onDownload={handlePreviewAndDownloadPDF}
            onEmail={handleSendEmail}
            onNewQuotation={handleNewQuotation}
            downloadReady={downloadReady}
            emailSent={emailSent}
            emailLoading={emailLoading}
          />
        )}

        {currentStep <= steps.length - 1 && (
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrev={prevStep}
            onNext={nextStep}
            isGenerating={loading}
          />
        )}
      </div>
    </div>
  );
}
