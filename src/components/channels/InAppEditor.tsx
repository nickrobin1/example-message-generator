import React from 'react';
import { MessageCircle, Upload } from 'lucide-react';
import { MarketingContent } from '../../types';

interface InAppEditorProps {
  content: MarketingContent;
  onContentChange: (field: keyof MarketingContent, value: string | string[]) => void;
}

const InAppEditor: React.FC<InAppEditorProps> = ({ content, onContentChange }) => {
  const handleSurveyOptionChange = (index: number, value: string) => {
    const newOptions = [...content.inAppSurveyOptions];
    newOptions[index] = value;
    onContentChange('inAppSurveyOptions', newOptions);

    // Clear selection if the option was selected and is now empty
    if (!value && content.inAppSelectedOptions.includes(value)) {
      const newSelected = content.inAppSelectedOptions.filter(o => o !== value);
      onContentChange('inAppSelectedOptions', newSelected);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onContentChange('inAppBackgroundImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">In-App Message</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={content.inAppType}
            onChange={(e) => {
              onContentChange('inAppType', e.target.value);
              // Clear selections when changing type
              onContentChange('inAppSelectedOptions', []);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="modal-logo">Modal with Logo</option>
            <option value="modal-image">Modal with Image</option>
            <option value="fullscreen">Full Screen</option>
            <option value="survey">Simple Survey</option>
            <option value="information-capture">Information Capture</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Background Image</label>
          <div className="mt-1 flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className={`flex items-center justify-center border-2 border-dashed rounded-lg px-6 py-4 ${content.inAppBackgroundImage ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                <div className="text-center">
                  <Upload className={`mx-auto h-8 w-8 ${content.inAppBackgroundImage ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-900">
                      {content.inAppBackgroundImage ? 'Change background image' : 'Upload background image'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            {content.inAppBackgroundImage && (
              <button
                onClick={() => onContentChange('inAppBackgroundImage', '')}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Add a screenshot of your app to show how the modal would look in context
          </p>
        </div>

        {content.inAppType === 'survey' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Survey Options</label>
            {content.inAppSurveyOptions.map((option, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleSurveyOptionChange(index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={content.inAppTitle}
            onChange={(e) => onContentChange('inAppTitle', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            value={content.inAppBody}
            onChange={(e) => onContentChange('inAppBody', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Enter message..."
          />
        </div>

        {(content.inAppType === 'modal-image' || content.inAppType === 'fullscreen') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={content.inAppImage}
              onChange={(e) => onContentChange('inAppImage', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}

        {content.inAppType === 'information-capture' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Input Field Label</label>
              <input
                type="text"
                value={content.inAppInputLabel || ''}
                onChange={(e) => onContentChange('inAppInputLabel', e.target.value)}
                placeholder="e.g., Email Address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Input Field Placeholder</label>
              <input
                type="text"
                value={content.inAppInputPlaceholder || ''}
                onChange={(e) => onContentChange('inAppInputPlaceholder', e.target.value)}
                placeholder="e.g., Enter your email to get updates"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">CTA Text</label>
          <input
            type="text"
            value={content.inAppCtaText}
            onChange={(e) => onContentChange('inAppCtaText', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter CTA text..."
          />
        </div>
      </div>
    </div>
  );
};

export default InAppEditor;