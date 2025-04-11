import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

export default function ImageInput({ value, onChange, label, placeholder }: ImageInputProps) {
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
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      )}
      {value ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded overflow-hidden">
            <img src={value} alt="" className="w-full h-full object-contain" />
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
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-200 focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ImageIcon className="h-4 w-4 text-gray-400" />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <Upload className="h-4 w-4 text-gray-400" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
} 