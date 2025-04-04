import React, { useRef, useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { analytics } from '../lib/analytics';
import type { MarketingContent } from '../types';

interface PitchViewExportProps {
  content: MarketingContent;
  children: React.ReactNode;
}

const PitchViewExport: React.FC<PitchViewExportProps> = ({ content, children }) => {
  const [isCopying, setIsCopying] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const captureGrid = async () => {
    setIsCapturing(true);
    try {
      if (!gridRef.current) return null;
      return await toPng(gridRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const image = await captureGrid();
      if (!image) return;

      const brandName = content.brandName
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, '') || 'brand';

      const link = document.createElement('a');
      link.download = `${brandName}-pitch-view.png`;
      link.href = image;
      link.click();

      analytics.trackExportClick('pitch-view');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating pitch view:', error);
      analytics.trackError('download_pitch_view_failed', errorMessage, {
        brandName: content.brandName
      });
    }
  };

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      const image = await captureGrid();
      if (!image) return;

      // Create a blob from the image
      const blob = await fetch(image).then(res => res.blob());
      
      // Copy the image to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);

      analytics.trackCopyClick('pitch-view');
      
      // Reset the copying state after a short delay to show the checkmark
      setTimeout(() => {
        setIsCopying(false);
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error copying pitch view:', error);
      analytics.trackError('copy_pitch_view_failed', errorMessage, {
        brandName: content.brandName,
        clipboardSupported: !!navigator.clipboard,
        clipboardWriteSupported: !!(navigator.clipboard && navigator.clipboard.write)
      });
      setIsCopying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        <button
          onClick={handleCopy}
          className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
          title="Copy preview"
          disabled={isCapturing}
        >
          {isCopying ? (
            <>
              <Check className="w-5 h-5 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copy to clipboard</span>
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
          title="Download preview"
          disabled={isCapturing}
        >
          <Download className="w-5 h-5" />
          <span>Download</span>
        </button>
      </div>
      <div ref={gridRef} className="bg-[#F8F7FF] p-4 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default PitchViewExport; 