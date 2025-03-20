import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

export const handler: Handler = async (event) => {
  // Always return CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
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

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { brand } = JSON.parse(event.body || '{}');
    
    if (!brand?.description) {
      throw new Error('Brand description is required');
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a marketing copywriter. Always respond with valid JSON in this exact format:
{
  "smsMessage": "short message under 160 chars",
  "pushTitle": "attention grabbing title",
  "pushMessage": "brief push notification message",
  "cardTitle": "engaging card title",
  "cardDescription": "short card description",
  "inAppTitle": "welcoming title",
  "inAppBody": "brief body text",
  "inAppCtaText": "clear call to action"
}`
        },
        {
          role: 'user',
          content: `Generate marketing content for ${brand.name || 'this brand'}. Use this description: ${brand.description}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = completion.choices[0].message.content || '{}';
    
    try {
      // Validate that we got valid JSON back
      const parsedContent = JSON.parse(content);
      return {
        statusCode: 200,
        headers,
        body: content
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from OpenAI');
    }

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