import React from 'react';
import { Building2, ChevronLeft, ChevronRight, Battery, Signal, Wifi, MoreVertical, Video, Phone } from 'lucide-react';
import type { MarketingContent } from '../../types';

interface WhatsAppPreviewProps {
  content: MarketingContent;
}

const WhatsAppMessage: React.FC<{ message: string; time: string; isReceived: boolean }> = ({ message, time, isReceived }) => (
  <div className={`flex ${isReceived ? '' : 'justify-end'}`}>
    <div className={`max-w-[80%] rounded-lg p-2 ${isReceived ? 'bg-white' : 'bg-[#DCF8C6]'}`}>
      <p className="text-[15px] leading-5 text-gray-800">{message}</p>
      <div className="text-[11px] text-gray-500 text-right mt-1">{time}</div>
    </div>
  </div>
);

export default function WhatsAppPreview({ content }: WhatsAppPreviewProps) {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="max-w-sm mx-auto h-full">
      <div className="bg-white h-full flex flex-col">
        {/* iOS Status Bar */}
        <div className="bg-[#075E54] h-7 flex justify-between items-center px-5 pt-1">
          <div className="text-white font-medium text-sm">
            {currentTime}
          </div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">5G</span>
            <Wifi className="w-4 h-4 text-white" />
            <Battery className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* WhatsApp Header */}
        <div className="bg-[#075E54] border-b border-[#128C7E]">
          <div className="relative flex items-center px-4 py-2">
            <button className="text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-between flex-1">
              <div className="flex items-center gap-3 ml-2">
                {content.whatsappIcon ? (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1">
                    <img 
                      src={content.whatsappIcon} 
                      alt={content.brandName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-white font-medium">
                    {content.brandName || 'Brand Name'}
                  </span>
                  <span className="text-[#7EB8B0] text-xs">Business Account</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-white">
                  <Video className="w-5 h-5" />
                </button>
                <button className="text-white">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-[#ECE5DD] p-4 space-y-4 overflow-y-auto">
          <div className="flex justify-center">
            <div className="bg-[#E2F3FB] rounded-lg px-3 py-1 text-center">
              <p className="text-[13px] text-gray-600">Today</p>
            </div>
          </div>

          {/* Brand Message */}
          <WhatsAppMessage
            message={content.whatsappMessage || 'Your message will appear here'}
            time={new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            isReceived={true}
          />

          {/* User Reply (if exists) */}
          {content.whatsappReply && (
            <WhatsAppMessage
              message={content.whatsappReply}
              time={new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              isReceived={false}
            />
          )}

          {/* Brand Reply (if exists) */}
          {content.whatsappReply && content.brandReply && (
            <WhatsAppMessage
              message={content.brandReply}
              time={new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              isReceived={true}
            />
          )}
        </div>
      </div>
    </div>
  );
} 