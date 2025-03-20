import React, { useRef } from 'react';
import { Battery, Signal, Wifi, Download } from 'lucide-react';
import { getCurrentTime } from '../utils/time';
import { toPng } from 'html-to-image';

interface DeviceFrameProps {
  children: React.ReactNode;
  title: string;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, title }) => {
  const deviceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!deviceRef.current) return;

    try {
      const dataUrl = await toPng(deviceRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-preview.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  return (
    <div className="max-w-[375px] mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={handleDownload}
          className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          title="Download preview"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
      <div ref={deviceRef} className="rounded-[3rem] bg-black p-4 shadow-xl">
        <div className="relative rounded-[2rem] overflow-hidden h-[700px]">
          {/* Status Bar */}
          <div className="absolute top-0 inset-x-0 z-10 flex justify-end items-center px-6 h-7 text-white">
            <div className="flex items-center gap-1">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Content */}
          <div className="h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceFrame;