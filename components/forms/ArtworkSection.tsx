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
      litres: updates.litres !== undefined ? Number(updates.litres) : updatedColors[index].litres,
    };
    onChange({ ...data, colors: updatedColors });
  };

  const addColor = () => {
    onChange({
      ...data,
      colors: [...colors, { colorCode: "", colorName: "", litres: 0 }]
    });
  };

  const removeColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    onChange({ ...data, colors: updatedColors });
  };

  return (
    <div className="border p-4 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold">Artwork Details</h3>

      {/* Artwork Name */}
      <label className="block">
        <span className="block mb-1">Artwork Name:</span>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </label>

      {/* Color Sections */}
      <div>
        <h4 className="font-medium mt-2">Colors</h4>
        {colors.map((color, idx) => (
          <div key={`${idx}-${color.colorCode}`} className="flex items-center gap-2 mb-2">
            <div className="w-1/2">
              <ColorCodeSelect
                label=""
                value={color.colorCode}
                onChange={(code, name) => {
                  updateColor(idx, {
                    colorCode: code,
                    colorName: name
                  });
                }}
              />
            </div>
            <input
              type="number"
              placeholder="Litres"
              value={color.litres}
              onChange={(e) => updateColor(idx, { litres: e.target.value })}
              className="border p-2 rounded w-1/4"
              min="0"
              step="0.01"
            />
            <button
              type="button"
              onClick={() => removeColor(idx)}
              className="text-red-600 text-sm"
              aria-label="Remove color"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          type="button"
          onClick={addColor} 
          className="text-blue-600 text-sm mt-1"
        >
          + Add Color
        </button>
      </div>
    </div>
  );
}