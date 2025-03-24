import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

export default function ImageInput({ value, onChange, label, placeholder = 'https://example.com/image.png' }: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      {value ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded overflow-hidden">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => onChange('')}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
            placeholder={placeholder}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D1D72]"
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
} 