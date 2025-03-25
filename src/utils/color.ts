import ColorThief from 'colorthief';

export function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';  // Enable CORS for the image
    
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const [r, g, b] = colorThief.getColor(img);
        resolve(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
      } catch (error) {
        console.error('Failed to extract color:', error);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      console.error('Failed to load image:', error);
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
} 