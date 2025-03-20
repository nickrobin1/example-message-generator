import { Handler } from '@netlify/functions';
import axios from 'axios';

// Helper function to get the best logo
const getBestLogo = (logos: any[]) => {
  console.log('Processing logos:', logos);
  if (!logos?.length) {
    console.log('No logos found');
    return null;
  }
  
  const primaryLogo = logos.find(logo => logo.type === 'logo');
  const logo = primaryLogo || logos[0];
  console.log('Selected logo:', logo);
  
  if (!logo.formats?.length) {
    console.log('No formats found for selected logo');
    return null;
  }
  
  const svgFormat = logo.formats.find(f => f.format === 'svg');
  const pngFormat = logo.formats.find(f => f.format === 'png');
  const selectedFormat = svgFormat || pngFormat;
  
  console.log('Selected format:', selectedFormat);
  return selectedFormat?.src || null;
};

// Helper function to get primary brand color
const getPrimaryColor = (colors: any[]) => {
  console.log('Processing colors:', colors);
  if (!colors?.length) {
    console.log('No colors found');
    return null;
  }
  
  const primary = colors.find(c => c.type === 'primary');
  const accent = colors.find(c => c.type === 'accent');
  const selectedColor = primary || accent;
  
  console.log('Selected color:', selectedColor);
  return selectedColor?.hex || null;
};

export const handler: Handler = async (event) => {
  console.log('Received request:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers
  });

  // Check for API key
  if (!process.env.BRANDFETCH_API_KEY) {
    console.error('BRANDFETCH_API_KEY not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Configuration error',
        message: 'API key not configured. Please contact the site administrator.'
      })
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    console.log('Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const domain = event.path.split('/').pop();
  console.log('Extracted domain:', domain);
  
  if (!domain) {
    console.log('No domain provided');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' })
    };
  }

  try {
    console.log('Making request to Brandfetch API...');
    const response = await axios.get(`https://api.brandfetch.io/v2/brands/${domain}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BRANDFETCH_API_KEY}`
      }
    });

    console.log('Received response from Brandfetch:', {
      status: response.status,
      headers: response.headers
    });

    const data = response.data;
    console.log('Raw Brandfetch data:', data);

    // Extract and structure brand information
    const brandData = {
      name: data.name,
      domain: data.domain,
      logo: getBestLogo(data.logos),
      colors: {
        primary: getPrimaryColor(data.colors),
        all: data.colors?.map((c: any) => ({
          hex: c.hex,
          type: c.type
        })) || []
      },
      description: data.description || '',
      longDescription: data.longDescription || data.description || ''
    };

    console.log('Processed brand data:', brandData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(brandData)
    };
  } catch (error: any) {
    console.error('Brand lookup error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Check for specific error cases
    if (error.response?.status === 404) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Brand not found',
          message: 'Could not find brand information for this domain'
        })
      };
    } else if (error.response?.status === 401) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Authentication failed',
          message: 'Invalid API key or authentication error'
        })
      };
    }
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch brand information',
        message: 'An unexpected error occurred. Please try again or enter brand details manually.'
      })
    };
  }
};