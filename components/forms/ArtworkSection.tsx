import React from "react";
import { ArtworkInput } from "../../Types/quotation";

type Props = {
  data: ArtworkInput;
  onChange: (data: ArtworkInput) => void;
};

export default function ArtworkSection({ data, onChange }: Props) {
  return (
    <div className="border p-4 rounded shadow space-y-4">
    <h3 className="text-lg font-semibold">Artwork Details</h3>
  
    <div className="space-y-2">
      <label className="block">
        <span className="block mb-1">Artwork Name:</span>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </label>
  
      {/* <label className="block">
        <span className="block mb-1">Litres of Paint:</span>
        <input
          type="number"
          value={data.litres}
          onChange={(e) => onChange({ ...data, litres: Number(e.target.value) })}
          className="w-full border p-2 rounded"
        />
      </label> */}
    </div>
  </div>
  
  );
}
