import React from 'react';
import { MessageSquare } from 'lucide-react';
import { MarketingContent } from '../../types';

interface WhatsAppEditorProps {
  content: MarketingContent;
  onContentChange: (field: keyof MarketingContent, value: string) => void;
}

const WhatsAppEditor: React.FC<WhatsAppEditorProps> = ({ content, onContentChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-[#3D1D72]" />
        <h2 className="text-lg font-semibold">WhatsApp Message</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            value={content.whatsappMessage}
            onChange={(e) => onContentChange('whatsappMessage', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72]"
            rows={3}
            placeholder="Enter your WhatsApp message here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">User Reply (Optional)</label>
          <input
            type="text"
            value={content.whatsappReply}
            onChange={(e) => onContentChange('whatsappReply', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72]"
            placeholder="Add a simulated user reply..."
          />
        </div>

        {content.whatsappReply && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Response</label>
            <input
              type="text"
              value={content.brandReply}
              onChange={(e) => onContentChange('brandReply', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72]"
              placeholder="Add your brand's response..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppEditor; 