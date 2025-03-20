import React, { useState } from 'react';
import { ChevronLeft, Video, User, MessageCircle, Search, Wand2, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import DeviceFrame from './components/DeviceFrame';
import ChannelToggle from './components/ChannelToggle';
import SMSEditor from './components/channels/SMSEditor';
import PushEditor from './components/channels/PushEditor';
import CardEditor from './components/channels/CardEditor';
import InAppEditor from './components/channels/InAppEditor';
import InAppPreview from './components/channels/InAppPreview';
import { getCurrentTime } from './utils/time';
import { generateMarketingContent } from './utils/ai';
import type { MarketingContent, BrandFetchResponse } from './types';

// Use current origin in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin
  : 'http://localhost:8888';

function App() {
  const [activeChannel, setActiveChannel] = useState<string>('sms');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [content, setContent] = useState<MarketingContent>({
    brandName: 'Your Brand',
    logoUrl: '',
    brandDescription: '',  // New field
    smsMessage: 'Welcome! Use code WELCOME20 for 20% off your first purchase.',
    pushTitle: 'Special Offer Inside! 🎉',
    pushMessage: 'Don\'t miss out on our latest collection. Tap to explore now!',
    cardTitle: 'Summer Collection Launch',
    cardDescription: 'Discover our newest arrivals perfect for the summer season. Limited time offers available.',
    cardImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
    userReply: '',
    brandReply: '',
    inAppType: 'modal-logo',
    inAppTitle: 'Welcome to Your Brand',
    inAppBody: 'Discover our latest collection and get 20% off your first purchase.',
    inAppImage: '',
    inAppCtaText: 'Shop Now',
    inAppSurveyOptions: ['', '', '', ''],
    inAppSelectedOptions: [],
    inAppSurveyType: 'single',
    inAppBackgroundImage: ''
  });

  const handleInputChange = (field: keyof MarketingContent, value: string | string[]) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${
                  type === 'error' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      { duration: type === 'error' ? 10000 : 4000 }
    );
  };

  const handleBrandLookup = async (domain: string) => {
    console.log('Starting brand lookup for domain:', domain);
    console.log('Using API URL:', API_BASE_URL);

    if (!domain) {
      console.warn('No domain provided');
      showToast('Please enter a domain', 'error');
      return;
    }

    setLoading(true);
    const requestUrl = `${API_BASE_URL}/.netlify/functions/brand-lookup/${encodeURIComponent(domain)}`;
    console.log('Making request to:', requestUrl);

    try {
      console.log('Sending fetch request...');
      const response = await fetch(requestUrl);
      console.log('Received response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error data:', errorData);
        throw new Error(errorData.message || 'Failed to fetch brand information');
      }
      
      console.log('Parsing response JSON...');
      const data: BrandFetchResponse = await response.json();
      console.log('Received brand data:', data);
      
      if (!data.name && !data.logo) {
        showToast('No brand information found. Please enter details manually.', 'error');
        return;
      }

      // Get the best description available
      const description = data.longDescription || data.description;
      if (!description) {
        showToast('No brand description found. Please enter details manually.', 'error');
        return;
      }

      console.log('Updating content state with brand information...');
      setContent(prev => {
        const newContent = {
          ...prev,
          brandName: data.name || prev.brandName,
          logoUrl: data.logo || prev.logoUrl,
          brandDescription: description,
          // Update button colors if primary color is available
          ...(data.colors?.primary && {
            inAppCtaText: prev.inAppCtaText,
            inAppType: prev.inAppType,
          })
        };
        console.log('New content state:', newContent);
        return newContent;
      });

      showToast('Brand information updated successfully!', 'success');
    } catch (error) {
      console.error('Brand lookup error:', error);
      console.error('Full error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      showToast('We were unable to lookup brand, please insert the brand info manually.', 'error');
    } finally {
      console.log('Brand lookup completed');
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!content.brandDescription) {
      showToast('Please enter a brand description first', 'error');
      return;
    }

    setAiLoading(true);
    try {
      console.log('Starting content generation...');
      const brandData: BrandFetchResponse = {
        name: content.brandName,
        domain: '',
        logo: content.logoUrl,
        description: content.brandDescription,
        longDescription: content.brandDescription,
        colors: {
          primary: '',
          all: []
        }
      };

      console.log('Sending request with brand data:', brandData);
      const generatedContent = await generateMarketingContent(brandData);
      console.log('Received generated content:', generatedContent);
      
      setContent(prev => ({
        ...prev,
        ...generatedContent
      }));

      showToast('Marketing content generated successfully!', 'success');
    } catch (error) {
      console.error('AI content generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      showToast(errorMessage, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: 'green',
            },
            duration: 4000,
          },
          error: {
            style: {
              background: '#d63031',
            },
            duration: 10000, // Give more time to read errors
          },
        }}
      />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Braze Preview Generator</h1>
      </header>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Brand Settings</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Domain</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      placeholder="example.com"
                      className="flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleBrandLookup((e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).closest('div')?.querySelector('input');
                        if (input) handleBrandLookup(input.value);
                      }}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                <input
                  type="text"
                  value={content.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                <input
                  type="text"
                  value={content.logoUrl}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand Description</label>
                <textarea
                  value={content.brandDescription}
                  onChange={(e) => handleInputChange('brandDescription', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter brand description..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleGenerateContent}
                  disabled={aiLoading || !content.brandDescription}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Wand2 className="w-5 h-5 mr-2" />
                  )}
                  Generate Content
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ChannelToggle value={activeChannel} onValueChange={setActiveChannel} />
          </div>

          {activeChannel === 'sms' && (
            <SMSEditor content={content} onContentChange={handleInputChange} />
          )}
          {activeChannel === 'push' && (
            <PushEditor content={content} onContentChange={handleInputChange} />
          )}
          {activeChannel === 'card' && (
            <CardEditor content={content} onContentChange={handleInputChange} />
          )}
          {activeChannel === 'in-app' && (
            <InAppEditor content={content} onContentChange={handleInputChange} />
          )}
        </div>

        {/* Preview Section */}
        <div className="space-y-8">
          {activeChannel === 'sms' && (
            <DeviceFrame title="SMS Preview">
              <div className="bg-white h-full flex flex-col">
                {/* iOS Message Header */}
                <div className="bg-white border-b border-gray-200">
                  <div className="flex items-center justify-between px-4 pt-2">
                    <button className="text-[#007AFF] flex items-center">
                      <ChevronLeft className="w-5 h-5" />
                      <span>Messages</span>
                    </button>
                    <Video className="w-5 h-5 text-[#007AFF]" />
                  </div>
                  <div className="flex flex-col items-center py-2">
                    {content.logoUrl ? (
                      <img 
                        src={content.logoUrl} 
                        alt={content.brandName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="mt-1">
                      <span className="text-base font-medium">{content.brandName}</span>
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 bg-white p-4">
                  <div className="space-y-2">
                    {/* Initial Message */}
                    <div className="flex justify-start">
                      <div className="bg-[#F2F2F7] text-black rounded-2xl px-4 py-2 max-w-[70%]">
                        <p className="text-base">{content.smsMessage}</p>
                      </div>
                    </div>

                    {/* User Reply */}
                    {content.userReply && (
                      <div className="flex justify-end">
                        <div className="bg-[#007AFF] text-white rounded-2xl px-4 py-2 max-w-[70%]">
                          <p className="text-base">{content.userReply}</p>
                        </div>
                      </div>
                    )}

                    {/* Brand Reply */}
                    {content.brandReply && (
                      <div className="flex justify-start">
                        <div className="bg-[#F2F2F7] text-black rounded-2xl px-4 py-2 max-w-[70%]">
                          <p className="text-base">{content.brandReply}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DeviceFrame>
          )}

          {activeChannel === 'push' && (
            <DeviceFrame title="Push Notification Preview">
              <div className="bg-white h-full flex flex-col">
                {/* iOS Notification */}
                <div className="p-4">
                  <div className="bg-[#F2F2F7] rounded-2xl p-4">
                    <div className="flex items-start space-x-3">
                      {content.logoUrl ? (
                        <img 
                          src={content.logoUrl} 
                          alt={content.brandName}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-sm">{content.brandName}</h3>
                            <p className="text-xs text-gray-500">{getCurrentTime()}</p>
                          </div>
                        </div>
                        <h4 className="font-semibold mt-1">{content.pushTitle}</h4>
                        <p className="text-sm mt-1">{content.pushMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DeviceFrame>
          )}

          {activeChannel === 'card' && (
            <DeviceFrame title="Card Preview">
              <div className="bg-white h-full p-4">
                <div className="bg-white rounded-lg overflow-hidden shadow">
                  {content.cardImage && (
                    <img 
                      src={content.cardImage} 
                      alt={content.cardTitle}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{content.cardTitle}</h3>
                    <p className="mt-2 text-gray-600">{content.cardDescription}</p>
                  </div>
                </div>
              </div>
            </DeviceFrame>
          )}

          {activeChannel === 'in-app' && (
            <InAppPreview content={content} />
          )}
        </div>
      </div>

      {/* Feedback Button */}
      <div className="fixed bottom-4 right-4">
        <a
          href="mailto:nick.robin@braze.com"
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default App;