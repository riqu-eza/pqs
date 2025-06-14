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
        setColors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load color codes", error);
        setColors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchColors();
  }, []);

  return (
    <div className="w-full">
      <label className="block space-y-1">
        <span className="sr-only">{label}</span>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => {
              const selectedColor = colors.find(c => String(c.colorCode) === e.target.value);
              onChange(e.target.value, selectedColor?.colorName || "");
            }}
            className={`
              block w-full p-2 pr-8 text-sm sm:text-base rounded-md border border-gray-300 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
              transition-all outline-none appearance-none
              ${loading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            `}
            disabled={loading}
          >
            <option value="">{loading ? "Loading..." : "Select color"}</option>
            {colors.map((c) => (
              <option key={c.colorCode} value={c.colorCode}>
                {c.colorName} ({c.colorCode})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </label>
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}