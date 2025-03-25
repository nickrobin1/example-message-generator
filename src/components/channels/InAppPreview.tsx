import React from 'react';
import { X } from 'lucide-react';
import { MarketingContent } from '../../types';

interface InAppPreviewProps {
  content: MarketingContent;
  onContentChange: (field: keyof MarketingContent, value: string | string[]) => void;
}

const InAppPreview: React.FC<InAppPreviewProps> = ({ content, onContentChange }) => {
  const renderContent = () => {
    switch (content.inAppType) {
      case 'modal-logo':
        return (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-[300px] relative">
              <button className="absolute right-4 top-4">
                <X className="w-6 h-6 text-gray-400" />
              </button>
              <div className="p-6">
                {content.logoUrl ? (
                  <img 
                    src={content.logoUrl} 
                    alt={content.brandName} 
                    className="w-24 h-12 mx-auto mb-4 object-contain"
                  />
                ) : (
                  <div className="w-24 h-12 mx-auto mb-4 bg-purple-100 flex items-center justify-center rounded">
                    <span className="text-lg font-bold text-purple-600">LOGO</span>
                  </div>
                )}
                <h2 className="text-lg font-semibold text-center mb-2">{content.inAppTitle || 'Welcome to {{Brand Name}}'}</h2>
                <p className="text-gray-600 text-center text-sm mb-4">{content.inAppBody || 'We\'re excited to have you here! Get started by exploring our features.'}</p>
                <button 
                  className="w-full text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                  style={{ backgroundColor: content.brandColor }}
                >
                  {content.inAppCtaText || 'Get Started'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'modal-image':
        return (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-[300px] relative overflow-hidden">
              <button className="absolute right-4 top-4 z-10">
                <X className="w-6 h-6 text-white" />
              </button>
              <img
                src={content.inAppImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04'}
                alt="Preview"
                className="w-full h-36 object-cover"
              />
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-2">{content.inAppTitle || 'Welcome to {{Brand Name}}'}</h2>
                <p className="text-gray-600 text-sm mb-4">{content.inAppBody || 'We\'re excited to have you here! Get started by exploring our features.'}</p>
                <button 
                  className="w-full text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                  style={{ backgroundColor: content.brandColor }}
                >
                  {content.inAppCtaText || 'Get Started'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'fullscreen':
        return (
          <div className="absolute inset-0 bg-white">
            <div className="relative h-full flex flex-col">
              <button className="absolute right-4 top-4 z-10">
                <X className="w-6 h-6 text-gray-400" />
              </button>
              {content.inAppImage && (
                <img
                  src={content.inAppImage}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold mb-2">{content.inAppTitle || 'Welcome to {{Brand Name}}'}</h2>
                <p className="text-gray-600 text-sm mb-4 flex-1">{content.inAppBody || 'We\'re excited to have you here! Get started by exploring our features.'}</p>
                <button 
                  className="w-full text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                  style={{ backgroundColor: content.brandColor }}
                >
                  {content.inAppCtaText || 'Get Started'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'survey':
        return (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-[300px] relative">
              <button className="absolute right-4 top-4">
                <X className="w-6 h-6 text-gray-400" />
              </button>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-2">{content.inAppTitle || 'Welcome to {{Brand Name}}'}</h2>
                <p className="text-gray-600 text-sm mb-4">{content.inAppBody || 'We\'re excited to have you here! Get started by exploring our features.'}</p>
                <div className="space-y-2 mb-4">
                  {content.inAppSurveyOptions.length > 0 ? (
                    content.inAppSurveyOptions.map((option, index) => option && (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400"
                      >
                        {option}
                      </button>
                    ))
                  ) : (
                    <>
                      <button className="w-full text-left px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400">
                        Option 1
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400">
                        Option 2
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400">
                        Option 3
                      </button>
                    </>
                  )}
                </div>
                <button 
                  className="w-full text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                  style={{ backgroundColor: content.brandColor }}
                >
                  {content.inAppCtaText || 'Submit'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'email-phone-capture':
        return (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-[300px] relative">
              <button className="absolute right-4 top-4">
                <X className="w-6 h-6 text-gray-400" />
              </button>
              <div className="p-6">
                {content.logoUrl ? (
                  <img 
                    src={content.logoUrl} 
                    alt={content.brandName} 
                    className="w-24 h-12 mx-auto mb-4 object-contain"
                  />
                ) : (
                  <div className="w-24 h-12 mx-auto mb-4 bg-purple-100 flex items-center justify-center rounded">
                    <span className="text-lg font-bold text-purple-600">LOGO</span>
                  </div>
                )}
                <h2 className="text-lg font-semibold text-center mb-2">{content.inAppTitle || 'Welcome to {{Brand Name}}'}</h2>
                <p className="text-gray-600 text-center text-sm mb-4">{content.inAppBody || 'We\'re excited to have you here! Get started by exploring our features.'}</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {content.inAppInputLabel || 'Email Address'}
                    </label>
                    <input
                      type={content.inAppInputLabel?.toLowerCase().includes('phone') ? 'tel' : 'text'}
                      placeholder={content.inAppInputPlaceholder || 'Enter your email to get updates'}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button 
                    className="w-full text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                    style={{ backgroundColor: content.brandColor }}
                  >
                    {content.inAppCtaText || 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 h-full relative overflow-hidden">
      {/* App Background */}
      {content.inAppBackgroundImage ? (
        <div className="absolute inset-0">
          <img 
            src={content.inAppBackgroundImage} 
            alt="App Background" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0">
          <div className="p-4">
            <div className="w-2/3 h-4 bg-gray-200 rounded-full mb-3" />
            <div className="w-1/2 h-4 bg-gray-200 rounded-full" />
            <div className="mt-6 space-y-4">
              <div className="w-full h-32 bg-gray-200 rounded-lg" />
              <div className="w-full h-24 bg-gray-200 rounded-lg" />
              <div className="w-3/4 h-24 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      )}
      
      {/* In-App Message */}
      {renderContent()}
    </div>
  );
};

export default InAppPreview;