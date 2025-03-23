import React from 'react';
import { Upload } from 'lucide-react';
import type { MarketingContent } from '../../types';

interface EmailEditorProps {
  content: MarketingContent;
  onContentChange: (field: keyof MarketingContent, value: string) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ content, onContentChange }) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onContentChange('emailImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-[#3D1D72]">Email Content</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Subject Line
          </label>
          <input
            type="text"
            value={content.emailSubject}
            onChange={(e) => onContentChange('emailSubject', e.target.value)}
            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
            placeholder="Enter subject line..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Headline
          </label>
          <input
            type="text"
            value={content.emailHeadline}
            onChange={(e) => onContentChange('emailHeadline', e.target.value)}
            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
            placeholder="Enter headline..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Body Text
          </label>
          <textarea
            value={content.emailBody}
            onChange={(e) => onContentChange('emailBody', e.target.value)}
            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
            rows={4}
            placeholder="Enter email body..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Call to Action
          </label>
          <input
            type="text"
            value={content.emailCta}
            onChange={(e) => onContentChange('emailCta', e.target.value)}
            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
            placeholder="Enter CTA text..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Hero Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="email-image-upload"
                  className="relative cursor-pointer rounded-md font-medium text-[#3D1D72] hover:text-[#2D1655] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#3D1D72]"
                >
                  <span>Upload a file</span>
                  <input
                    id="email-image-upload"
                    name="email-image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {content.emailImage && (
            <div className="mt-3">
              <img
                src={content.emailImage}
                alt="Email hero"
                className="h-32 w-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailEditor; 