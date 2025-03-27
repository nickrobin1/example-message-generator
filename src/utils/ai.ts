import type { BrandFetchResponse, MarketingContent, ContentType } from '../types';

// Use current origin in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin
  : 'http://localhost:8888';

export async function generateMarketingContent(
  brandData: BrandFetchResponse,
  contentType: ContentType = 'General Marketing'
): Promise<Partial<MarketingContent>> {
  console.log('Generating content with API URL:', API_BASE_URL);
  console.log('Request payload:', {
    brand: brandData,
    contentType,
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}/.netlify/functions/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brand: brandData,
        contentType,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Failed to generate content';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If parsing error response fails, use status text
        errorMessage = `${errorMessage}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Generated content:', data);

    return {
      whatsappMessage: data.whatsappMessage,
      smsMessage: data.smsMessage,
      pushMessage: data.pushMessage,
      cardTitle: data.cardTitle,
      cardDescription: data.cardDescription,
      inAppTitle: data.inAppTitle,
      inAppBody: data.inAppBody,
      inAppCtaText: data.inAppCtaText,
      emailSubject: data.emailSubject,
      emailHeadline: data.emailHeadline,
      emailBody: data.emailBody,
      emailCta: data.emailCta,
    };
  } catch (error) {
    console.error('Content generation error:', error);
    throw error;
  }
} 