import React, { useState } from 'react';
import { MessageCircle, Plus, Minus } from 'lucide-react';
import { MarketingContent } from '../../types';
import ImageInput from '../ImageInput';

interface InAppEditorProps {
  content: MarketingContent;
  onContentChange: (field: keyof MarketingContent, value: string | string[]) => void;
}

const InAppEditor: React.FC<InAppEditorProps> = ({ content, onContentChange }) => {
  const [showSecondInput, setShowSecondInput] = useState(false);

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
          <label className="block text-sm font-medium text-gray-700">Message Type</label>
          <select
            value={content.inAppType}
            onChange={(e) => onContentChange('inAppType', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="modal-logo">Modal with Logo</option>
            <option value="modal-image">Modal with Image</option>
            <option value="survey">Survey</option>
            <option value="email-phone-capture">Email/Phone Capture</option>
            <option value="fullscreen">Fullscreen</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={content.inAppTitle}
            onChange={(e) => onContentChange('inAppTitle', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Welcome to {{Brand Name}}"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Body</label>
          <textarea
            value={content.inAppBody}
            onChange={(e) => onContentChange('inAppBody', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="We're excited to have you here! Get started by exploring our features."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CTA Text</label>
          <input
            type="text"
            value={content.inAppCtaText}
            onChange={(e) => onContentChange('inAppCtaText', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Get Started"
          />
        </div>

        {(content.inAppType === 'modal-image' || content.inAppType === 'fullscreen') && (
          <ImageInput
            value={content.inAppImage}
            onChange={(value) => onContentChange('inAppImage', value)}
            label="In-App Image"
            placeholder="https://example.com/in-app-image.jpg"
          />
        )}

        {content.inAppType === 'survey' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Survey Options</label>
            <div className="mt-2 space-y-2">
              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  type="text"
                  value={content.inAppSurveyOptions[index] || ''}
                  onChange={(e) => {
                    const newOptions = [...content.inAppSurveyOptions];
                    newOptions[index] = e.target.value;
                    onContentChange('inAppSurveyOptions', newOptions);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={`Option ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {content.inAppType === 'email-phone-capture' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Input Label</label>
              <input
                type="text"
                value={content.inAppInputLabel}
                onChange={(e) => onContentChange('inAppInputLabel', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Email Address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Input Placeholder</label>
              <input
                type="text"
                value={content.inAppInputPlaceholder}
                onChange={(e) => onContentChange('inAppInputPlaceholder', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email to get updates"
              />
            </div>
            
            <button
              type="button"
              onClick={() => {
                setShowSecondInput(!showSecondInput);
                if (!showSecondInput) {
                  onContentChange('inAppInputLabel2', '');
                  onContentChange('inAppInputPlaceholder2', '');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {showSecondInput ? (
                <>
                  <Minus className="w-4 h-4" />
                  Remove second input field
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add another input field
                </>
              )}
            </button>

            {showSecondInput && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Second Input Label</label>
                  <input
                    type="text"
                    value={content.inAppInputLabel2}
                    onChange={(e) => onContentChange('inAppInputLabel2', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Second Input Placeholder</label>
                  <input
                    type="text"
                    value={content.inAppInputPlaceholder2}
                    onChange={(e) => onContentChange('inAppInputPlaceholder2', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Submit Button Text</label>
              <input
                type="text"
                value={content.inAppSubmitButtonText}
                onChange={(e) => onContentChange('inAppSubmitButtonText', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Submit"
              />
            </div>
          </>
        )}

        {content.inAppType !== 'fullscreen' && (
          <ImageInput
            value={content.inAppBackgroundImage}
            onChange={(value) => onContentChange('inAppBackgroundImage', value)}
            label="App Background Image"
            placeholder="https://example.com/background-image.jpg"
          />
        )}
      </div>
    </div>
  );
};

export default InAppEditor;