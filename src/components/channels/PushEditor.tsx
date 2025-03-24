import React from 'react';
import { Bell } from 'lucide-react';
import { MarketingContent } from '../../types';

interface PushEditorProps {
  content: MarketingContent;
  onContentChange: (field: keyof MarketingContent, value: string) => void;
}

const PushEditor: React.FC<PushEditorProps> = ({ content, onContentChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Push Notification</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            value={content.pushMessage}
            onChange={(e) => onContentChange('pushMessage', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default PushEditor;