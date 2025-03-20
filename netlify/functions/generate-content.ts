import { Handler, HandlerEvent } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handler: Handler = async (event: HandlerEvent) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Handle POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const { brand, model } = JSON.parse(event.body);
    
    if (!brand || !brand.description) {
      throw new Error('Brand description is required');
    }

    const prompt = `Generate marketing content for ${brand.name} across multiple channels. 
    Brand description: ${brand.description}
    
    Generate concise, engaging content for each channel with appropriate lengths:
    - SMS: Short, conversational message (max 160 chars)
    - Push: Attention-grabbing title and brief message
    - Card: Engaging title and short description
    - In-app: Welcoming title, brief body text, and clear call-to-action
    
    Format the response as a JSON object with these fields:
    {
      "smsMessage": "string",
      "pushTitle": "string",
      "pushMessage": "string",
      "cardTitle": "string",
      "cardDescription": "string",
      "inAppTitle": "string",
      "inAppBody": "string",
      "inAppCtaText": "string"
    }`;

    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a marketing copywriter specializing in creating concise, engaging content for various digital channels. Always format your responses as valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    // Parse the JSON response to ensure it's valid
    const parsedContent = JSON.parse(content);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(parsedContent),
    };
  } catch (error) {
    console.error('Error generating content:', error);
    
    return {
      statusCode: error.status || 500,
      headers,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Internal server error',
      }),
    };
  }
};

export { handler }; 