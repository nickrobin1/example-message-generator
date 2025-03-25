import React, { useState, useEffect } from 'react';
import { ChevronLeft, Video, User, Building2, MessageCircle, Search, Wand2, X } from 'lucide-react';
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
import type { MarketingContent, BrandFetchResponse, ContentType } from './types';
import wallpaperImage from './assets/iOS wallpaper.png';
import flashlightIcon from './assets/Flashlight button.svg';
import cameraIcon from './assets/Camera button.svg';
import lockIcon from './assets/lock.svg';
import timeIcon from './assets/Time.svg';
import brazeLogoIcon from './assets/Braze Logo Icon.png';
import { brandSeeds } from './data/brandSeeds';
import FakeBrandAutocomplete from './components/FakeBrandAutocomplete';
import SMSPreview from './components/channels/SMSPreview';
import { analytics } from './lib/analytics';
import EmailEditor from './components/channels/EmailEditor';
import EmailPreview from './components/channels/EmailPreview';
import ImageInput from './components/ImageInput';

// Use current origin in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin
  : 'http://localhost:8888';

function App() {
  const [activeChannel, setActiveChannel] = useState<string>('sms');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [content, setContent] = useState<MarketingContent>({
    brandName: '',
    logoUrl: '',
    brandDescription: '',
    brandColor: '#3D1D72',
    contentType: 'General Marketing',
    smsMessage: 'Your message will appear here',
    smsIcon: '',
    pushMessage: 'Your message will appear here',
    pushIcon: '',
    cardTitle: 'Card Title',
    cardDescription: 'Card description goes here',
    cardImage: '',
    emailSubject: '',
    emailHeadline: '',
    emailBody: '',
    emailCta: '',
    emailImage: '',
    inAppType: 'modal-logo',
    inAppTitle: '',
    inAppBody: '',
    inAppCtaText: '',
    inAppImage: '',
    inAppBackgroundImage: '',
    inAppSurveyOptions: [],
    inAppSelectedOptions: [],
    inAppSurveyType: 'single',
    inAppInputLabel: '',
    inAppInputPlaceholder: '',
    inAppSubmitButtonText: '',
    userReply: '',
    brandReply: '',
  });
  const [shouldGenerateContent, setShouldGenerateContent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  useEffect(() => {
    if (shouldGenerateContent && content.brandDescription) {
      handleGenerateContent();
      setShouldGenerateContent(false);
    }
  }, [content.brandDescription, shouldGenerateContent]);

  const handleInputChange = (field: keyof MarketingContent, value: string | string[]) => {
    setContent(prev => {
      const updates = { [field]: value };
      
      // If logo URL is changed, update SMS and Push icons as well
      if (field === 'logoUrl') {
        updates.smsIcon = value;
        updates.pushIcon = value;
      }
      
      return { ...prev, ...updates };
    });
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

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
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
                  type === 'error' ? 'text-red-600' : 
                  type === 'warning' ? 'text-yellow-600' : 
                  'text-green-600'
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
    if (!domain.trim()) {
      showToast('Please enter a domain name', 'error');
      return;
    }

    // Track the brand lookup attempt
    analytics.trackBrandLookup(domain);

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
      setShouldGenerateContent(true);
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
        const errorMessage = 'No brand information found. Please enter details manually.';
        showToast(errorMessage, 'error');
        analytics.trackError('brand_lookup_failed', errorMessage, {
          domain,
          reason: 'no_brand_info',
          response: data
        });
        return;
      }

      const description = data.longDescription || data.description;
      if (!description) {
        const errorMessage = 'No brand description found. Please enter details manually.';
        showToast(errorMessage, 'error');
        analytics.trackError('brand_lookup_failed', errorMessage, {
          domain,
          reason: 'no_description',
          response: data
        });
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
      setShouldGenerateContent(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch brand information';
      console.error('Brand lookup error:', error);
      showToast('We were unable to lookup brand, please insert the brand info manually.', 'error');
      analytics.trackError('brand_lookup_failed', errorMessage, {
        domain,
        reason: 'api_error',
        status: error instanceof Error && 'status' in error ? error.status : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    setAiLoading(true);
    setError(null);

    try {
      const generatedContent = await generateMarketingContent({
        name: content.brandName,
        domain: '',
        logo: content.logoUrl,
        description: content.brandDescription
      }, content.contentType);

      setContent(prev => ({
        ...prev,
        ...generatedContent
      }));

      setHasGeneratedContent(true);
      analytics.trackGenerateClick();
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      analytics.trackError('content_generation_failed', errorMessage, {
        brandName: content.brandName,
        contentType: content.contentType,
        hasDescription: !!content.brandDescription,
        descriptionLength: content.brandDescription.length
      });
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
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-[15px] font-semibold text-gray-700">Auto Populate by Domain</label>
                <div className="flex rounded-lg shadow-sm">
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 rounded-l-lg border-gray-200 focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleBrandLookup(domainInput);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleBrandLookup(domainInput)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-l-0 border-gray-200 rounded-r-lg bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-white pr-3 text-[15px] font-semibold text-gray-700">Manually Enter Brand Info</span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Brand Name</label>
                  <FakeBrandAutocomplete
                    value={content.brandName}
                    onChange={(value) => handleInputChange('brandName', value)}
                    onSelectBrand={(brand) => {
                      analytics.trackBrandLookup(brand.name);
                      setContent(prev => ({
                        ...prev,
                        brandName: brand.name,
                        logoUrl: `/src/assets/Fake Brands/${brand.image}`,
                        brandDescription: brand.description
                      }));
                    }}
                  />
                </div>
                <ImageInput
                  value={content.logoUrl}
                  onChange={(value) => handleInputChange('logoUrl', value)}
                  label="Logo"
                  placeholder="https://example.com/logo.png"
                />
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
                <div className="flex justify-end gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Content Type</label>
                    <div className="relative">
                      <select
                        value={content.contentType}
                        onChange={(e) => handleInputChange('contentType', e.target.value as ContentType)}
                        className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm bg-white pr-10 py-2 appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                      >
                        <option value="General Marketing">General Marketing</option>
                        <option value="Retention">Retention</option>
                        <option value="Loyalty">Loyalty</option>
                        <option value="Transactional">Transactional</option>
                        <option value="Onboarding">Onboarding</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateContent}
                    disabled={aiLoading || !content.brandDescription}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#3D1D72] hover:bg-[#2D1655] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D1D72] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {aiLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating Content
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        {hasGeneratedContent ? 'Regenerate Content' : 'Generate Content'}
                      </>
                    )}
                  </button>
                </div>
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
          {activeChannel === 'email' && (
            <EmailEditor content={content} onContentChange={handleInputChange} />
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
            <DeviceFrame title="SMS Preview" content={content}>
              <SMSPreview content={content} />
            </DeviceFrame>
          )}

          {activeChannel === 'push' && (
            <DeviceFrame title="Push Notification Preview" content={content}>
              <div className="relative h-full">
                {/* Gradient Background */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background: `
                      radial-gradient(circle at 70% 20%, #FF6B00 0%, transparent 50%),
                      radial-gradient(circle at 20% 40%, #FFD600 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, #FF4D6B 0%, transparent 50%),
                      radial-gradient(circle at 40% 90%, #FF2D87 0%, transparent 50%),
                      linear-gradient(135deg, #FFFFFF 0%, #FFF5E6 100%)
                    `
                  }}
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
                  <div className="text-[22px] font-normal mt-1 ios-display">Monday, June 3</div>
                </div>

                {/* iOS Notification */}
                <div className="absolute inset-x-4 top-[180px]">
                  <div 
                    className="w-full rounded-[16px] p-[14px] ios-font"
                    style={{ 
                      background: 'rgba(245, 245, 245, 0.3)',
                      backdropFilter: 'blur(25px)',
                      WebkitBackdropFilter: 'blur(25px)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {content.logoUrl ? (
                          <div className="w-[48px] h-[48px] rounded-[12px] bg-white flex items-center justify-center p-2 flex-shrink-0">
                            <img 
                              src={content.logoUrl} 
                              alt={content.brandName}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-[48px] h-[48px] rounded-[12px] bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <span className="text-[15px] font-semibold leading-none">{content.brandName || '{{Brand Name}}'}</span>
                          <p className="text-[15px] leading-[1.2] text-black">
                            {content.pushMessage || 'Your message will appear here'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[13px] text-black/60 whitespace-nowrap flex-shrink-0">34m ago</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Swipe Indicator */}
                <div className="absolute inset-x-0 bottom-6 flex flex-col items-center space-y-2">
                  <div className="flex justify-between w-72">
                    <img src={flashlightIcon} alt="Flashlight" className="w-12 h-12" />
                    <img src={cameraIcon} alt="Camera" className="w-12 h-12" />
                  </div>
                  <div className="text-white/60 text-sm ios-font mt-4">swipe up to open</div>
                  <div className="w-32 h-1 bg-white rounded-full mt-2" />
                </div>
              </div>
            </DeviceFrame>
          )}

          {activeChannel === 'email' && (
            <DeviceFrame title="Email Preview" content={content}>
              <EmailPreview content={content} />
            </DeviceFrame>
          )}

          {activeChannel === 'card' && (
            <DeviceFrame title="Card Preview" content={content}>
              <div className="bg-white h-full p-4">
                <div className="bg-white rounded-lg overflow-hidden shadow">
                  {content.cardImage ? (
                    <img 
                      src={content.cardImage} 
                      alt={content.cardTitle}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 mx-auto mb-2 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-400">Add an image URL to preview</p>
                      </div>
                    </div>
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
            <DeviceFrame title="In-App Preview" content={content}>
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
          onClick={() => analytics.trackFeedbackSubmit('positive')}
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