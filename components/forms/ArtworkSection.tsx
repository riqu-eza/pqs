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
          ? Number(updates.litres)
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

  const [isFocusedIndex, setIsFocusedIndex] = React.useState<number | null>(
    null
  );
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
          <div
            key={`${idx}-${color.colorCode}`}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-1/2">
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
            <input
              type="number"
              inputMode="numeric"
              value={
                color.litres === 0 && isFocusedIndex === idx ? "" : color.litres
              }
              onFocus={() => {
                setIsFocusedIndex(idx); // You'll need a state like `const [isFocusedIndex, setIsFocusedIndex] = useState(null);`
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
              className="border p-2 rounded w-1/4"
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
