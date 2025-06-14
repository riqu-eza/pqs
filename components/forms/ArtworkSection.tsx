import React from "react";
import { ArtworkInput, ArtworkColor } from "../../Types/quotation";
import ColorCodeSelect from "./ColorCodeSelect";

type Props = {
  data: ArtworkInput;
  onChange: (data: ArtworkInput) => void;
};

export default function ArtworkSection({ data, onChange }: Props) {
  // Ensure colors array exists and is properly initialized
  const colors = data.colors || [];

  const updateColor = (index: number, updates: Partial<ArtworkColor>) => {
    const updatedColors = [...colors];
    updatedColors[index] = {
      ...updatedColors[index],
      ...updates,
      litres:
        updates.litres !== undefined
          ? String(updates.litres) === "" ? 0 : Number(updates.litres)
          : updatedColors[index].litres,
    };
    onChange({ ...data, colors: updatedColors });
  };

  const addColor = () => {
    onChange({
      ...data,
      colors: [...colors, { colorCode: "", colorName: "", litres: 0 }],
    });
  };

  const removeColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    onChange({ ...data, colors: updatedColors });
  };

  const [isFocusedIndex, setIsFocusedIndex] = React.useState<number | null>(null);

  return (
    <div className="border p-3 sm:p-4 rounded shadow space-y-3">
      <h3 className="text-lg font-semibold">Artwork Details</h3>

      {/* Artwork Name */}
      <div className="space-y-1">
        <label className="block text-sm sm:text-base">Artwork Name:</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Enter artwork name"
          className="border p-2 rounded w-full text-sm sm:text-base"
        />
      </div>

      {/* Color Sections */}
      <div className="mt-3 sm:mt-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h4 className="font-medium text-sm sm:text-base">Colors</h4>
          <button
            onClick={addColor}
            className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 px-2 sm:px-3 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            Add Color
          </button>
        </div>

        <div className="space-y-2 sm:space-y-0 sm:overflow-x-auto">
          <div className="sm:min-w-[500px]">
            {colors.map((color, idx) => (
              <div 
                key={`${idx}-${color.colorCode}`}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center py-2 sm:py-3 border-b sm:border-b-0"
              >
                <div className="w-full sm:w-[60%]">
                  <ColorCodeSelect
                    label=""
                    value={color.colorCode}
                    onChange={(code, name) => {
                      updateColor(idx, {
                        colorCode: String(code),
                        colorName: name,
                      });
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-[35%]">
                  <div className="relative flex-1 sm:max-w-[120px]">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={
                        color.litres === 0 && isFocusedIndex === idx ? "" : color.litres
                      }
                      onFocus={() => {
                        setIsFocusedIndex(idx);
                        if (color.litres === 0) {
                          updateColor(idx, { litres: 0 });
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          updateColor(idx, { litres: 0 });
                        }
                        setIsFocusedIndex(null);
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateColor(idx, { litres: val === "" ? 0 : Number(val) });
                      }}
                      placeholder="Litres"
                      min="0"
                      step="0.1"
                      className="w-full border border-gray-300 rounded-md py-1.5 sm:py-2 pl-2 sm:pl-3 pr-6 sm:pr-8 text-sm sm:text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    />
                    <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400">L</span>
                  </div>
                  <button
                    onClick={() => removeColor(idx)}
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