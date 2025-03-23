import React from 'react';
import { Mail, Trash, MoreHorizontal, ChevronLeft } from 'lucide-react';
import type { MarketingContent } from '../../types';

interface EmailPreviewProps {
  content: MarketingContent;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ content }) => {
  const fromEmail = content.brandName ? `emails@${content.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` : 'emails@brand.com';
  const senderInfo = `${content.brandName} (${fromEmail})`;

  return (
    <div className="bg-[#F8F7FF] h-full flex flex-col">
      {/* Email Header */}
      <div className="p-4 border-b border-gray-200 flex flex-col bg-white">
        {/* Top Icons Row */}
        <div className="flex items-center justify-between mb-3">
          <button className="text-gray-500">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4 text-gray-500">
            <button>
              <Trash className="w-5 h-5" />
            </button>
            <button>
              <Mail className="w-5 h-5" />
            </button>
            <button>
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* From Line */}
        <div className="flex items-center text-gray-800">
          <span className="font-medium mr-1">From:</span>
          <span className="truncate text-[#3D1D72]">{senderInfo}</span>
        </div>
        
        {/* Subject Line */}
        <div className="font-medium mt-1">{content.emailSubject}</div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-2xl mx-auto p-6">
          {/* Logo */}
          {content.logoUrl && (
            <div className="mb-6 flex justify-center">
              <img
                src={content.logoUrl}
                alt={content.brandName}
                className="h-12 object-contain"
              />
            </div>
          )}

          {/* Hero Image */}
          <img
            src={content.emailImage || content.cardImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80'}
            alt="Email hero"
            className="w-full h-48 object-cover rounded-lg mb-6"
          />

          {/* Headline */}
          <h1 className="text-2xl font-bold text-center mb-4">
            {content.emailHeadline || 'Your Headline Here'}
          </h1>

          {/* Body */}
          <div className="text-center text-gray-600 mb-6 whitespace-pre-wrap">
            {content.emailBody || 'Your email content here...'}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              className="px-8 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-all"
              style={{ backgroundColor: content.brandColor || '#3D1D72' }}
            >
              {content.emailCta || 'Click Here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview; 