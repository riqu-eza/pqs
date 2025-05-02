import React from "react";
import { PaintSectionInput } from "../../Types/quotation";
import ColorCodeSelect from "./ColorCodeSelect";

type Props = {
  title: string;
  data: PaintSectionInput;
  onChange: (data: PaintSectionInput) => void;
  allowDouble?: boolean;
};

export default function PaintSection({
  title,
  data,
  onChange,
  // allowDouble = false,
}: Props) {
  const updateColorList = (
    key: "undercoatColors" | "topcoatColors",
    index: number,
    field: "code" | "percentage",
    value: string | number
  ) => {
    const newColors = [...data[key]];
    newColors[index] = {
      ...newColors[index],
      [field]: field === "percentage" ? Number(value) : value,
    };
    onChange({ ...data, [key]: newColors });
  };

  const addColor = (key: "undercoatColors" | "topcoatColors") => {
    const newColors = [...data[key], { code: "", percentage: 0 }];
    onChange({ ...data, [key]: newColors });
  };

  const removeColor = (
    key: "undercoatColors" | "topcoatColors",
    index: number
  ) => {
    const newColors = [...data[key]];
    newColors.splice(index, 1);
    onChange({ ...data, [key]: newColors });
  };

  return (
    <div className="border p-4 rounded shadow space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>

      <label>Area (m²):</label>
      <input
        type="number"
        value={data.area}
        onChange={(e) => onChange({ ...data, area: Number(e.target.value) })}
        className="border p-1 rounded w-full"
      />

      {/* {allowDouble && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.doubleArea || false}
            onChange={(e) =>
              onChange({ ...data, doubleArea: e.target.checked })
            }
          />
          <span>Double area for oil</span>
        </label>
      )} */}

      {/* Undercoat Colors */}
      <div>
        <h4 className="font-medium">Undercoat Colors</h4>
        {data.undercoatColors?.map((color, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-1">
            <ColorCodeSelect
              label=""
              value={color.code}
              onChange={(value) =>
                updateColorList("undercoatColors", idx, "code", value)
              }
            />
            <input
              type="number"
              placeholder="%"
              value={color.percentage}
              onChange={(e) =>
                updateColorList(
                  "undercoatColors",
                  idx,
                  "percentage",
                  e.target.value
                )
              }
              className="border p-1 rounded w-20"
            />
            <button
              onClick={() => removeColor("undercoatColors", idx)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => addColor("undercoatColors")}
          className="text-blue-600 text-sm mt-1"
        >
          + Add Undercoat Color
        </button>
      </div>

      {/* Topcoat Colors */}
      <div>
        <h4 className="font-medium mt-2">Topcoat Colors</h4>
        {data.topcoatColors?.map((color, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-1">
            <ColorCodeSelect
              label=""
              value={color.code}
              onChange={(value) =>
                updateColorList("topcoatColors", idx, "code", value)
              }
            />
            <input
              type="number"
              placeholder="%"
              value={color.percentage}
              onChange={(e) =>
                updateColorList(
                  "topcoatColors",
                  idx,
                  "percentage",
                  e.target.value
                )
              }
              className="border p-1 rounded w-20"
            />
            <button
              onClick={() => removeColor("topcoatColors", idx)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => addColor("topcoatColors")}
          className="text-blue-600 text-sm mt-1"
        >
          + Add Topcoat Color
        </button>
      </div>
    </div>
  );
}
