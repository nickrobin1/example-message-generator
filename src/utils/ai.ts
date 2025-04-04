import type { BrandFetchResponse, MarketingContent, IndustryDetermination } from '../types';
import { industryJourneys } from '../../netlify/functions/data';

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
  brand: { name: string; domain: string; logo: string; description: string },
  industry: string
): Promise<Partial<MarketingContent>> {
  console.log('Starting content generation...', {
    brandName: brand.name,
    industry,
    timestamp: new Date().toISOString()
  });
  
  try {
    // Find the industry journey that matches the selected industry
    const industryJourney = industryJourneys.industries.find(
      (journey) => journey.name === industry
    );

    // Set default in_pitch flags to false
    const in_pitch_flags = {
      sms_in_pitch: false,
      push_in_pitch: false,
      email_in_pitch: false,
      card_in_pitch: false,
      in_app_in_pitch: false,
      whatsapp_in_pitch: false,
      channel_order: [] as string[]
    };

    // If we found a matching industry journey, set the in_pitch flags based on the steps
    if (industryJourney) {
      const steps = industryJourney.steps;
      // Map the step names to our channel names
      const channelMap = {
        'SMS': 'sms',
        'Push': 'push',
        'Email': 'email',
        'Content Card': 'card',
        'In-App': 'in_app',
        'WhatsApp': 'whatsapp'
      } as const;

      // Set flags and build order based on steps
      in_pitch_flags.channel_order = Object.keys(steps)
        .map(step => channelMap[step as keyof typeof channelMap])
        .filter(Boolean);

      // Set individual flags and goals
      in_pitch_flags.sms_in_pitch = 'SMS' in steps;
      in_pitch_flags.push_in_pitch = 'Push' in steps;
      in_pitch_flags.email_in_pitch = 'Email' in steps;
      in_pitch_flags.card_in_pitch = 'Content Card' in steps;
      in_pitch_flags.in_app_in_pitch = 'In-App' in steps;
      in_pitch_flags.whatsapp_in_pitch = 'WhatsApp' in steps;

      // Set goals from steps
      const goals = {
        smsGoal: steps['SMS']?.Goal,
        pushGoal: steps['Push']?.Goal,
        emailGoal: steps['Email']?.Goal,
        cardGoal: steps['Content Card']?.Goal,
        inAppGoal: steps['In-App']?.Goal,
        whatsappGoal: steps['WhatsApp']?.Goal,
      };

      Object.assign(in_pitch_flags, goals);
    }

    console.log('Making API request to generate-content...');
    const response = await fetch(`${API_BASE_URL}/.netlify/functions/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brand,
        industry,
      }),
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

    // Return the generated content with the in_pitch flags
    return {
      ...data.content,
      industry: data.metadata.industry,
      useCase: data.metadata.useCase,
      generatedAt: data.metadata.generatedAt,
      ...in_pitch_flags
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