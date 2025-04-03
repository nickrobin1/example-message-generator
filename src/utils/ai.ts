import type { BrandFetchResponse, MarketingContent, IndustryDetermination } from '../types';

// Use current origin in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin
  : 'http://localhost:8888';

interface ContentResponse {
  content: {
    whatsappMessage: string;
    smsMessage: string;
    pushMessage: string;
    cardTitle: string;
    cardDescription: string;
    inAppTitle: string;
    inAppBody: string;
    inAppCtaText: string;
    inAppType?: string;
    emailSubject: string;
    emailHeadline: string;
    emailBody: string;
    emailCta: string;
  };
  metadata: {
    industry: string;
    useCase: string;
    generatedAt: string;
    model: string;
    confidence: number;
  };
}

export async function generateMarketingContent(
  brandData: BrandFetchResponse,
  industry: string
): Promise<Partial<MarketingContent>> {
  console.log('Starting content generation...', {
    brandName: brandData.name,
    industry,
    timestamp: new Date().toISOString()
  });
  
  try {
    console.log('Making API request to generate-content...');
    const response = await fetch(`${API_BASE_URL}/.netlify/functions/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brand: brandData,
        industry,
      }),
    });

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate content';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('API Error:', errorData);
      } catch (e) {
        errorMessage = `${errorMessage}: ${response.statusText}`;
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const data: ContentResponse = await response.json();
    console.log('Content generation successful:', {
      channels: Object.keys(data.content),
      metadata: data.metadata,
      timestamp: new Date().toISOString()
    });

    return {
      ...data.content,
      industry: data.metadata.industry,
      useCase: data.metadata.useCase,
      generatedAt: data.metadata.generatedAt
    };
  } catch (error) {
    console.error('Content generation failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

export async function determineIndustry(brandName: string, brandDescription: string): Promise<IndustryDetermination> {
  console.log('Determining industry for:', { brandName, brandDescription });
  
  const response = await fetch(`${API_BASE_URL}/.netlify/functions/determine-industry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      brandName,
      brandDescription,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to determine industry');
  }

  const data = await response.json();
  console.log('Industry determination result:', data);
  return data;
} 