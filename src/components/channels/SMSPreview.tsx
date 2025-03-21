import React, { useState, useEffect } from 'react';
import { Building2, ChevronLeft, ChevronRight, Battery, Signal, Wifi } from 'lucide-react';
import type { MarketingContent } from '../../types';
import ColorThief from 'colorthief';

export default function SMSPreview({ content }: { content: MarketingContent }) {
  const [primaryColor, setPrimaryColor] = useState<string>('#F2F2F7'); // Default to header background color

  useEffect(() => {
    if (content.smsIcon) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = content.smsIcon;
      
      img.onload = () => {
        const colorThief = new ColorThief();
        try {
          const [r, g, b] = colorThief.getColor(img);
          setPrimaryColor(`rgb(${r}, ${g}, ${b})`);
        } catch (error) {
          console.error('Error extracting color:', error);
          setPrimaryColor('#F2F2F7'); // Fallback to header background color
        }
      };

      img.onerror = () => {
        console.error('Error loading image for color extraction');
        setPrimaryColor('#F2F2F7'); // Fallback to header background color
      };
    }
  }, [content.smsIcon]);

  // Get current date in iOS format
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white h-full flex flex-col">
        {/* iOS Status Bar */}
        <div className="bg-[#F2F2F7] h-7 flex justify-between items-center px-5 pt-1">
          <div className="text-black font-medium text-sm">
            {currentTime}
          </div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-4 h-4" />
            <span className="text-sm font-medium">5G</span>
            <Wifi className="w-4 h-4" />
            <Battery className="w-5 h-5" />
          </div>
        </div>

        {/* iOS Message Header */}
        <div className="bg-[#F2F2F7] border-b border-gray-200">
          <div className="relative flex items-start px-4 py-2">
            <button className="text-[#007AFF] absolute top-2 left-4">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex flex-col items-center">
              {content.smsIcon ? (
                <div 
                  className="w-12 h-12 rounded-full overflow-hidden"
                  style={{ backgroundColor: primaryColor }}
                >
                  <img 
                    src={content.smsIcon} 
                    alt={content.brandName}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="mt-1 flex items-center gap-1">
                <span className="text-gray-900 text-base font-medium font-['SF_Pro_Text']">
                  {content.brandName || 'Brand Name'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 bg-white">
          {/* Timestamp */}
          <div className="text-center mb-4">
            <span className="text-gray-500 text-sm font-['SF_Pro_Text']">
              {formattedDate} {formattedTime}
            </span>
          </div>

          {/* Message Bubble */}
          <div className="max-w-[85%] bg-[#E9E9EB] rounded-3xl px-4 py-2">
            <p className="text-black text-base font-['SF_Pro_Text']">
              {content.smsMessage || 'Your message will appear here'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 