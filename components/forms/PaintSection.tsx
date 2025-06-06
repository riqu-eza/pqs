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
}: // allowDouble = false,
Props) {
  const isOilPaint = title.toLowerCase().includes("gloss");
  const undercoatColor = isOilPaint
    ? UNDERCOAT_COLORS.oil
    : UNDERCOAT_COLORS.water;
  React.useEffect(() => {
    onChange({
      ...data,
      undercoatColors: [undercoatColor],
    });
  }, [isOilPaint, data.area]);

  const updateColorList = (
    key: "undercoatColors" | "topcoatColors",
    index: number,
    field: "code" | "name" | "percentage",
    value: string | number
  ) => {
    console.log("Updating:", key, index, field, value);

    const newColors = [...data[key]];
    newColors[index] = {
      ...newColors[index],
      [field]: field === "percentage" ? Number(value) : value,
    };
    onChange({ ...data, [key]: newColors });
  };

  const addColor = (key: "undercoatColors" | "topcoatColors") => {
    const newColors = [...data[key], { code: "", name: "", percentage: 0 }];
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

  const [areaInput, setAreaInput] = React.useState<string>(
    data.area === 0 ? "" : String(data.area)
  );

  React.useEffect(() => {
    setAreaInput(data.area === 0 ? "" : String(data.area));
  }, [data.area]);

  return (
    <div className="border p-4 rounded shadow space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>

      <label>Area (m²):</label>
      <input
        type="number"
        inputMode="numeric"
        value={areaInput}
        onFocus={() => {
          if (data.area === 0) {
            setAreaInput("");
          }
        }}
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
        className="border p-1 rounded w-full"
      />

      {/* Topcoat Colors */}
      <div>
        <h4 className="font-medium mt-2">Topcoat Colors</h4>
        {data.topcoatColors?.map((color, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-1">
            <ColorCodeSelect
              label=""
              value={color.code}
              onChange={(code, name) => {
                const newColors = [...data.topcoatColors];
                newColors[idx] = {
                  ...newColors[idx],
                  code: String(code),
                  name,
                };
                onChange({ ...data, topcoatColors: newColors });
              }}
            />

            <input
              type="number"
              inputMode="numeric"
              placeholder="%"
              value={color.percentage === 0 ? "" : color.percentage}
              onFocus={() => {
                if (color.percentage === 0) {
                  updateColorList("topcoatColors", idx, "percentage", "");
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  updateColorList("topcoatColors", idx, "percentage", 0); // or null if preferred
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                updateColorList(
                  "topcoatColors",
                  idx,
                  "percentage",
                  value === "" ? "" : Number(value)
                );
              }}
              min="0"
              max="100"
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
