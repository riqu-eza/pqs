import React, { useEffect, useState } from "react";

type Color = {
    colorName: string;
    colorCode: string;
};

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ColorCodeSelect({ label, value, onChange }: Props) {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await fetch("/api/admin/colorcode");
        const data = await res.json();
        setColors(data);
      } catch (error) {
        console.error("Failed to load color codes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  return (
    <label className="block">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
