import { useState } from 'react';
import { X } from 'lucide-react';

const TRANSPARENT_PATTERN = 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)';

interface ImageCropModalProps {
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (smsIcon: string, pushIcon: string) => void;
}

export default function ImageCropModal({ imageUrl, onClose, onCropComplete }: ImageCropModalProps) {
  const [bgColor, setBgColor] = useState('#ffffff');

  // Common background colors for logos
  const commonColors = [
    { color: '#ffffff', name: 'White' },
    { color: '#000000', name: 'Black' },
    { color: '#f8f9fa', name: 'Light Gray' },
    { color: '#212529', name: 'Dark Gray' },
    { color: '#343a40', name: 'Charcoal' },
    { color: 'transparent', name: 'Transparent' },
  ];

  const generateIcons = () => {
    const generateIcon = (isCircle: boolean) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('No 2d context');
      }

      // Set canvas size to 48x48
      canvas.width = 48;
      canvas.height = 48;

      // Fill background
      if (bgColor === 'transparent') {
        ctx.clearRect(0, 0, 48, 48);
      } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 48, 48);
      }

      // Create a new image to draw
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      return new Promise<string>((resolve) => {
        img.onload = () => {
          // Calculate scaling to fit the image within 48x48 while maintaining aspect ratio
          const scale = Math.min(48 / img.width, 48 / img.height) * 0.8;
          const width = img.width * scale;
          const height = img.height * scale;
          const x = (48 - width) / 2;
          const y = (48 - height) / 2;

          if (isCircle) {
            // For SMS (circle), create circular clipping path first
            ctx.beginPath();
            ctx.arc(24, 24, 24, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
          }

          // Draw the image centered
          ctx.drawImage(img, x, y, width, height);
          resolve(canvas.toDataURL('image/png'));
        };

        // Add error handling
        img.onerror = () => {
          console.error('Error loading image');
          resolve(''); // Return empty string on error
        };
      });
    };

    // Generate both icons
    Promise.all([
      generateIcon(true), // SMS (circle)
      generateIcon(false), // Push (square)
    ]).then(([smsIcon, pushIcon]) => {
      if (smsIcon && pushIcon) {
        onCropComplete(smsIcon, pushIcon);
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Customize Icon Background</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Background Color:</label>
            <div className="relative">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-200"
                  style={{ 
                    backgroundColor: bgColor,
                    backgroundImage: bgColor === 'transparent' ? TRANSPARENT_PATTERN : 'none',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                  }}
                />
                <select
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="pl-2 pr-8 py-1 rounded-md border border-gray-200 text-sm focus:border-[#3D1D72] focus:ring-[#3D1D72]"
                >
                  {commonColors.map((color) => (
                    <option key={color.color} value={color.color}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div 
            className="border rounded-lg overflow-hidden"
            style={{ 
              backgroundColor: bgColor,
              backgroundImage: bgColor === 'transparent' ? TRANSPARENT_PATTERN : 'none',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
            }}
          >
            <div className="aspect-square flex items-center justify-center p-8">
              <img
                src={imageUrl}
                alt="Brand logo preview"
                crossOrigin="anonymous"
                className="max-w-[60%] max-h-[60%] object-contain"
                style={{
                  filter: bgColor === '#ffffff' ? 'none' : 'drop-shadow(0 0 2px rgba(255,255,255,0.1))'
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={generateIcons}
              className="px-4 py-2 bg-[#3D1D72] text-white rounded-lg hover:bg-[#2D1655]"
            >
              Generate Icons
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 