/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { PaintSectionInput } from "../../Types/quotation";
import ColorCodeSelect from "./ColorCodeSelect";

type Props = {
  title: string;
  data: PaintSectionInput;
  onChange: (data: PaintSectionInput) => void;
  allowDouble?: boolean;
};

const UNDERCOAT_COLORS = {
  oil: {
    code: "Universal",
    name: "Universal",
    percentage: 100,
  },
  water: {
    code: "Superfast",
    name: "Superfast",
    percentage: 100,
  },
};

export default function PaintSection({
  title,
  data,
  onChange,
}: Props) {
  const isOilPaint = React.useMemo(() => title.toLowerCase().includes("gloss"), [title]);
  const undercoatColor = isOilPaint ? UNDERCOAT_COLORS.oil : UNDERCOAT_COLORS.water;

  // Initialize undercoatColors if not present
  React.useEffect(() => {
    if (!data.undercoatColors || data.undercoatColors.length === 0) {
      onChange({
        ...data,
        undercoatColors: [undercoatColor],
      });
    }
  }, [isOilPaint]); // Only depend on isOilPaint

  const updateColorList = (
    key: "undercoatColors" | "topcoatColors",
    index: number,
    field: "code" | "name" | "percentage",
    value: string | number
  ) => {
    const newColors = [...(data[key] || [])];
    newColors[index] = {
      ...newColors[index],
      [field]: field === "percentage" ? Number(value) : value,
    };
    onChange({ ...data, [key]: newColors });
  };

  const addColor = (key: "undercoatColors" | "topcoatColors") => {
    const newColors = [...(data[key] || []), { code: "", name: "", percentage: 0 }];
    onChange({ ...data, [key]: newColors });
  };

  const removeColor = (key: "undercoatColors" | "topcoatColors", index: number) => {
    const newColors = [...(data[key] || [])];
    newColors.splice(index, 1);
    onChange({ ...data, [key]: newColors });
  };

  const [areaInput, setAreaInput] = React.useState<string>(
    data.area === 0 ? "" : String(data.area)
  );

  React.useEffect(() => {
    setAreaInput(data.area === 0 ? "" : String(data.area));
  }, [data.area]);

  return (
    <div className="border p-3 sm:p-4 rounded shadow space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>

      <div className="space-y-1">
        <label className="block text-sm sm:text-base">Area (m²):</label>
        <input
          type="number"
          inputMode="numeric"
          value={areaInput}
          onFocus={() => data.area === 0 && setAreaInput("")}
          onBlur={(e) => {
            if (e.target.value === "") {
              setAreaInput("");
              onChange({ ...data, area: 0 });
            }
          }}
          onChange={(e) => {
            const val = e.target.value;
            setAreaInput(val);
            onChange({ ...data, area: val === "" ? 0 : Number(val) });
          }}
          placeholder="Enter area"
          className="border p-2 rounded w-full text-sm sm:text-base"
        />
      </div>

      {/* Undercoat Colors */}
      {/* <div className="mt-3 sm:mt-4">
        <h4 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">Undercoat Colors</h4>
        <div className="space-y-2 sm:space-y-0 sm:overflow-x-auto">
          <div className="sm:min-w-[500px]">
            {(data.undercoatColors || []).map((color, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center py-2 sm:py-3 border-b sm:border-b-0">
                <div className="w-full sm:w-[60%]">
                  <ColorCodeSelect
                    value={color.code}
                    onChange={(code, name) => {
                      const newColors = [...(data.undercoatColors || [])];
                      newColors[idx] = { ...newColors[idx], code: String(code), name };
                      onChange({ ...data, undercoatColors: newColors });
                    }}
                    label=""
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-[35%]">
                  <div className="relative flex-1 sm:max-w-[120px]">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={color.percentage === 0 ? "" : color.percentage}
                      onFocus={() => color.percentage === 0 && updateColorList("undercoatColors", idx, "percentage", "")}
                      onBlur={(e) => e.target.value === "" && updateColorList("undercoatColors", idx, "percentage", 0)}
                      onChange={(e) => updateColorList(
                        "undercoatColors",
                        idx,
                        "percentage",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )}
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-md py-1.5 sm:py-2 pl-2 sm:pl-3 pr-6 sm:pr-8 text-sm sm:text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Topcoat Colors */}
      <div className="mt-3 sm:mt-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h4 className="font-medium text-sm sm:text-base">Topcoat Colors</h4>
          <button
            onClick={() => addColor("topcoatColors")}
            className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 px-2 sm:px-3 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            Add Color
          </button>
        </div>

        <div className="space-y-2 sm:space-y-0 sm:overflow-x-auto">
          <div className="sm:min-w-[500px]">
            {(data.topcoatColors || []).map((color, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center py-2 sm:py-3 border-b sm:border-b-0">
                <div className="w-full sm:w-[60%]">
                  <ColorCodeSelect
                    value={color.code}
                    onChange={(code, name) => {
                      const newColors = [...(data.topcoatColors || [])];
                      newColors[idx] = { ...newColors[idx], code: String(code), name };
                      onChange({ ...data, topcoatColors: newColors });
                    }}
                    label=""
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-[35%]">
                  <div className="relative flex-1 sm:max-w-[120px]">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={color.percentage === 0 ? "" : color.percentage}
                      onFocus={() => color.percentage === 0 && updateColorList("topcoatColors", idx, "percentage", "")}
                      onBlur={(e) => e.target.value === "" && updateColorList("topcoatColors", idx, "percentage", 0)}
                      onChange={(e) => updateColorList(
                        "topcoatColors",
                        idx,
                        "percentage",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )}
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-md py-1.5 sm:py-2 pl-2 sm:pl-3 pr-6 sm:pr-8 text-sm sm:text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  <button
                    onClick={() => removeColor("topcoatColors", idx)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Remove color"
                  >
                    <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

{/* // ... (PlusIcon and TrashIcon components remain the same) */}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}