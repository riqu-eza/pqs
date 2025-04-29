'use client';
import { useState } from 'react';

export default function ArtForm() {
  const [entries, setEntries] = useState([{ name: '', colorCode: '' }]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addEntry = () => setEntries([...entries, { name: '', colorCode: '' }]);
  const removeEntry = (index: number) => setEntries(entries.filter((_, i) => i !== index));

  const submit = async () => {
    for (const entry of entries) {
      await fetch('/api/admin/artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    }
    alert('Saved!');
  };

  return (
    <div className="bg-white text-black p-6 rounded-2xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add Art</h2>
      {entries.map((entry, index) => (
        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md bg-gray-50">
          <input
            placeholder="Art Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            value={entry.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
          />
          <input
            type="number"
            placeholder="Color Code"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={entry.colorCode}
            onChange={(e) => handleChange(index, 'colorCode', e.target.value)}
          />
          <button onClick={() => removeEntry(index)} className="text-sm text-red-600 underline mt-2">
            Remove
          </button>
        </div>
      ))}
      <div className="flex justify-between mt-6">
        <button onClick={addEntry} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Add Another
        </button>
        <button onClick={submit} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900">
          Save All
        </button>
      </div>
    </div>
  );
}
