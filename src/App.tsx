import React, { useState } from 'react';
import { ChevronLeft, Video, User, MessageCircle, Search } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import DeviceFrame from './components/DeviceFrame';
import ChannelToggle from './components/ChannelToggle';
import SMSEditor from './components/channels/SMSEditor';
import PushEditor from './components/channels/PushEditor';
import CardEditor from './components/channels/CardEditor';
import InAppEditor from './components/channels/InAppEditor';
import InAppPreview from './components/channels/InAppPreview';
import { getCurrentTime } from './utils/time';
import type { MarketingContent } from './types';

// Use environment variable or fallback to local API URL
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // This will be rewritten to /.netlify/functions by the redirect rule
  : 'http://localhost:8888/.netlify/functions';

function App() {
  const [activeChannel, setActiveChannel] = useState<string>('sms');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<MarketingContent>({
    brandName: 'Your Brand',
    logoUrl: '',
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

  const handleBrandLookup = async (domain: string) => {
    console.log('Starting brand lookup for domain:', domain);
    console.log('Using API URL:', API_BASE_URL);

    if (!domain) {
      console.warn('No domain provided');
      toast.error('Please enter a domain');
      return;
    }

    setLoading(true);
    const requestUrl = `${API_BASE_URL}/brand-lookup/${encodeURIComponent(domain)}`;
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
      const data = await response.json();
      console.log('Received brand data:', data);
      
      if (!data.name && !data.logo) {
        toast.error('No brand information found. Please enter details manually.');
        return;
      }

      console.log('Updating content state with brand information...');
      setContent(prev => {
        const newContent = {
          ...prev,
          brandName: data.name || prev.brandName,
          logoUrl: data.logo || prev.logoUrl,
          // Update button colors if primary color is available
          ...(data.colors?.primary && {
            inAppCtaText: prev.inAppCtaText,
            inAppType: prev.inAppType,
          })
        };
        console.log('New content state:', newContent);
        return newContent;
      });

      // If we got a description, use it for the in-app message
      if (data.description) {
        console.log('Updating in-app body with description:', data.description);
        setContent(prev => ({
          ...prev,
          inAppBody: data.description
        }));
      }

      toast.success('Brand information updated successfully!');
    } catch (error) {
      console.error('Brand lookup error:', error);
      console.error('Full error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error('We were unable to lookup brand, please insert the brand info manually.');
    } finally {
      console.log('Brand lookup completed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
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
          },
          error: {
            style: {
              background: '#d63031',
            },
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

                    {/* Brand Response */}
                    {content.brandReply && (
                      <div className="flex justify-start">
                        <div className="bg-[#F2F2F7] text-black rounded-2xl px-4 py-2 max-w-[70%]">
                          <p className="text-base">{content.brandReply}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Input (Static) */}
                <div className="border-t border-gray-200 p-3 flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-400">
                    iMessage
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </DeviceFrame>
          )}

          {activeChannel === 'push' && (
            <DeviceFrame title="Push Notification">
              <div className="h-full relative bg-gradient-to-br from-pink-500 via-purple-500 to-teal-500">
                {/* Lock Screen Time */}
                <div className="absolute inset-0 flex flex-col items-center pt-14 text-white">
                  <div className="text-6xl font-extralight tracking-tight">{getCurrentTime()}</div>
                </div>

                {/* Notification */}
                <div className="absolute top-32 left-4 right-4">
                  <div className="bg-[rgba(255,255,255,0.8)] backdrop-blur-xl rounded-2xl overflow-hidden">
                    <div className="p-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                          {content.logoUrl ? (
                            <img src={content.logoUrl} alt="Brand" className="w-full h-full rounded object-cover" />
                          ) : (
                            <span className="text-white text-xs">LOGO</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold uppercase text-sm">{content.brandName}</span>
                            <span className="text-xs text-gray-500">10m ago</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-base font-semibold">{content.pushTitle}</div>
                      <div className="text-sm text-gray-600">{content.pushMessage}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-8 inset-x-0">
                  <div className="flex justify-between px-12">
                    <div className="w-12 h-12 bg-[rgba(255,255,255,0.2)] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.05 5A9 9 0 0023 12a9 9 0 00-7.95 7M8.95 5A9 9 0 001 12a9 9 0 007.95 7" />
                      </svg>
                    </div>
                    <div className="w-12 h-12 bg-[rgba(255,255,255,0.2)] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <span className="text-white/60 text-sm">swipe up to open</span>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
              </div>
            </DeviceFrame>
          )}

          {activeChannel === 'card' && (
            <DeviceFrame title="Content Card">
              <div className="bg-gray-100 h-full p-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img src={content.cardImage} alt="Card" className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{content.cardTitle}</h3>
                    <p className="text-gray-600 mt-2 text-sm">{content.cardDescription}</p>
                  </div>
                </div>
              </div>
            </DeviceFrame>
          )}

          {activeChannel === 'in-app' && (
            <DeviceFrame title="In-App Message">
              <InAppPreview content={content} />
            </DeviceFrame>
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