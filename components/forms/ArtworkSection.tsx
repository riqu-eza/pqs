import React from "react";
import { ArtworkInput } from "../../Types/quotation";

type Props = {
  data: ArtworkInput;
  onChange: (data: ArtworkInput) => void;
};

export default function ArtworkSection({ data, onChange }: Props) {
  return (
    <div className="border p-4 rounded shadow space-y-2">
      <h3 className="text-lg font-semibold">Artwork Details</h3>

      <label className="block">
        Artwork Name:
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="border p-1 rounded ml-2"
        />
      </label>

      <label className="block">
        Litres of Paint:
        <input
          type="number"
          value={data.litres}
          onChange={(e) => onChange({ ...data, litres: Number(e.target.value) })}
          className="border p-1 rounded ml-2"
        />
      </label>
    </div>
  );
}
