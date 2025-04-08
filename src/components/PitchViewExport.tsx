import React, { useRef, useState, useEffect } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { analytics } from '../lib/analytics';
import type { MarketingContent } from '../types';
import DeviceFrame from './DeviceFrame';
import JSConfetti from 'js-confetti';

interface PitchViewExportProps {
  content: MarketingContent;
  children: React.ReactNode;
  isLoading?: boolean;
}

const PitchViewExport: React.FC<PitchViewExportProps> = ({ content, children, isLoading = false }) => {
  const [isCopying, setIsCopying] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const jsConfettiRef = useRef<JSConfetti | null>(null);

  useEffect(() => {
    jsConfettiRef.current = new JSConfetti();
    return () => {
      jsConfettiRef.current = null;
    };
  }, []);

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

      // Trigger confetti animation for download
      jsConfettiRef.current?.addConfetti({
        emojis: ['💰', '💸', '💵'],
        emojiSize: 100,
        confettiNumber: 100,
      });

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

      const blob = await fetch(image).then(res => res.blob());
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);

      // Trigger confetti animation for copy
      jsConfettiRef.current?.addConfetti({
        emojis: ['💰', '💸', '💵'],
        emojiSize: 100,
        confettiNumber: 100,
      });

      analytics.trackCopyClick('pitch-view');
      
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
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={handleCopy}
          className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
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
              <span>Copy</span>
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
          title="Download preview"
          disabled={isCapturing}
        >
          <Download className="w-5 h-5" />
          <span>Download</span>
        </button>
      </div>
      <div 
        ref={gridRef} 
        className="bg-white rounded-lg overflow-hidden border border-gray-200"
        style={{ 
          aspectRatio: '16/9',
          width: '100%',
          maxWidth: '1920px',
          margin: '0 auto'
        }}
      >
        <div className="p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            {content.logoUrl && (
              <img 
                src={content.logoUrl} 
                alt={content.brandName}
                className="w-16 h-16 object-contain"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-[#3D1D72]">
                Cross-Channel Customer Journey
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {content.useCase}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchViewExport; 