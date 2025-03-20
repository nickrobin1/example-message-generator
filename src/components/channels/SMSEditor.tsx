import React from 'react';
import { MessageSquare } from 'lucide-react';
import { MarketingContent } from '../../types';

interface SMSEditorProps {
  content: MarketingContent;
  onContentChange: (field: keyof MarketingContent, value: string) => void;
}

const SMSEditor: React.FC<SMSEditorProps> = ({ content, onContentChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">SMS Message</h2>
      </div>
      <div className="space-y-4">
        <div>
          <textarea
            value={content.smsMessage}
            onChange={(e) => onContentChange('smsMessage', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Enter the initial SMS message..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Add Reply</label>
          <input
            type="text"
            value={content.userReply}
            onChange={(e) => onContentChange('userReply', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter customer's reply..."
          />
        </div>
        {content.userReply && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Response</label>
            <input
              type="text"
              value={content.brandReply}
              onChange={(e) => onContentChange('brandReply', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter brand's response..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSEditor;