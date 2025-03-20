import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ColorThief from 'colorthief';
import { MarketingContent } from '../../types';

interface InAppPreviewProps {
  content: MarketingContent;
}

const InAppPreview: React.FC<InAppPreviewProps> = ({ content }) => {
  const [primaryColor, setPrimaryColor] = useState<string>('#7C3AED'); // Default purple

  useEffect(() => {
    if (content.logoUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = content.logoUrl;
      
      img.onload = () => {
        const colorThief = new ColorThief();
        try {
          const [r, g, b] = colorThief.getColor(img);
          setPrimaryColor(`rgb(${r}, ${g}, ${b})`);
        } catch (error) {
          console.error('Error extracting color:', error);
          setPrimaryColor('#7C3AED'); // Fallback to default purple
        }
      };

      img.onerror = () => {
        console.error('Error loading image for color extraction');
        setPrimaryColor('#7C3AED'); // Fallback to default purple
      };
    }
  }, [content.logoUrl]);

  const renderContent = () => {
    switch (content.inAppType) {
      case 'modal-logo':
        return (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative">
              <button className="absolute right-4 top-4">
                <X className="w-6 h-6 text-gray-400" />
              </button>
              <div className="p-6">
                {content.logoUrl ? (
                  <img 
                    src={content.logoUrl} 
                    alt={content.brandName} 
                    className="w-32 h-16 mx-auto mb-6 object-contain"
                  />
                ) : (
                  <div className="w-32 h-16 mx-auto mb-6 bg-purple-100 flex items-center justify-center rounded">
                    <span className="text-xl font-bold text-purple-600">LOGO</span>
                  </div>
                )}
                <h2 className="text-xl font-semibold text-center mb-3">{content.inAppTitle}</h2>
                <p className="text-gray-600 text-center mb-6">{content.inAppBody}</p>
                <button 
                  className="w-full text-white py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  {content.inAppCtaText || 'Continue'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'modal-image':
        return (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative overflow-hidden">
              <button className="absolute right-4 top-4 z-10">
                <X className="w-6 h-6 text-white" />
              </button>
              <img
                src={content.inAppImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04'}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3">{content.inAppTitle}</h2>
                <p className="text-gray-600 mb-6">{content.inAppBody}</p>
                <button 
                  className="w-full text-white py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  {content.inAppCtaText || 'Continue'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'fullscreen':
        return (
          <div className="absolute inset-0 bg-white">
            <div className="relative h-full">
              <button className="absolute right-4 top-4 z-10">
                <X className="w-6 h-6 text-gray-400" />
              </button>
              <img
                src={content.inAppImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04'}
                alt="Preview"
                className="w-full h-1/2 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{content.inAppTitle}</h2>
                <p className="text-gray-600 mb-8">{content.inAppBody}</p>
                <div className="flex gap-4">
                  <button 
                    className="flex-1 text-white py-3 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {content.inAppCtaText || 'Continue'}
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium">
                    No Thanks
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'survey':
        return (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative">
              <button className="absolute right-4 top-4">
                <X className="w-6 h-6 text-gray-400" />
              </button>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3">{content.inAppTitle}</h2>
                <p className="text-gray-600 mb-6">{content.inAppBody}</p>
                <div className="space-y-3 mb-6">
                  {content.inAppSurveyOptions.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                        content.inAppSelectedOptions.includes(option)
                          ? 'border-current bg-opacity-10'
                          : 'border-gray-300'
                      }`}
                      style={content.inAppSelectedOptions.includes(option) ? {
                        borderColor: primaryColor,
                        backgroundColor: `${primaryColor}10`,
                        color: primaryColor
                      } : undefined}
                    >
                      {option || `Option ${index + 1}`}
                    </button>
                  ))}
                </div>
                <button 
                  className="w-full text-white py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  {content.inAppCtaText || 'Submit'}
                </button>
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />
      )}
      
      {/* Mock App Content */}
      <div className="relative h-full">
        {!content.inAppBackgroundImage && (
          <div className="p-4">
            <div className="w-2/3 h-4 bg-gray-200 rounded-full mb-3" />
            <div className="w-1/2 h-4 bg-gray-200 rounded-full" />
          </div>
        )}
        
        {/* In-App Message */}
        {renderContent()}
      </div>
    </div>
  );
};

export default InAppPreview;