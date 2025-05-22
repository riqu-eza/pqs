'use client';
import { useState } from 'react';

interface ArtEntry {
  name: string;
  colorCode: string[];
}

export default function ArtForm() {
  const [entries, setEntries] = useState<ArtEntry[]>([{ name: '', colorCode: [''] }]);

  const handleChange = (
    entryIndex: number,
    field: 'name' | 'colorCode',
    value: string,
    colorIndex?: number
  ) => {
    const updated = [...entries];

    if (field === 'name') {
      updated[entryIndex].name = value;
    } else if (field === 'colorCode' && typeof colorIndex === 'number') {
      updated[entryIndex].colorCode[colorIndex] = value;
    }

    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([...entries, { name: '', colorCode: [''] }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const addColorCode = (entryIndex: number) => {
    const updated = [...entries];
    updated[entryIndex].colorCode.push('');
    setEntries(updated);
  };

  const removeColorCode = (entryIndex: number, colorIndex: number) => {
    const updated = [...entries];
    if (updated[entryIndex].colorCode.length > 1) {
      updated[entryIndex].colorCode.splice(colorIndex, 1);
      setEntries(updated);
    }
  };

  const submit = async () => {
    for (const entry of entries) {
      console.log('Saving entry:', entry); // Log before sending

      const response = await fetch('/api/admin/artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });

      const result = await response.json();
      console.log('Saved entry response:', result); // Log saved result
    }

    alert('Saved!');
  };

  return (
    <div className="bg-white text-black p-6 rounded-2xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add Art</h2>
      {entries.map((entry, index) => (
        <div key={index} className="mb-6 border border-gray-200 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Entry {index + 1}
          </h3>
          <input
            type="text"
            placeholder="Art Name"
            className="w-full p-2 mb-3 border border-gray-300 rounded text-black"
            value={entry.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
          />
          {entry.colorCode.map((code, colorIndex) => (
            <div key={colorIndex} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder={`Color Code ${colorIndex + 1}`}
                className="w-full p-2 border border-gray-300 rounded text-black"
                value={code}
                onChange={(e) =>
                  handleChange(index, 'colorCode', e.target.value, colorIndex)
                }
              />
              {entry.colorCode.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColorCode(index, colorIndex)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addColorCode(index)}
            className="text-sm text-blue-600 underline mb-2"
          >
            Add Color Code
          </button>
        </div>
      ))}

      <div className="flex justify-between flex-wrap gap-4 mt-6">
        <button
          type="button"
          onClick={addEntry}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Add Another
        </button>
        <button
          type="button"
          onClick={() => removeEntry(entries.length - 1)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Remove Last Entry
        </button>
        <button
          type="button"
          onClick={submit}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Save All
        </button>
      </div>
    </div>
  );
}
