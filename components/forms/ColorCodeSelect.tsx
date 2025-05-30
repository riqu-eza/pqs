import React, { useEffect, useState } from "react";

type Color = {
    colorName: string;
    colorCode: string;
};

type Props = {
  label: string;
  value: string | number;
  onChange: (code: string | number, name: string) => void;
};

export default function ColorCodeSelect({ label, value, onChange }: Props) {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await fetch("/api/admin/colorcode");
        const data = await res.json();

        if (Array.isArray(data)) {
          setColors(data);
        } else {
          console.error("Expected array of color codes:", data);
          setColors([]);
        }
      } catch (error) {
        console.error("Failed to load color codes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);
console.log("Dropdown received value:", value);

  return (
    <label className="block">
      {label}
      <select
        value={value}
        onChange={(e) => {
          const selectedColor = colors.find(c => String(c.colorCode) === e.target.value);
onChange(e.target.value, selectedColor?.colorName || "");
console.log("Selected:", e.target.value, selectedColor?.colorName);
        }}
        className="border p-1 rounded ml-2"
        disabled={loading}
      >
        <option value="">{loading ? "Loading..." : "Select"}</option>
        {colors.map((c) => (
          <option key={c.colorCode} value={c.colorCode}>
            {c.colorName} ({c.colorCode})
          </option>
        ))}
      </select>
    </label>
  );
}

