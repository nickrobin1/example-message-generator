import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Video, Building2, MessageCircle, Search, X, XCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { PostHogProvider } from 'posthog-js/react';
import { posthog } from './lib/posthog';
import DeviceFrame from './components/DeviceFrame';
import ChannelToggle from './components/ChannelToggle';
import SMSEditor from './components/channels/SMSEditor';
import PushEditor from './components/channels/PushEditor';
import CardEditor from './components/channels/CardEditor';
import InAppEditor from './components/channels/InAppEditor';
import InAppPreview from './components/channels/InAppPreview';
import WelcomeModal from './components/WelcomeModal';
import { generateMarketingContent, determineIndustry } from './utils/ai';
import type { MarketingContent, BrandFetchResponse } from './types';
import flashlightIcon from './assets/Flashlight button.svg';
import cameraIcon from './assets/Camera button.svg';
import lockIcon from './assets/lock.svg';
import timeIcon from './assets/Time.svg';
import brazeLogoIcon from './assets/Braze Logo Icon.png';
import { brandSeeds } from './data/brandSeeds';
import SMSPreview from './components/channels/SMSPreview';
import { analytics } from './lib/analytics';
import EmailEditor from './components/channels/EmailEditor';
import EmailPreview from './components/channels/EmailPreview';
import ImageInput from './components/ImageInput';
import ColorPicker from './components/ColorPicker';
import { extractDominantColor } from './utils/color';
import WhatsAppEditor from './components/channels/WhatsAppEditor';
import WhatsAppPreview from './components/channels/WhatsAppPreview';
import { CardPreview } from './components/channels/CardPreview';
import PitchViewExport from './components/PitchViewExport';

// Use current origin in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin
  : 'http://localhost:8888';

function App() {
  const [activeChannel, setActiveChannel] = useState<string>('sms');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showVideoDemo, setShowVideoDemo] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const domainInputRef = useRef<HTMLInputElement>(null);
  const [isPitchModeEnabled, setIsPitchModeEnabled] = useState(false);
  const [content, setContent] = useState<MarketingContent>({
    brandName: '',
    brandDescription: '',
    brandColor: '#3D1D72',
    logoUrl: '',
    smsIcon: '',
    pushIcon: '',
    whatsappIcon: '',
    emailImage: '',
    cardImage: '',
    inAppImage: '',
    industry: '',
    useCase: '',
    whatsappMessage: 'Hey there! 👋 Check out our latest offers just for you. Click here to explore more.',
    smsMessage: 'Check out our latest offers! Click here to explore more.',
    pushMessage: 'New offers waiting for you! Tap to explore.',
    cardTitle: 'Special Offers',
    cardDescription: 'Check out our latest deals and promotions.',
    inAppTitle: 'Welcome!',
    inAppBody: 'We\'re glad you\'re here. Check out our latest offers.',
    inAppCtaText: 'Explore Now',
    inAppType: 'modal-logo',
    inAppSurveyOptions: [],
    inAppSelectedOptions: [],
    inAppInputLabel: 'Email',
    inAppInputPlaceholder: 'Enter your email',
    emailSubject: 'Special offers just for you',
    emailHeadline: 'Check out our latest deals',
    emailBody: 'We\'ve got some amazing offers waiting for you. Click below to explore.',
    emailCta: 'Shop Now'
  });
  const [shouldGenerateContent, setShouldGenerateContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'single' | 'pitch'>('single');
  const [processToastId, setProcessToastId] = useState<string | null>(null);

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

  useEffect(() => {
    // Check if pitch mode is enabled via feature flag
    const checkPitchMode = () => {
      const isEnabled = posthog.isFeatureEnabled('pitch-mode') || false;
      setIsPitchModeEnabled(isEnabled);
    };

    // Check immediately
    checkPitchMode();

    // Subscribe to feature flag changes
    const unsubscribe = posthog.onFeatureFlags(() => {
      checkPitchMode();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleInputChange = async (field: keyof MarketingContent, value: string | string[]) => {
    setContent(prev => {
      const updates = { [field]: value };
      
      // If logo URL is changed, update all channel icons
      if (field === 'logoUrl') {
        updates.smsIcon = value;
        updates.pushIcon = value;
        updates.whatsappIcon = value;
        
        // Extract color from the logo
        if (typeof value === 'string' && value) {
          extractDominantColor(value)
            .then(color => {
              setContent(prev => ({ ...prev, brandColor: color }));
            })
            .catch(error => {
              console.error('Failed to extract color from logo:', error);
              // Keep the default color if extraction fails
            });
        }
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

  const showToast = (message: string, type: 'success' | 'error' | 'warning', id?: string) => {
    const toastId = id || toast.custom(
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

    if (id) {
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
                  <p className="text-sm font-medium text-gray-900">
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
        { id, duration: type === 'error' ? 10000 : 4000 }
      );
    }

    return toastId;
  };

  const handleBrandLookup = async (domain: string) => {
    if (!domain.trim()) {
      showToast('Please enter a domain name', 'error');
      return;
    }

    // Track the brand lookup attempt
    analytics.trackBrandLookup(domain);

    // Create or update the process toast
    const toastId = processToastId || showToast('Looking up brand...', 'success');
    setProcessToastId(toastId);

    setLoading(true);
    setError(null);
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
        showToast(errorMessage, 'error', toastId);
        setIsManualEntryOpen(true);
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
        showToast(errorMessage, 'error', toastId);
        setIsManualEntryOpen(true);
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
        whatsappIcon: data.logo || prev.whatsappIcon,
        brandDescription: description,
        brandColor: data.colors?.primary || '#3D1D72',
        emailImage: data.contentImage || prev.emailImage,
        cardImage: data.contentImage || prev.cardImage,
        inAppImage: data.contentImage || prev.inAppImage
      }));

      // Determine industry after successful brand lookup
      try {
        const industryDetermination = await determineIndustry(data.name || '', description);
        setContent(prev => ({
          ...prev,
          industry: industryDetermination.industry,
          useCase: industryDetermination.useCase
        }));
      } catch (error) {
        console.error('Failed to determine industry:', error);
        // Default to "Other Industries" if determination fails
        setContent(prev => ({
          ...prev,
          industry: 'Other Industries',
          useCase: 'General Marketing'
        }));
      }

      // Extract color from the logo if we got one
      if (data.logo) {
        extractDominantColor(data.logo)
          .then(color => {
            setContent(prev => ({ ...prev, brandColor: color }));
          })
          .catch(error => {
            console.error('Failed to extract color from logo:', error);
            // Keep the color from Brand Fetch API if extraction fails
          });
      }

      showToast('Brand information updated successfully!', 'success', toastId);
      setIsManualEntryOpen(true);
      setShouldGenerateContent(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch brand information';
      console.error('Brand lookup error:', error);
      showToast('We were unable to lookup brand, please insert the brand info manually.', 'error', toastId);
      setIsManualEntryOpen(true);
      analytics.trackError('brand_lookup_failed', errorMessage, {
        domain,
        reason: 'api_error',
        status: error instanceof Error && 'status' in error ? error.status : undefined
      });
    } finally {
      setLoading(false);
      setProcessToastId(null);
    }
  };

  const handleGenerateContent = async () => {
    setAiLoading(true);
    setError(null);
    
    // Create or update the process toast
    const toastId = processToastId || showToast('Generating content...', 'success');
    setProcessToastId(toastId);

    try {
      const generatedContent = await generateMarketingContent(
        {
          name: content.brandName,
          domain: '',
          logo: content.logoUrl,
          description: content.brandDescription
        },
        content.industry
      );

      setContent(prev => ({
        ...prev,
        ...generatedContent
      }));

      analytics.trackGenerateClick();
      showToast('Content generated successfully!', 'success', toastId);
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      setError(errorMessage);
      showToast(errorMessage, 'error', toastId);
      analytics.trackError('content_generation_failed', errorMessage, {
        brandName: content.brandName,
        industry: content.industry,
        hasDescription: !!content.brandDescription,
        descriptionLength: content.brandDescription.length
      });
    } finally {
      setAiLoading(false);
      setProcessToastId(null);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    // Focus the domain input after a short delay to ensure the modal transition is complete
    setTimeout(() => {
      domainInputRef.current?.focus();
    }, 100);
  };

  return (
    <PostHogProvider client={posthog}>
      <div className="min-h-screen bg-[#F8F7FF]">
        {showWelcomeModal && (
          <WelcomeModal onClose={handleWelcomeClose} />
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
          <div 
            className={`space-y-6 transition-all duration-500 ease-in-out ${
              previewMode === 'pitch' 
                ? 'lg:translate-x-[-100%] lg:opacity-0 lg:absolute' 
                : 'lg:translate-x-0 lg:opacity-100 lg:relative'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-2 text-[#3D1D72]">Brand Assets</h2>
              <p className="text-gray-400 text-sm font-light mb-6">Enter a domain name to automatically generate some example messages, or manually enter brand info below:</p>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[15px] font-semibold text-gray-700">Auto Populate by Domain</label>
                  <div className="relative">
                    <input
                      type="text"
                      ref={domainInputRef}
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="e.g uniqlo.com"
                      className="w-full pl-4 pr-12 py-3 rounded-full border-gray-200 focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm shadow-sm"
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
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setIsManualEntryOpen(!isManualEntryOpen)}
                  className="w-full flex items-center justify-between py-3 text-left"
                >
                  <div className="relative flex items-center">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <span className="relative bg-white pr-3 text-[15px] font-semibold text-gray-700">
                      Manually Enter Brand Info
                    </span>
                  </div>
                  <ChevronLeft 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isManualEntryOpen ? 'rotate-90' : '-rotate-90'}`} 
                  />
                </button>

                {isManualEntryOpen && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Brand Name</label>
                        <input
                          type="text"
                          value={content.brandName}
                          onChange={(e) => handleInputChange('brandName', e.target.value)}
                          className="w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Industry</label>
                        <select
                          value={content.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className="w-full rounded-lg border-gray-200 shadow-sm focus:border-[#3D1D72] focus:ring-[#3D1D72] text-sm"
                        >
                          <option value="">Select an industry</option>
                          <option value="Retail & Consumer Goods">Retail & Consumer Goods</option>
                          <option value="Media & Entertainment">Media & Entertainment</option>
                          <option value="Restaurants & On-Demand">Restaurants & On-Demand</option>
                          <option value="Financial Services">Financial Services</option>
                          <option value="Travel & Hospitality">Travel & Hospitality</option>
                          <option value="Telecommunications">Telecommunications</option>
                          <option value="Education">Education</option>
                          <option value="Other Industries">Other Industries</option>
                          <option value="Gaming">Gaming</option>
                          <option value="Insurance">Insurance</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-x-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Logo</label>
                        <ImageInput
                          value={content.logoUrl}
                          onChange={(value) => handleInputChange('logoUrl', value)}
                          label=""
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Color</label>
                        <ColorPicker
                          color={content.brandColor}
                          onChange={(color) => handleInputChange('brandColor', color)}
                        />
                      </div>
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
                        disabled={!content.brandDescription || !content.industry || aiLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#3D1D72] hover:bg-[#2D1655] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3D1D72] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {aiLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          'Generate Content'
                        )}
                      </button>
                    </div>

                    {error && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>{error}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
            {activeChannel === 'whatsapp' && (
              <WhatsAppEditor
                content={content}
                onContentChange={handleInputChange}
              />
            )}
          </div>

          {/* Preview Section - Reverted to original structure */}
          <div 
            className={`space-y-8 transition-all duration-500 ease-in-out ${
              previewMode === 'pitch' 
                ? 'lg:col-span-2' 
                : 'lg:col-span-1'
            }`}
          >
            {/* Preview Mode Toggle */}
            {isPitchModeEnabled && (
              <div className="flex justify-center">
                <div className="inline-flex p-1 space-x-1 bg-white rounded-lg shadow-sm">
                  <button
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      previewMode === 'single'
                        ? 'bg-[#3D1D72] text-white'
                        : 'text-gray-600 hover:text-[#3D1D72] hover:bg-gray-100'
                    }`}
                    onClick={() => setPreviewMode('single')}
                  >
                    <span>Single</span>
                  </button>
                  <button
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      previewMode === 'pitch'
                        ? 'bg-[#3D1D72] text-white'
                        : 'text-gray-600 hover:text-[#3D1D72] hover:bg-gray-100'
                    }`}
                    onClick={() => setPreviewMode('pitch')}
                  >
                    <span>Pitch View</span>
                  </button>
                </div>
              </div>
            )}

            {previewMode === 'pitch' ? (
              <PitchViewExport content={content}>
                {!content.brandName ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-[#3D1D72] mb-2">No Brand Selected</h3>
                      <p className="text-gray-600">Search or manually enter a brand to auto generate a pitch</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-around items-start gap-4 h-full">
                    {content.channel_order?.map(channel => {
                      switch (channel) {
                        case 'sms':
                          return content.sms_in_pitch && (
                            <div key="sms" className="flex flex-col items-center flex-1">
                              <h3 className="text-2xl font-bold text-[#3D1D72] mb-4 text-center min-h-[64px] flex items-center justify-center">{content.smsGoal || 'SMS'}</h3>
                              <div className="transform scale-65 origin-top">
                                <DeviceFrame title={null} content={content} hideExport isLoading={aiLoading}>
                                  <SMSPreview content={content} />
                                </DeviceFrame>
                              </div>
                            </div>
                          );
                        case 'push':
                          return content.push_in_pitch && (
                            <div key="push" className="flex flex-col items-center flex-1">
                              <h3 className="text-2xl font-bold text-[#3D1D72] mb-4 text-center min-h-[64px] flex items-center justify-center">{content.pushGoal || 'Push Notification'}</h3>
                              <div className="transform scale-65 origin-top">
                                <DeviceFrame title={null} content={content} hideExport isLoading={aiLoading}>
                                  <div className="relative h-full">
                                    {/* Gradient Background (z-0) */}
                                    <div 
                                      className="absolute inset-0 w-full h-full z-0"
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

                                    {/* Foreground Content Container (z-10, flex) */}
                                    <div className="relative z-10 h-full flex flex-col text-white">
                                      {/* Top Section: Lock & Time */}
                                      <div className="flex-shrink-0 pt-10 pb-4 px-4">
                                        <img
                                          src={lockIcon}
                                          alt="Lock"
                                          className="mx-auto w-4 h-4 mb-2"
                                        />
                                        <div className="text-center">
                                          <img
                                            src={timeIcon}
                                            alt="9:41"
                                            className="w-[72px] mx-auto"
                                          />
                                          <div className="text-[22px] font-normal mt-1 ios-display">Monday, June 3</div>
                                        </div>
                                      </div>

                                      {/* Middle Section: Notification */}
                                      <div className="flex-1 flex items-start justify-center px-4 pt-4">
                                        <div 
                                          className="w-full max-w-xs rounded-[16px] p-[14px] ios-font"
                                          style={{ 
                                            background: 'rgba(245, 245, 245, 0.3)',
                                            backdropFilter: 'blur(25px)',
                                            WebkitBackdropFilter: 'blur(25px)',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                                          }}
                                        >
                                          {/* Notification inner content: Change to relative, timestamp absolute */}
                                          <div className="relative flex items-start gap-3">
                                            {/* Left Side: Icon + Text (Takes full width now) */}
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
                                                <span className="text-[15px] font-semibold leading-none text-black">{content.brandName || '{{Brand Name}}'}</span>
                                                <p className="text-[15px] leading-[1.2] text-black">
                                                  {content.pushMessage || 'Your message will appear here'}
                                                </p>
                                              </div>
                                            </div>
                                            {/* Right Side: Timestamp (Absolute position) */}
                                            <span className="absolute top-0 right-0 text-[13px] text-black/60 whitespace-nowrap flex-shrink-0">34m ago</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Bottom Section: Buttons & Swipe */}
                                      <div className="flex-shrink-0 pb-6 px-4">
                                        <div className="flex justify-between w-full max-w-[288px] mx-auto mb-2">
                                          <img src={flashlightIcon} alt="Flashlight" className="w-12 h-12" />
                                          <img src={cameraIcon} alt="Camera" className="w-12 h-12" />
                                        </div>
                                        <div className="text-white/60 text-sm ios-font text-center mb-2">swipe up to open</div>
                                        <div className="w-32 h-1 bg-white rounded-full mx-auto" />
                                      </div>
                                    </div>
                                  </div>
                                </DeviceFrame>
                              </div>
                            </div>
                          );
                        case 'email':
                          return content.email_in_pitch && (
                            <div key="email" className="flex flex-col items-center flex-1">
                              <h3 className="text-2xl font-bold text-[#3D1D72] mb-4 text-center min-h-[64px] flex items-center justify-center">{content.emailGoal || 'Email'}</h3>
                              <div className="transform scale-65 origin-top">
                                <DeviceFrame title={null} content={content} hideExport isLoading={aiLoading}>
                                  <EmailPreview content={content} />
                                </DeviceFrame>
                              </div>
                            </div>
                          );
                        case 'card':
                          return content.card_in_pitch && (
                            <div key="card" className="flex flex-col items-center flex-1">
                              <h3 className="text-2xl font-bold text-[#3D1D72] mb-4 text-center min-h-[64px] flex items-center justify-center">{content.cardGoal || 'Card'}</h3>
                              <div className="transform scale-65 origin-top">
                                <DeviceFrame title={null} content={content} hideExport isLoading={aiLoading}>
                                  <div className="flex items-center justify-center h-full bg-[#F8F6FF] p-4">
                                    <CardPreview content={content} />
                                  </div>
                                </DeviceFrame>
                              </div>
                            </div>
                          );
                        case 'in_app':
                          return content.in_app_in_pitch && (
                            <div key="in_app" className="flex flex-col items-center flex-1">
                              <h3 className="text-2xl font-bold text-[#3D1D72] mb-4 text-center min-h-[64px] flex items-center justify-center">{content.inAppGoal || 'In-App'}</h3>
                              <div className="transform scale-65 origin-top">
                                <DeviceFrame title={null} content={content} hideExport isLoading={aiLoading}>
                                  <div className="bg-white h-full">
                                    <InAppPreview 
                                      content={content} 
                                      onContentChange={handleInputChange}
                                    />
                                  </div>
                                </DeviceFrame>
                              </div>
                            </div>
                          );
                        case 'whatsapp':
                          return content.whatsapp_in_pitch && (
                            <div key="whatsapp" className="flex flex-col items-center flex-1">
                              <h3 className="text-2xl font-bold text-[#3D1D72] mb-4 text-center min-h-[64px] flex items-center justify-center">{content.whatsappGoal || 'WhatsApp'}</h3>
                              <div className="transform scale-65 origin-top">
                                <DeviceFrame title={null} content={content} hideExport isLoading={aiLoading}>
                                  <WhatsAppPreview content={content} />
                                </DeviceFrame>
                              </div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                )}
              </PitchViewExport>
            ) : (
              <>
                {activeChannel === 'sms' && (
                  <DeviceFrame title={<h2 className="text-xl font-semibold text-[#3D1D72]">SMS Preview</h2>} content={content} isLoading={aiLoading}>
                    <SMSPreview content={content} />
                  </DeviceFrame>
                )}
                {activeChannel === 'push' && (
                  <DeviceFrame title={<h2 className="text-xl font-semibold text-[#3D1D72]">Push Preview</h2>} content={content} isLoading={aiLoading}>
                    {/* Refactored Push Preview Structure (Single View) */}
                    <div className="relative h-full">
                      {/* Gradient Background (z-0) */}
                      <div 
                        className="absolute inset-0 w-full h-full z-0"
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

                      {/* Foreground Content Container (z-10, flex) */}
                      <div className="relative z-10 h-full flex flex-col text-white">
                        {/* Top Section: Lock & Time */}
                        <div className="flex-shrink-0 pt-10 pb-4 px-4">
                          <img
                            src={lockIcon}
                            alt="Lock"
                            className="mx-auto w-4 h-4 mb-2"
                          />
                          <div className="text-center">
                            <img
                              src={timeIcon}
                              alt="9:41"
                              className="w-[72px] mx-auto"
                            />
                            <div className="text-[22px] font-normal mt-1 ios-display">Monday, June 3</div>
                          </div>
                        </div>

                        {/* Middle Section: Notification */}
                        <div className="flex-1 flex items-start justify-center px-4 pt-4">
                          <div 
                            className="w-full max-w-xs rounded-[16px] p-[14px] ios-font"
                            style={{ 
                              background: 'rgba(245, 245, 245, 0.3)',
                              backdropFilter: 'blur(25px)',
                              WebkitBackdropFilter: 'blur(25px)',
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {/* Notification inner content: Change to relative, timestamp absolute */}
                            <div className="relative flex items-start gap-3">
                              {/* Left Side: Icon + Text (Takes full width now) */}
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
                                  <span className="text-[15px] font-semibold leading-none text-black">{content.brandName || '{{Brand Name}}'}</span>
                                  <p className="text-[15px] leading-[1.2] text-black">
                                    {content.pushMessage || 'Your message will appear here'}
                                  </p>
                                </div>
                              </div>
                              {/* Right Side: Timestamp (Absolute position) */}
                              <span className="absolute top-0 right-0 text-[13px] text-black/60 whitespace-nowrap flex-shrink-0">34m ago</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Bottom Section: Buttons & Swipe */}
                        <div className="flex-shrink-0 pb-6 px-4">
                          <div className="flex justify-between w-full max-w-[288px] mx-auto mb-2">
                            <img src={flashlightIcon} alt="Flashlight" className="w-12 h-12" />
                            <img src={cameraIcon} alt="Camera" className="w-12 h-12" />
                          </div>
                          <div className="text-white/60 text-sm ios-font text-center mb-2">swipe up to open</div>
                          <div className="w-32 h-1 bg-white rounded-full mx-auto" />
                        </div>
                      </div>
                    </div>
                  </DeviceFrame>
                )}
                {activeChannel === 'email' && (
                  <DeviceFrame title={<h2 className="text-xl font-semibold text-[#3D1D72]">Email Preview</h2>} content={content} isLoading={aiLoading}>
                    <EmailPreview content={content} />
                  </DeviceFrame>
                )}
                {activeChannel === 'card' && (
                  <DeviceFrame title={<h2 className="text-xl font-semibold text-[#3D1D72]">Card Preview</h2>} content={content} isLoading={aiLoading}>
                    <div className="flex items-center justify-center h-full bg-[#F8F6FF] p-4">
                      <CardPreview content={content} />
                    </div>
                  </DeviceFrame>
                )}
                {activeChannel === 'in-app' && (
                  <DeviceFrame title={<h2 className="text-xl font-semibold text-[#3D1D72]">In-App Preview</h2>} content={content} isLoading={aiLoading}>
                    <div className="bg-white h-full">
                      <InAppPreview 
                        content={content} 
                        onContentChange={handleInputChange}
                      />
                    </div>
                  </DeviceFrame>
                )}
                {activeChannel === 'whatsapp' && (
                  <DeviceFrame title={<h2 className="text-xl font-semibold text-[#3D1D72]">WhatsApp Preview</h2>} content={content} isLoading={aiLoading}>
                    <WhatsAppPreview content={content} />
                  </DeviceFrame>
                )}
              </>
            )}
          </div>
        </div>

        {/* Feedback and Demo Buttons */}
        <div className="fixed bottom-4 right-4 flex gap-2">
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
          {posthog?.isFeatureEnabled('video-demo') && (
            <button
              onClick={() => {
                setShowVideoDemo(!showVideoDemo);
                analytics.track('demo_video_click', { action: !showVideoDemo ? 'open' : 'close' });
              }}
              className="flex items-center gap-2 bg-[#3D1D72] text-white px-4 py-2 rounded-full hover:bg-[#2D1655] transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Demo</span>
            </button>
          )}
        </div>

        {/* Video Demo Modal */}
        {showVideoDemo && posthog?.isFeatureEnabled('video-demo') && (
          <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-lg p-4 w-[400px]">
            <button
              onClick={() => setShowVideoDemo(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative overflow-hidden aspect-[1/1]">
              <iframe
                src="https://share.synthesia.io/embeds/videos/609fbd16-2cf2-4549-88b3-0cdf2f8953e8"
                loading="lazy"
                title="Braze Preview Demo"
                allowFullScreen
                allow="encrypted-media; fullscreen;"
                className="absolute w-full h-full top-0 left-0 border-none p-0 m-0 overflow-hidden"
              />
            </div>
          </div>
        )}
      </div>
    </PostHogProvider>
  );
}

export default App;