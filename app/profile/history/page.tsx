"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiChevronDown, FiChevronUp, FiX, FiDownload, FiMail } from "react-icons/fi";

// ... (keep the same Quotation type definition as before)

export default function QuotationHistory() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedQuotations, setExpandedQuotations] = useState<Record<string, boolean>>({});
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [emailSent, setEmailSent] = useState<Record<string, boolean>>({});
const [emailLoading, setEmailLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/quotation/create", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setQuotations(data.quotations || []);
          console.log(`history`, data);
        }
      } catch (error) {
        console.error("Error fetching quotations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);
  const handleSendEmail = async (quotation_id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setEmailLoading(prev => ({ ...prev, [quotation_id]: true }));
    console.log(`sent`, quotation_id);


    try {
      const res = await fetch("/api/quotation/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quotationId: quotation_id }),
      });
      

      if (res.ok) {
        setEmailSent(prev => ({ ...prev, [quotation_id]: true }));
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setEmailSent(prev => ({ ...prev, [quotation_id]: false }));
        }, 3000);
      } else {
        throw new Error("Email failed");
      }
    } catch (err) {
      console.error("Email sending error:", err);
    } finally {
      setEmailLoading(prev => ({ ...prev, [quotation_id]: false }));
    }
  };

  const handleDownloadPDF = async (quotation_id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // First request to generate PDF
      const generateRes = await fetch(`/api/quotation/generate-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quotationId: quotation_id }),
      });
      if (!generateRes.ok) throw new Error("Failed to generate PDF");

      // Then download the PDF
      const downloadRes = await fetch(`/api/quotation/download-pdf?id=${quotation_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!downloadRes.ok) throw new Error("Failed to download PDF");

      const blob = await downloadRes.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${quotation_id}.pdf`;
;
      document.body.appendChild(a);
      a.click();
      
    
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const toggleQuotationExpand = (id: string) => {
    setExpandedQuotations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuotations = quotations.filter((quotation) =>
    quotation.formData.quotationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPackaging = (packaging?: Record<string, number>) => {
    if (!packaging) return "N/A";
    return Object.entries(packaging)
      .map(([size, qty]) => `${qty} x ${size}L`)
      .join(", ");
  };

  const renderColorBreakdown = (breakdown: Array<{
    colorCode: string;
    colorName: string;
    litres: number;
    packaging: Record<string, number>;
  }>) => {
    return (
      <ul className="ml-4 space-y-1">
        {breakdown.map((color, index) => (
          <li key={index} className="text-sm">
            <span className="font-medium">{color.colorName || color.colorCode}</span>: {color.litres}L
            <span className="text-gray-500 ml-2">({renderPackaging(color.packaging)})</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderQuotationDetail = (quotation: Quotation) => {
    const { summary, formData } = quotation;
    
    return (
      <div className="p-4 bg-gray-50 rounded-lg mt-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Project Summary</h3>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Total Area:</span> {summary?.totalArea ?? "N/A"} m²</div>
            </div>
          </div>
          
          {summary?.oil && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Oil Paint</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Area:</span> {summary.oil.area} m²</div>
                <div><span className="font-medium">Double Area:</span> {formData.oilPaint?.doubleArea ? "Yes" : "No"}</div>
                
                <div>
                  <div className="font-medium">Undercoat: {summary.oil.undercoatLitres}L</div>
                  {renderColorBreakdown(summary.oil.undercoatBreakdown)}
                </div>
                
                <div>
                  <div className="font-medium">Topcoat: {summary.oil.topcoatLitres}L</div>
                  {renderColorBreakdown(summary.oil.topcoatBreakdown)}
                </div>
                
                <div>
                  <div className="font-medium">Thinner: {summary.oil.thinner.litres}L</div>
                  <div>{renderPackaging(summary.oil.thinner.packaging)}</div>
                </div>
              </div>
            </div>
          )}
          
          {summary?.water && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Water Paint</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Area:</span> {summary.water.area} m²</div>
                
                <div>
                  <div className="font-medium">Undercoat: {summary.water.undercoatLitres}L</div>
                  {renderColorBreakdown(summary.water.undercoatBreakdown)}
                </div>
                
                <div>
                  <div className="font-medium">Topcoat: {summary.water.topcoatLitres}L</div>
                  {renderColorBreakdown(summary.water.topcoatBreakdown)}
                </div>
              </div>
            </div>
          )}
        </div>

        {summary?.artworks?.length ? (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Artwork</h3>
            <div className="space-y-2">
              {summary.artworks.map((art, index) => (
                <div key={art.id || index} className="bg-white p-3 rounded border">
                  <div className="font-medium">{art.name}</div>
                  <div className="mt-1 text-sm">Colors:</div>
                  <div className="ml-2 space-y-1">
                    {art.colors.map((color, colorIndex) => (
                      <div key={colorIndex} className="flex justify-between">
                        <span>{color.colorCode}</span>
                        <span>{color.litres}L ({renderPackaging(color.packaging)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (quotations.length === 0) return (
    <div className="text-center py-10">
      <p className="text-gray-500">No quotations found.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Search Section */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by project name..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Quotation List */}
      <div className="space-y-3">
        {filteredQuotations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No matching quotations found.</p>
          </div>
        ) : (
          filteredQuotations.map((quotation) => (
            <div key={quotation._id} className="border rounded-lg overflow-hidden bg-white">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{quotation.formData.quotationName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(quotation.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleQuotationExpand(quotation._id)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {expandedQuotations[quotation._id] ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  <button
                    onClick={() => setSelectedQuotation(quotation)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm flex items-center"
                  >
                    View
                  </button>
                </div>
              </div>
              
              {expandedQuotations[quotation._id] && (
                <div className="border-t px-4 py-3">
                  {renderQuotationDetail(quotation)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quotation Detail Modal */}
      {selectedQuotation && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
       <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
         <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
           <h2 className="text-xl font-semibold">{selectedQuotation.formData.quotationName}</h2>
           <button
             onClick={() => setSelectedQuotation(null)}
             className="p-1 rounded-full hover:bg-gray-100"
           >
             <FiX className="text-gray-500" size={20} />
           </button>
         </div>
         <div className="p-6">
           {renderQuotationDetail(selectedQuotation)}
         </div>
         <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end space-x-3">
           <button
             onClick={() => handleDownloadPDF(selectedQuotation._id)}
             disabled={emailLoading[selectedQuotation._id]}
             className={`px-4 py-2 bg-blue-600 text-white rounded flex items-center ${
               emailLoading[selectedQuotation._id] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
             }`}
           >
             {emailLoading[selectedQuotation._id] ? (
               'Generating...'
             ) : (
               <>
                 <FiDownload className="mr-2" /> Download PDF
               </>
             )}
           </button>
           <button
             onClick={() => handleSendEmail(selectedQuotation._id)}
             disabled={emailLoading[selectedQuotation._id] || emailSent[selectedQuotation._id]}
             className={`px-4 py-2 ${
               emailSent[selectedQuotation._id] 
                 ? 'bg-green-500 text-white'
                 : emailLoading[selectedQuotation._id]
                   ? 'bg-gray-300 text-gray-600'
                   : 'bg-green-600 text-white hover:bg-green-700'
             } rounded flex items-center`}
           >
             {emailLoading[selectedQuotation._id] ? (
               'Sending...'
             ) : emailSent[selectedQuotation._id] ? (
               'Sent!'
             ) : (
               <>
                 <FiMail className="mr-2" /> Send Email
               </>
             )}
           </button>
         </div>
         {emailSent[selectedQuotation._id] && (
           <div className="bg-green-100 text-green-800 p-2 text-center text-sm">
             Email sent successfully!
           </div>
         )}
       </div>
     </div>
      )}
    </div>
  );
}

