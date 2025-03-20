import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const BRANDFETCH_API_KEY = process.env.BRANDFETCH_API_KEY;

// Helper function to get the best logo
const getBestLogo = (logos) => {
  if (!logos || !logos.length) return null;
  
  // Prefer primary logos over icons
  const primaryLogo = logos.find(logo => logo.type === 'logo');
  const logo = primaryLogo || logos[0];
  
  // Get the best format (prefer SVG, then PNG)
  if (!logo.formats || !logo.formats.length) return null;
  
  const svgFormat = logo.formats.find(f => f.format === 'svg');
  const pngFormat = logo.formats.find(f => f.format === 'png');
  
  return (svgFormat || pngFormat)?.src || null;
};

// Helper function to get primary brand color
const getPrimaryColor = (colors) => {
  if (!colors || !colors.length) return null;
  
  // Prefer primary colors, then accent colors
  const primary = colors.find(c => c.type === 'primary');
  const accent = colors.find(c => c.type === 'accent');
  
  return (primary || accent)?.hex || null;
};

app.get('/api/brand/:domain', async (req, res) => {
  try {
    if (!BRANDFETCH_API_KEY) {
      throw new Error('Brandfetch API key not configured');
    }

    const { domain } = req.params;
    const response = await axios.get(`https://api.brandfetch.io/v2/brands/${domain}`, {
      headers: {
        'Authorization': `Bearer ${BRANDFETCH_API_KEY}`
      }
    });

    const data = response.data;

    // Extract and structure brand information
    const brandData = {
      name: data.name,
      domain: data.domain,
      logo: getBestLogo(data.logos),
      colors: {
        primary: getPrimaryColor(data.colors),
        all: data.colors?.map(c => ({
          hex: c.hex,
          type: c.type
        })) || []
      },
      description: data.description || ''
    };

    res.json(brandData);
  } catch (error) {
    console.error('Brand lookup error:', error.message);
    
    // Send appropriate error response
    if (error.response?.status === 404) {
      res.status(404).json({
        error: 'Brand not found',
        message: 'Could not find brand information for this domain'
      });
    } else if (error.response?.status === 401) {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid API key or authentication error'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch brand information',
        message: 'Please enter brand details manually'
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Brand lookup server running on port ${port}`);
});