import React, { useRef, useState, useEffect } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { analytics } from '../lib/analytics';
import type { MarketingContent } from '../types';

interface DeviceFrameProps {
  children: React.ReactNode;
  title: React.ReactNode;
  content: MarketingContent;
  hideExport?: boolean;
  isLoading?: boolean;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, title, content, hideExport = false, isLoading = false }) => {
  const deviceRef = useRef<HTMLDivElement>(null);
  const [isCopying, setIsCopying] = React.useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Extract plain text from title for analytics and filenames
  const getPlainTitle = () => {
    if (typeof title === 'string') return title;
    // If it's an element, try to get the text content
    const titleElement = title as React.ReactElement;
    return titleElement.props?.children || 'preview';
  };

  const captureImage = async () => {
    if (!deviceRef.current) return null;
    
    setIsCapturing(true); // Hide overlay during capture
    
    try {
      const dataUrl = await toPng(deviceRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });
      return dataUrl;
    } finally {
      setIsCapturing(false); // Restore overlay after capture
    }
  };

  const handleDownload = async () => {
    try {
      const dataUrl = await captureImage();
      if (!dataUrl) return;
      
      const brandName = content.brandName
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, '') || 'brand';
      
      const plainTitle = getPlainTitle();
      const channel = plainTitle.toLowerCase().replace(/\s+preview$/, '');
      
      const filename = `${brandName}-${channel}-preview.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      analytics.trackExportClick(channel);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating preview:', error);
      analytics.trackError('download_preview_failed', errorMessage, {
        channel: getPlainTitle().toLowerCase().replace(/\s+preview$/, ''),
        brandName: content.brandName
      });
    }
  };

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      const dataUrl = await captureImage();
      if (!dataUrl) return;

      const channel = getPlainTitle().toLowerCase().replace(/\s+preview$/, '');
      
      // Create a blob from the data URL
      const blob = await fetch(dataUrl).then(res => res.blob());
      
      // Copy the image to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);

      analytics.trackCopyClick(channel);
      
      // Reset the copying state after a short delay to show the checkmark
      setTimeout(() => {
        setIsCopying(false);
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error copying preview:', error);
      analytics.trackError('copy_preview_failed', errorMessage, {
        channel: getPlainTitle().toLowerCase().replace(/\s+preview$/, ''),
        brandName: content.brandName,
        clipboardSupported: !!navigator.clipboard,
        clipboardWriteSupported: !!(navigator.clipboard && navigator.clipboard.write)
      });
      setIsCopying(false);
    }
  };

  const renderButtons = () => {
    if (hideExport) return null;

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          title="Copy preview"
        >
          {isCopying ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={handleDownload}
          className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          title="Download preview"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-[375px] mx-auto">
      <div className="flex justify-between items-center mb-2">
        {title}
        {!hideExport && renderButtons()}
      </div>
      <div 
        ref={deviceRef} 
        className="rounded-[3rem] bg-white/50 p-4 shadow-xl border border-white"
      >
        <div className="relative rounded-[2rem] overflow-hidden h-[700px] bg-white">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="w-10 h-10 border-4 border-[#3D1D72] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {/* Actual screen content */}
          <div className={`h-full ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceFrame;