import React from 'react';
import { Mail } from 'lucide-react';
import { MarketingContent } from '../../types';
import ImageInput from '../ImageInput';

interface EmailEditorProps {
  content: MarketingContent;
  onContentChange: (field: keyof MarketingContent, value: string) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ content, onContentChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Email Message</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject Line</label>
          <input
            type="text"
            value={content.emailSubject}
            onChange={(e) => onContentChange('emailSubject', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Welcome to {{Brand Name}}"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Headline</label>
          <input
            type="text"
            value={content.emailHeadline}
            onChange={(e) => onContentChange('emailHeadline', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Your Headline Here"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Body</label>
          <textarea
            value={content.emailBody}
            onChange={(e) => onContentChange('emailBody', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            placeholder="Your email content here..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CTA Text</label>
          <input
            type="text"
            value={content.emailCta}
            onChange={(e) => onContentChange('emailCta', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Click Here"
          />
        </div>
        <ImageInput
          value={content.emailImage}
          onChange={(value) => onContentChange('emailImage', value)}
          label="Email Image"
          placeholder="https://example.com/email-image.jpg"
        />
      </div>
    </div>
  );
};

export default EmailEditor; 