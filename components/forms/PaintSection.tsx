import React from "react";
import { PaintSectionInput } from "../../Types/quotation";
import ColorCodeSelect from "./ColorCodeSelect";

type Props = {
  title: string;
  data: PaintSectionInput;
  onChange: (data: PaintSectionInput) => void;
  allowDouble?: boolean;
};

export default function PaintSection({ title, data, onChange, allowDouble = false }: Props) {
  return (
    <div className="border p-4 rounded shadow space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>

      <label className="block">
        Area (m²):
        <input
          type="number"
          value={data.area}
          onChange={(e) => onChange({ ...data, area: Number(e.target.value) })}
          className="border p-1 rounded ml-2"
        />
      </label>

      {allowDouble && (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.doubleArea || false}
            onChange={(e) => onChange({ ...data, doubleArea: e.target.checked })}
          />
          <span>Double area for oil</span>
        </label>
      )}

      <ColorCodeSelect
        label="Undercoat Color Code:"
        value={data.undercoatColor}
        onChange={(value) => onChange({ ...data, undercoatColor: value })}
      />

      <ColorCodeSelect
        label="Topcoat Color Code:"
        value={data.topcoatColor}
        onChange={(value) => onChange({ ...data, topcoatColor: value })}
      />
    </div>
  );
}
