import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChannelStep {
  Goal: string;
  Prompt: string;
  Type?: string;
}

interface IndustryJourney {
  name: string;
  use_case: string;
  steps: {
    [channel: string]: ChannelStep;
  };
}

interface IndustryJourneys {
  industries: Array<{
    name: string;
    use_case: string;
    steps: {
      [key: string]: ChannelStep;
    };
  }>;
}

// Cache for industry journeys
let journeyCache: IndustryJourneys | null = null;

// Default prompts if none found in journeys
const defaultPrompts = {
  whatsapp: "Create an engaging WhatsApp message with emojis",
  sms: "Write a short message under 160 characters",
  push: "Create a brief push notification message",
  card: "Write an engaging card title and description",
  inApp: "Create a welcoming in-app message with clear call to action",
  email: "Write a compelling email with subject, headline, body, and call to action"
};

function getIndustryJourneys(): IndustryJourneys {
  if (!journeyCache) {
    const journeyPath = path.join(process.cwd(), 'industry_journeys.json');
    const content = fs.readFileSync(journeyPath, 'utf-8');
    const parsed = JSON.parse(content) as IndustryJourneys;
    journeyCache = parsed;
    console.log('Loaded industry journeys:', 
      parsed.industries.map(j => `${j.name} - ${j.use_case}`));
  }
  return journeyCache as IndustryJourneys;
}

function findJourney(industry: string): IndustryJourney | undefined {
  const journeys = getIndustryJourneys();
  return journeys.industries.find(j => j.name === industry);
}

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

// Map journey in-app types to frontend types
function mapInAppType(journeyType?: string): string {
  if (!journeyType) return 'modal-logo';
  
  const typeMap: Record<string, string> = {
    'Email/Phone Capture': 'email-phone-capture',
    'Survey': 'survey',
    'Modal with Logo': 'modal-logo',
    'Modal with Image': 'modal-image',
    'Fullscreen': 'fullscreen'
  };

  return typeMap[journeyType] || 'modal-logo';
}

export const handler: Handler = async (event) => {
  // Debug request details
  console.log('Request details:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    queryStringParameters: event.queryStringParameters,
    isBase64Encoded: event.isBase64Encoded
  });

  // Debug environment variables
  console.log('Environment variables:', {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'exists' : 'missing',
    OPENAI_API_KEY_LENGTH: process.env.OPENAI_API_KEY?.length || 0,
    ALL_ENV_VARS: Object.keys(process.env)
  });

  // Always return CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'Referrer-Policy': 'no-referrer-when-downgrade',
    'Access-Control-Allow-Credentials': 'true'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No content needed for preflight
      headers,
      body: '' // Empty string instead of null
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Debug: Log available environment variables
    console.log('Available environment variables:', Object.keys(process.env));
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
    console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
    console.log('Request body:', event.body);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const { brand, industry, useCase } = JSON.parse(event.body || '{}');
    console.log('Request payload:', { brand: brand.name, industry, useCase });

    if (!brand?.description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Brand description is required' })
      };
    }

    const brandDescription = brand.longDescription || brand.description;
    console.log('Using brand description:', brandDescription);

    // Find matching industry journey
    const journey = findJourney(industry);
    console.log('Found journey:', journey ? `${journey.name} - ${journey.use_case}` : 'No matching journey');

    // Get prompts from journey or defaults
    const prompts = {
      whatsapp: journey?.steps.WhatsApp?.Prompt || defaultPrompts.whatsapp,
      sms: journey?.steps.SMS?.Prompt || defaultPrompts.sms,
      push: journey?.steps.Push?.Prompt || defaultPrompts.push,
      card: journey?.steps['Content Card']?.Prompt || defaultPrompts.card,
      inApp: journey?.steps['In-App']?.Prompt || defaultPrompts.inApp,
      email: journey?.steps.Email?.Prompt || defaultPrompts.email
    };

    // Get in-app type from journey if available
    const inAppType = journey?.steps['In-App']?.Type;
    const mappedInAppType = mapInAppType(inAppType);

    console.log('Using prompts:', prompts);
    console.log('In-App Type:', inAppType);
    console.log('Mapped In-App Type:', mappedInAppType);

    const response = await openai.chat.completions.create({
      // @cursor-skip
      model: 'gpt-4o-mini',
      // @cursor-end-skip
      messages: [
        {
          role: 'system',
          content: `You are a marketing copywriter specializing in ${industry} industry content.
          
          Generate content that follows the specific prompts while incorporating the brand's unique value proposition.
          
          Respond with ONLY a valid JSON object containing content for each channel. No markdown, no backticks.
          {
            "whatsappMessage": "string",
            "smsMessage": "string",
            "pushMessage": "string",
            "cardTitle": "string",
            "cardDescription": "string",
            "inAppTitle": "string",
            "inAppBody": "string",
            "inAppCtaText": "string",
            "inAppType": "string",
            "emailSubject": "string",
            "emailHeadline": "string",
            "emailBody": "string",
            "emailCta": "string"
          }`
        },
        {
          role: 'user',
          content: `Generate content for this ${industry} brand:
          
          Brand: ${brand.name}
          Description: ${brandDescription}
          
          Channel Requirements:
          - WhatsApp: ${prompts.whatsapp}
          - SMS: ${prompts.sms}
          - Push: ${prompts.push}
          - Content Card: ${prompts.card}
          - In-App Message: ${prompts.inApp}${inAppType ? ` (Type: ${inAppType})` : ''}
          - Email: ${prompts.email}
          
          Generate content that fulfills each channel's specific requirements while maintaining the brand's voice.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log('OpenAI raw response:', response.choices[0].message?.content);

    const content = response.choices[0].message?.content || '{}';
    const parsedContent = JSON.parse(content);

    // Add the mapped in-app type from the journey if available
    parsedContent.inAppType = mappedInAppType;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content: parsedContent,
        metadata: {
          industry: journey?.name || industry,
          useCase: journey?.use_case || 'Custom',
          generatedAt: new Date().toISOString(),
          model: 'gpt-4',
          confidence: 0.9
        }
      })
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate content',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      })
    };
  }
}; 