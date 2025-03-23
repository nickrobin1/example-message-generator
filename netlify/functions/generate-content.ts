import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const { brandName, brandDescription } = JSON.parse(event.body || '{}');

    if (!brandName || !brandDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Brand name and description are required' }),
      };
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a marketing content generator. Generate content in the following JSON format:
          {
            "smsContent": "engaging SMS message under 160 characters",
            "pushTitle": "attention-grabbing push notification title",
            "pushBody": "compelling push notification body",
            "inAppTitle": "eye-catching in-app message title",
            "inAppBody": "persuasive in-app message body",
            "inAppCta": "clear call-to-action text",
            "emailSubject": "compelling email subject line that drives opens",
            "emailHeadline": "attention-grabbing email headline",
            "emailBody": "engaging email body text with clear value proposition and persuasive content",
            "emailCta": "action-oriented button text that encourages clicks"
          }`,
        },
        {
          role: 'user',
          content: `Generate marketing content for ${brandName}. Brand description: ${brandDescription}. 
          Make the content engaging, persuasive, and aligned with the brand's voice. 
          For the email content:
          - Subject line should be attention-grabbing and create urgency
          - Headline should be compelling and highlight the main value proposition
          - Body should be concise but informative, focusing on benefits
          - CTA should be action-oriented and create FOMO`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const generatedContent = JSON.parse(
      response.choices[0].message?.content || '{}'
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(generatedContent)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: error.status || 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
}; 