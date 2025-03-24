import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { MarketingContent } from '../../types';
import ImageInput from '../ImageInput';

interface CardEditorProps {
  content: MarketingContent;
  onContentChange: (field: keyof MarketingContent, value: string) => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ content, onContentChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <LayoutDashboard className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Card Message</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={content.cardTitle}
            onChange={(e) => onContentChange('cardTitle', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={content.cardDescription}
            onChange={(e) => onContentChange('cardDescription', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <ImageInput
          value={content.cardImage}
          onChange={(value) => onContentChange('cardImage', value)}
          label="Card Image"
          placeholder="https://example.com/card-image.jpg"
        />
      </div>
    </div>
  );
};

export default CardEditor;