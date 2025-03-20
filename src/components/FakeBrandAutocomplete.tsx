import React, { useState, useEffect, useRef } from 'react';
import { fakeBrands } from '../data/fakeBrands';
import type { FakeBrand } from '../data/fakeBrands';

interface FakeBrandAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectBrand: (brand: FakeBrand) => void;
}

export default function FakeBrandAutocomplete({ value, onChange, onSelectBrand }: FakeBrandAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<FakeBrand[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter brands based on input
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = fakeBrands.filter(brand =>
      brand.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
  }, [value]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value && suggestions.length > 0 && setIsOpen(true)}
        placeholder="Enter brand name"
        className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
      />
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {suggestions.map((brand) => (
            <button
              key={brand.name}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              onClick={() => {
                onSelectBrand(brand);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={`/src/assets/Fake Brands/${brand.image}`}
                  alt={brand.name}
                  className="w-8 h-8 rounded"
                />
                <div>
                  <div className="font-medium text-gray-900">{brand.name}</div>
                  <div className="text-sm text-gray-500">{brand.category}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 