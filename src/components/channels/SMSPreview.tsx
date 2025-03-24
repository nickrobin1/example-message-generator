import React from 'react';
import { Building2, ChevronLeft, ChevronRight, Battery, Signal, Wifi } from 'lucide-react';
import type { MarketingContent } from '../../types';

export default function SMSPreview({ content }: { content: MarketingContent }) {
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
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                  <img 
                    src={content.smsIcon} 
                    alt={content.brandName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="mt-1 flex items-center gap-1">
                <span className="text-gray-900 text-base font-medium ios-font">
                  {content.brandName || 'Brand Name'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 space-y-4 bg-white overflow-y-auto">
          {/* Initial Message Bubble */}
          <div className="flex items-end gap-2">
            <div className="max-w-[80%]">
              <div className="bg-[#E9E9EB] rounded-2xl rounded-tl-sm px-4 py-2">
                <p className="text-black text-[15px] leading-5 ios-font">
                  {content.smsMessage || 'Your message will appear here'}
                </p>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 ml-2 ios-font">
                {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </div>
            </div>
          </div>

          {/* User Reply */}
          {content.userReply && (
            <div className="flex items-end justify-end gap-2">
              <div className="max-w-[80%]">
                <div className="bg-[#007AFF] rounded-2xl rounded-tr-sm px-4 py-2">
                  <p className="text-white text-[15px] leading-5 ios-font">
                    {content.userReply}
                  </p>
                </div>
                <div className="text-[11px] text-gray-500 mt-1 mr-2 text-right ios-font">
                  {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </div>
              </div>
            </div>
          )}

          {/* Brand Reply */}
          {content.userReply && content.brandReply && (
            <div className="flex items-end gap-2">
              <div className="max-w-[80%]">
                <div className="bg-[#E9E9EB] rounded-2xl rounded-tl-sm px-4 py-2">
                  <p className="text-black text-[15px] leading-5 ios-font">
                    {content.brandReply}
                  </p>
                </div>
                <div className="text-[11px] text-gray-500 mt-1 ml-2 ios-font">
                  {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 