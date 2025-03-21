import React, { useState, useEffect } from 'react';
import { ChevronLeft, Video, User, MessageCircle, Search, Wand2, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import DeviceFrame from './components/DeviceFrame';
import ChannelToggle from './components/ChannelToggle';
import SMSEditor from './components/channels/SMSEditor';
import PushEditor from './components/channels/PushEditor';
import CardEditor from './components/channels/CardEditor';
import InAppEditor from './components/channels/InAppEditor';
import InAppPreview from './components/channels/InAppPreview';
import WelcomeModal from './components/WelcomeModal';
import { getCurrentTime } from './utils/time';
import { generateMarketingContent } from './utils/ai';
import type { MarketingContent, BrandFetchResponse } from './types';
import wallpaperImage from './assets/iOS wallpaper.png';
import flashlightIcon from './assets/Flashlight button.svg';
import cameraIcon from './assets/Camera button.svg';
import lockIcon from './assets/lock.svg';
import timeIcon from './assets/Time.svg';
import brazeLogoIcon from './assets/Braze Logo Icon.png';
import { brandSeeds } from './data/brandSeeds';
import FakeBrandAutocomplete from './components/FakeBrandAutocomplete';
import SMSPreview from './components/channels/SMSPreview';

// Use current origin in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin
  : 'http://localhost:8888';

function App() {
  const [activeChannel, setActiveChannel] = useState<string>('sms');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [content, setContent] = useState<MarketingContent>({
    brandName: 'Your Brand',
    logoUrl: '',
    brandDescription: '',
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
    inAppBackgroundImage: '',
    smsIcon: '',
    pushIcon: '',
    inAppInputLabel: 'Email Address',
    inAppInputPlaceholder: 'Enter your email to get updates',
    inAppSubmitButtonText: 'Sign Up'
  });

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  const handleInputChange = (field: keyof MarketingContent, value: string | string[]) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  // Function to sanitize domain before API call
  const sanitizeDomain = (url: string): string => {
    try {
      // If it looks like a URL, parse it properly
      if (url.includes('://') || url.includes('.')) {
        // Ensure we have a protocol for URL parsing
        const urlToParse = url.includes('://') ? url : `https://${url}`;
        const parsedUrl = new URL(urlToParse);
        // Get hostname and remove www. if present
        return parsedUrl.hostname.replace(/^www\./, '');
      }
      return url;
    } catch (error) {
      // If URL parsing fails, fallback to regex-based approach
      return url
        .replace(/^https?:\/\//, '') // Remove protocol
        .replace(/^www\./, '')       // Remove www
        .split('/')[0];              // Remove any paths
    }
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
    // Check if this is a test domain
    if (domain in brandSeeds) {
      const seedData = brandSeeds[domain as keyof typeof brandSeeds];
      
      setContent(prev => ({
        ...prev,
        brandName: seedData.name,
        logoUrl: seedData.logo,
        smsIcon: seedData.logo,
        pushIcon: seedData.logo,
        brandDescription: seedData.longDescription,
      }));

      showToast('Brand information updated successfully!', 'success');
      return;
    }

    setLoading(true);
    try {
      const sanitizedDomain = sanitizeDomain(domain);
      const requestUrl = `${API_BASE_URL}/.netlify/functions/brand-lookup/${encodeURIComponent(sanitizedDomain)}`;
      const response = await fetch(requestUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch brand information');
      }
      
      const data: BrandFetchResponse = await response.json();
      
      if (!data.name && !data.logo) {
        showToast('No brand information found. Please enter details manually.', 'error');
        return;
      }

      const description = data.longDescription || data.description;
      if (!description) {
        showToast('No brand description found. Please enter details manually.', 'error');
        return;
      }

      setContent(prev => ({
        ...prev,
        brandName: data.name || prev.brandName,
        logoUrl: data.logo || prev.logoUrl,
        smsIcon: data.logo || prev.smsIcon,
        pushIcon: data.logo || prev.pushIcon,
        brandDescription: description,
      }));

      showToast('Brand information updated successfully!', 'success');
    } catch (error) {
      console.error('Brand lookup error:', error);
      showToast('We were unable to lookup brand, please insert the brand info manually.', 'error');
    } finally {
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
    <div className="min-h-screen bg-[#F8F7FF]">
      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}
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
            duration: 10000,
          },
        }}
      />
      {/* Header */}
      <header className="bg-[#3D1D72] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center">
            <img 
              src={brazeLogoIcon} 
              alt="Braze" 
              className="w-8 h-8 mr-3"
            />
            <h1 className="text-2xl font-bold text-white">Preview Generator</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-[#3D1D72]">Brand Assets</h2>
            <div className="space-y-5">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Domain</label>
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="text"
                      placeholder="example.com"
                      className="flex-1 rounded-l-lg border-gray-200 focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
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
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-200 rounded-r-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
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
                <label className="block text-sm font-medium text-gray-600 mb-2">Brand Name</label>
                <FakeBrandAutocomplete
                  value={content.brandName}
                  onChange={(value) => handleInputChange('brandName', value)}
                  onSelectBrand={(brand) => {
                    setContent(prev => ({
                      ...prev,
                      brandName: brand.name,
                      logoUrl: `/src/assets/Fake Brands/${brand.image}`,
                      brandDescription: brand.description
                    }));
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={content.logoUrl}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Brand Description</label>
                <textarea
                  value={content.brandDescription}
                  onChange={(e) => handleInputChange('brandDescription', e.target.value)}
                  className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
                  rows={3}
                  placeholder="Enter brand description..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleGenerateContent}
                  disabled={aiLoading || !content.brandDescription}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#3D1D72] hover:bg-[#2D1655] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D1D72] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              <SMSPreview content={content} />
            </DeviceFrame>
          )}

          {activeChannel === 'push' && (
            <DeviceFrame title="Push Notification Preview">
              <div className="relative h-full">
                {/* Wallpaper Background */}
                <img 
                  src={wallpaperImage} 
                  alt="iOS Wallpaper" 
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Lock Icon */}
                <img
                  src={lockIcon}
                  alt="Lock"
                  className="absolute top-12 left-1/2 transform -translate-x-1/2 w-4 h-4"
                />

                {/* Time */}
                <div className="absolute inset-x-0 top-20 text-center text-white">
                  <img
                    src={timeIcon}
                    alt="9:41"
                    className="w-[72px] mx-auto"
                  />
                  <div className="text-[22px] font-normal mt-1 font-['SF_Pro_Display']">Monday, June 3</div>
                </div>

                {/* iOS Notification */}
                <div className="absolute inset-x-4 top-[180px]">
                  <div 
                    className="w-full h-[55.36px] rounded-[9px] p-[7.18px] space-y-[7.18px] font-['SF_Pro_Text']"
                    style={{ 
                      background: 'rgba(245, 245, 245, 0.3)',
                      backdropFilter: 'blur(25px)',
                      WebkitBackdropFilter: 'blur(25px)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[7.18px]">
                        {content.logoUrl ? (
                          <img 
                            src={content.logoUrl} 
                            alt={content.brandName}
                            className="w-[32px] h-[32px] rounded-[6px] object-cover"
                          />
                        ) : (
                          <div className="w-[32px] h-[32px] rounded-[6px] bg-blue-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold leading-none font-['SF_Pro_Text']">{content.brandName}</span>
                          <span className="text-[11px] text-black mt-0.5 font-['SF_Pro_Text']">{content.pushTitle}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-black font-['SF_Pro_Text']">34m ago</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Swipe Indicator */}
                <div className="absolute inset-x-0 bottom-6 flex flex-col items-center space-y-2">
                  <div className="flex justify-between w-72">
                    <img src={flashlightIcon} alt="Flashlight" className="w-12 h-12" />
                    <img src={cameraIcon} alt="Camera" className="w-12 h-12" />
                  </div>
                  <div className="text-white/60 text-sm font-['SF_Pro_Text']">swipe up to open</div>
                  <div className="w-32 h-1 bg-white rounded-full mt-2" />
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
            <DeviceFrame title="In-App Preview">
              <div className="bg-white h-full">
                <InAppPreview 
                  content={content} 
                  onContentChange={handleInputChange}
                />
              </div>
            </DeviceFrame>
          )}
        </div>
      </div>

      {/* Feedback Button */}
      <div className="fixed bottom-4 right-4">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdrw8jpZMNFU3GMj_u3gnSTh5cDtLmWmlI5fHi-eZMDLDV5DQ/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#3D1D72] text-white px-4 py-2 rounded-full hover:bg-[#2D1655] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Share Feedback</span>
        </a>
      </div>
    </div>
  );
}

export default App;