import type { BrandFetchResponse, AIGeneratedContent } from '../types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function cleanJsonResponse(response: string): string {
  // Remove markdown code blocks and any leading/trailing whitespace
  return response
    .replace(/^```json\n/, '')  // Remove opening ```json
    .replace(/```$/, '')        // Remove closing ```
    .replace(/^```\n/, '')      // Remove opening ``` without json
    .trim();                    // Remove any extra whitespace
}

export async function generateMarketingContent(brandData: BrandFetchResponse): Promise<AIGeneratedContent> {
  const description = brandData.longDescription || brandData.description || '';
  
  const prompt = `Generate marketing content for ${brandData.name} across multiple channels. 
  Brand description: ${description}
  
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

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-0125-preview',
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
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    console.log('Raw AI response:', rawContent); // For debugging
    
    const cleanedContent = cleanJsonResponse(rawContent);
    console.log('Cleaned content:', cleanedContent); // For debugging
    
    const content = JSON.parse(cleanedContent);
    return content as AIGeneratedContent;
  } catch (error) {
    console.error('AI content generation error:', error);
    if (error instanceof SyntaxError) {
      console.error('JSON parsing failed. Raw content:', error);
    }
    throw error;
  }
} 