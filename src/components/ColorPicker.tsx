import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { X } from 'lucide-react';

interface ColorPickerProps {
  color?: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPicker({ color = '#3D1D72', onChange, label = 'Brand Color' }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempColor, setTempColor] = useState(color);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempColor(color);
  }, [color]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const handleColorChange = (color: ColorResult) => {
    setTempColor(color.hex);
  };

  const handleDone = () => {
    onChange(tempColor);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-md cursor-pointer border border-gray-200"
          style={{ backgroundColor: color }}
          onClick={() => setShowPicker(true)}
        />
        <span className="text-sm text-gray-600">{label}</span>
      </div>

      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={pickerRef} className="bg-white p-4 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Select Color</h3>
              <button
                onClick={() => setShowPicker(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SketchPicker
              color={tempColor}
              onChange={handleColorChange}
              disableAlpha
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleDone}
                className="px-4 py-2 bg-[#3D1D72] text-white rounded-lg hover:bg-[#2D1655] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 