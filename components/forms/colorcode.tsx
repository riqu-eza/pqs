'use client';
import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiSave, FiX, FiPlus, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface ColorCode {
  id: string;
  colorName: string;
  colorCode: string;
}

export default function ColourCodeForm() {
  const [entries, setEntries] = useState<ColorCode[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newColor, setNewColor] = useState<Omit<ColorCode, 'id'> & { id?: string }>({ 
    colorName: '', 
    colorCode: '' 
  });
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof ColorCode; 
    direction: 'ascending' | 'descending' 
  } | null>(null);

  useEffect(() => {
    fetchColorCodes();
  }, []);

  const fetchColorCodes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/colorcode');
      
      if (!response.ok) {
        throw new Error('Failed to fetch color codes');
      }
      
      const data = await response.json();
      console.log('Fetched color codes:', data);
      setEntries(data.map((item: { _id: string; colorName: string; colorCode: string }) => ({
        id: item._id.toString(),
        colorName: item.colorName,
        colorCode: item.colorCode
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: keyof ColorCode) => {
    const direction = sortConfig?.key === key && sortConfig.direction === 'ascending' 
      ? 'descending' 
      : 'ascending';
    setSortConfig({ key, direction });
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key;
    if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const handleInputChange = (field: keyof ColorCode, value: string, id?: string) => {
    if (id) {
      setEntries(entries.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ));
    } else {
      setNewColor({ ...newColor, [field]: value });
    }
  };

  const resetForm = () => {
    setNewColor({ colorName: '', colorCode: '' });
    setError(null);
    setSuccess(null);
  };

  const saveColor = async (colorData: Omit<ColorCode, 'id'> | ColorCode) => {
  try {
    // Validate color code format
   

    setIsLoading(true);
    const isUpdate = 'id' in colorData;
    const method = isUpdate ? 'PUT' : 'POST';
    const url = '/api/admin/colorcode';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...colorData,
        colorName: colorData.colorName.trim(),
        colorCode: colorData.colorCode.trim()
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `Failed to ${isUpdate ? 'update' : 'create'} color`);
    }
    
    setSuccess(`Color ${isUpdate ? 'updated' : 'created'} successfully`);
    fetchColorCodes();
    if (!isUpdate) {
      setIsAdding(false);
      resetForm();
    } else {
      setIsEditing(null);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setIsLoading(false);
  }
};
  const deleteColor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this color?')) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/colorcode', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) throw new Error('Failed to delete color');
      
      setSuccess('Color deleted successfully');
      fetchColorCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete color');
    } finally {
      setIsLoading(false);
    }
  };

  const getColorPreviewStyle = (colorCode: string) => ({
    backgroundColor: colorCode,
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    display: 'inline-block',
    marginLeft: '8px',
    border: '1px solid #e2e8f0'
  });

  const SortIcon = ({ column }: { column: keyof ColorCode }) => {
    if (!sortConfig || sortConfig.key !== column) return <FiChevronDown className="opacity-30" />;
    return sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Color Code Manager</h2>
      
      {/* Status messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-200">
          {success}
        </div>
      )}
      
      {isLoading && entries.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Color table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('colorName')}
                  >
                    <div className="flex items-center">
                      Color Name
                      <span className="ml-1">
                        <SortIcon column="colorName" />
                      </span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('colorCode')}
                  >
                    <div className="flex items-center">
                      Color Code
                      <span className="ml-1">
                        <SortIcon column="colorCode" />
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === entry.id ? (
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={entry.colorName}
                          onChange={(e) => handleInputChange('colorName', e.target.value, entry.id)}
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{entry.colorName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {isEditing === entry.id ? (
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={entry.colorCode}
                            onChange={(e) => handleInputChange('colorCode', e.target.value, entry.id)}
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-900">{entry.colorCode}</span>
                        )}
                        <span 
                          style={getColorPreviewStyle(entry.colorCode)} 
                          title="Color preview"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing === entry.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => saveColor(entry)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                            disabled={isLoading}
                          >
                            <FiCheck className="mr-1" /> Save
                          </button>
                          <button
                            onClick={() => setIsEditing(null)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                          >
                            <FiX className="mr-1" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setIsEditing(entry.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <FiEdit2 className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => deleteColor(entry.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            disabled={isLoading}
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add new color form */}
          {isAdding ? (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <h3 className="text-lg font-medium mb-3">Add New Color</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Primary Blue"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newColor.colorName}
                    onChange={(e) => handleInputChange('colorName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color Code</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="e.g. #3b82f6"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newColor.colorCode}
                      onChange={(e) => handleInputChange('colorCode', e.target.value)}
                    />
                    {newColor.colorCode && (
                      <span 
                        style={getColorPreviewStyle(newColor.colorCode)} 
                        title="Color preview"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    resetForm();
                  }}
                  className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
                >
                  <FiX className="mr-1" /> Cancel
                </button>
                <button
                  onClick={() => saveColor(newColor)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                  disabled={isLoading || !newColor.colorName || !newColor.colorCode}
                >
                  <FiSave className="mr-1" /> Save
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow"
            >
              <FiPlus className="mr-2" /> Add New Color
            </button>
          )}
        </>
      )}
    </div>
  );
}