import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { industryJourneys } from './data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Step {
  Goal: string;
  Prompt: string;
  Type?: string;
}

interface IndustryJourney {
  name: string;
  use_case: string;
  steps: {
    [key: string]: Step;
  };
}

interface IndustryJourneys {
  industries: IndustryJourney[];
}

function getIndustryJourneys(): IndustryJourneys {
  return industryJourneys;
}

export const handler: Handler = async (event) => {
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
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const { brandName, brandDescription } = JSON.parse(event.body || '{}');

    if (!brandName || !brandDescription) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Brand name and description are required' })
      };
    }

    console.log('Determining industry for:', {
      brandName,
      brandDescription,
      descriptionLength: brandDescription.length
    });

    // Get industry journeys
    const journeys = getIndustryJourneys();
    console.log('Available industries:', journeys.industries.map(j => j.name));
    
    const industryList = journeys.industries.map(j => j.name).join(', ');
    const industryExamples = journeys.industries.map(j => 
      `${j.name}:\n  Use Case: ${j.use_case}\n  Example Goals:\n${Object.entries(j.steps)
        .map(([channel, step]) => `    - ${channel}: ${step.Goal}`)
        .join('\n')}`
    ).join('\n\n');

    console.log('Formatted industry examples:', industryExamples);

    // Make the OpenAI API call
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: "system",
          content: `You are an expert at determining a company's industry and use case based on their name and description. 
          You will be provided with a list of industries and their example use cases. 
          Your task is to determine which industry and use case best matches the company, and provide a confidence score.
          If no industry matches with high confidence (>0.7), default to "Other Industries" with a confidence of 0.5.
          
          Available industries: ${industryList}
          
          Industry Details:
          ${industryExamples}
          
          IMPORTANT: Respond with ONLY raw JSON, no markdown formatting or code blocks.
          The response should be a valid JSON object in this exact format:
          {
            "industry": "string",
            "useCase": "string",
            "confidence": number (0-1)
          }`
        },
        {
          role: "user",
          content: `Brand Name: ${brandName}
          Brand Description: ${brandDescription}
          
          Determine the industry and use case for this brand. Return ONLY raw JSON.`
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    console.log('OpenAI raw response:', completion.choices[0].message?.content);

    const determination = JSON.parse(completion.choices[0].message.content || '{}');
    console.log('Parsed determination:', determination);

    // If confidence is low, default to "Other Industries"
    if (determination.confidence < 0.7) {
      console.log('Low confidence determination, defaulting to Other Industries');
      determination.industry = "Other Industries";
      determination.useCase = "General Marketing";
      determination.confidence = 0.5;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(determination)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to determine industry',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    };
  }
}; 