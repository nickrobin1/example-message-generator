import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { analytics } from '../lib/analytics';

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

      // Track the export event
      analytics.trackExportClick(title.toLowerCase());
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
      <div ref={deviceRef} className="rounded-[3rem] bg-white/50 p-4 shadow-xl border border-white">
        <div className="relative rounded-[2rem] overflow-hidden h-[700px] bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DeviceFrame;