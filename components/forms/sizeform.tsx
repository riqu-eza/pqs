// components/forms/SizeForm.tsx
'use client';
import { useState } from 'react';

export default function SizeForm() {
  const [sizes, setSizes] = useState([{ type: '', area: '' }]);

  const handleChange = (index: number, field: string, value: string) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const addSize = () => {
    setSizes([...sizes, { type: '', area: '' }]);
  };

  const removeSize = (index: number) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const submit = async () => {
    for (const size of sizes) {
      await fetch('/api/admin/size', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(size),
      });
    }
    alert('Saved!');
  };

  return (
    <div className="bg-white text-black p-6 rounded-2xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add Sizes</h2>
      {sizes.map((size, index) => (
        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md bg-gray-50">
          <div className="flex flex-col gap-2">
            <input
              className="p-2 border border-gray-300 rounded text-black"
              placeholder="Type (e.g., Wall, Ceiling)"
              value={size.type}
              onChange={(e) => handleChange(index, 'type', e.target.value)}
            />
            <input
              type="number"
              className="p-2 border border-gray-300 rounded text-black"
              placeholder="Area (m²)"
              value={size.area}
              onChange={(e) => handleChange(index, 'area', e.target.value)}
            />
            <button
              onClick={() => removeSize(index)}
              className="text-sm text-red-600 underline self-start"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center mt-6">
        <button onClick={addSize} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Add Another
        </button>
        <button onClick={submit} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900">
          Save All
        </button>
      </div>
    </div>
  );
}
