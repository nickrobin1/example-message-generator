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

    const { brand, contentType = 'General Marketing' } = JSON.parse(event.body || '{}');

    if (!brand?.description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Brand description is required' })
      };
    }

    // Use long description if available, otherwise fall back to regular description
    const brandDescription = brand.longDescription || brand.description;

    // Define content type specific instructions
    const contentTypeInstructions = {
      'General Marketing': 'Focus on general brand awareness, product highlights, and value propositions.',
      'Retention': 'Focus on customer satisfaction, continued engagement, and reinforcing the value of staying with the brand.',
      'Loyalty': 'Focus on rewards, exclusive benefits, VIP treatment, and making customers feel special.',
      'Transactional': 'Focus on order confirmations, shipping updates, and account-related notifications. Keep it clear and informative.',
      'Onboarding': 'Focus on welcome messages, getting started guides, and helping users activate and understand key features.'
    };

    const response = await openai.chat.completions.create({
      // @cursor-skip
      model: 'gpt-4o-mini',
      // @cursor-end-skip
      messages: [
        {
          role: 'system',
          content: `You are a marketing copywriter specializing in ${contentType.toLowerCase()} messaging. 
          ${contentTypeInstructions[contentType as keyof typeof contentTypeInstructions]}
          
          Always respond with valid JSON in this exact format:
          {
            "whatsappMessage": "engaging WhatsApp message with emojis",
            "smsMessage": "short message under 160 chars",
            "pushMessage": "brief push notification message",
            "cardTitle": "engaging card title",
            "cardDescription": "short card description",
            "inAppTitle": "welcoming title",
            "inAppBody": "brief body text",
            "inAppCtaText": "clear call to action",
            "emailSubject": "compelling subject line",
            "emailHeadline": "short, attention-grabbing headline (max 1 line)",
            "emailBody": "concise body text focusing on key benefits (2-3 lines max)",
            "emailCta": "clear call to action (2-4 words)"
          }
          
          Keep email content especially concise:
          - Headline should be one line only
          - Body text should be 2-3 lines maximum
          - CTA should be short and action-oriented
          
          For WhatsApp messages:
          - Use emojis naturally to enhance engagement
          - Keep the tone conversational and friendly
          - Make it feel personal and interactive
          
          Ensure all content aligns with ${contentType.toLowerCase()} messaging best practices and the brand's voice.`
        },
        {
          role: 'user',
          content: `Generate ${contentType.toLowerCase()} messaging content for this brand: ${brandDescription}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message?.content || '{}';
    
    try {
      // Clean up markdown formatting if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      
      // Validate that we got valid JSON back
      const parsedContent = JSON.parse(cleanContent);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(parsedContent)
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      console.error('Parse error:', parseError);
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