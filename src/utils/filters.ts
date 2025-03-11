export type FilterType = 
  | 'normal' 
  | 'grayscale' 
  | 'sepia' 
  | 'vintage' 
  | 'fade' 
  | 'cold' 
  | 'warm' 
  | 'saturate'
  | 'beauty'
  | 'retro'
  | 'cartoon'
  | 'neon'
  | 'hdr'
  | 'film';

export interface Filter {
  name: FilterType;
  label: string;
  cssFilter: string;
  canvasFilter?: (ctx: CanvasRenderingContext2D, imageData: ImageData) => ImageData;
}

export const filters: Filter[] = [
  {
    name: 'normal',
    label: 'Normal',
    cssFilter: 'none',
  },
  {
    name: 'grayscale',
    label: 'B&W',
    cssFilter: 'grayscale(100%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      return imageData;
    }
  },
  {
    name: 'sepia',
    label: 'Sepia',
    cssFilter: 'sepia(70%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
      }
      return imageData;
    }
  },
  {
    name: 'vintage',
    label: 'Vintage',
    cssFilter: 'sepia(30%) brightness(90%) contrast(110%)',
    canvasFilter: (ctx, imageData) => {
      // First apply sepia
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Sepia effect (lighter than full sepia)
        data[i] = Math.min(255, (r * 0.35) + (g * 0.65) + (b * 0.18));
        data[i + 1] = Math.min(255, (r * 0.32) + (g * 0.6) + (b * 0.15));
        data[i + 2] = Math.min(255, (r * 0.25) + (g * 0.45) + (b * 0.13));
        
        // Adjust brightness and contrast
        for (let j = 0; j < 3; j++) {
          // Brightness (decrease to 90%)
          data[i + j] = data[i + j] * 0.9;
          
          // Contrast (increase by 10%)
          data[i + j] = ((data[i + j] / 255 - 0.5) * 1.1 + 0.5) * 255;
        }
      }
      return imageData;
    }
  },
  {
    name: 'fade',
    label: 'Fade',
    cssFilter: 'brightness(110%) saturate(80%) contrast(90%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Increase brightness
        data[i] = Math.min(255, data[i] * 1.1);
        data[i + 1] = Math.min(255, data[i + 1] * 1.1);
        data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        
        // Desaturate a bit
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i] * 0.8 + avg * 0.2;
        data[i + 1] = data[i + 1] * 0.8 + avg * 0.2;
        data[i + 2] = data[i + 2] * 0.8 + avg * 0.2;
        
        // Decrease contrast
        for (let j = 0; j < 3; j++) {
          data[i + j] = ((data[i + j] / 255 - 0.5) * 0.9 + 0.5) * 255;
        }
      }
      return imageData;
    }
  },
  {
    name: 'cold',
    label: 'Cold',
    cssFilter: 'saturate(110%) hue-rotate(30deg) brightness(105%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Increase blue channel, decrease red channel slightly
        data[i] = data[i] * 0.9;     // Decrease red
        data[i + 2] = Math.min(255, data[i + 2] * 1.2); // Increase blue
        
        // Increase brightness slightly
        data[i] = Math.min(255, data[i] * 1.05);
        data[i + 1] = Math.min(255, data[i + 1] * 1.05);
        data[i + 2] = Math.min(255, data[i + 2] * 1.05);
      }
      return imageData;
    }
  },
  {
    name: 'warm',
    label: 'Warm',
    cssFilter: 'saturate(110%) hue-rotate(-30deg) brightness(105%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Increase red channel, decrease blue channel slightly
        data[i] = Math.min(255, data[i] * 1.2);   // Increase red
        data[i + 2] = data[i + 2] * 0.9;          // Decrease blue
        
        // Increase brightness slightly
        data[i] = Math.min(255, data[i] * 1.05);
        data[i + 1] = Math.min(255, data[i + 1] * 1.05);
        data[i + 2] = Math.min(255, data[i + 2] * 1.05);
      }
      return imageData;
    }
  },
  {
    name: 'saturate',
    label: 'Vivid',
    cssFilter: 'saturate(150%) contrast(110%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Increase saturation
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i] + (data[i] - avg) * 0.5;
        data[i + 1] = data[i + 1] + (data[i + 1] - avg) * 0.5;
        data[i + 2] = data[i + 2] + (data[i + 2] - avg) * 0.5;
        
        // Clip values to ensure they're within range
        data[i] = Math.max(0, Math.min(255, data[i]));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
        
        // Increase contrast
        for (let j = 0; j < 3; j++) {
          data[i + j] = ((data[i + j] / 255 - 0.5) * 1.1 + 0.5) * 255;
        }
      }
      return imageData;
    }
  },
  {
    name: 'beauty',
    label: 'Beauty',
    cssFilter: 'brightness(105%) saturate(110%) contrast(105%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Slight skin smoothing (blur-like effect for skin tones)
        if (isLikelySkinTone(data[i], data[i+1], data[i+2])) {
          // Apply subtle smoothing to skin tones
          data[i] = Math.min(255, data[i] * 1.05);     // Slightly enhance red
          data[i+1] = Math.min(255, data[i+1] * 1.02); // Slightly enhance green
        }
        
        // Enhance overall brightness and contrast
        for (let j = 0; j < 3; j++) {
          // Increase brightness slightly
          data[i + j] = Math.min(255, data[i + j] * 1.05);
          
          // Increase contrast slightly
          data[i + j] = ((data[i + j] / 255 - 0.5) * 1.05 + 0.5) * 255;
        }
      }
      return imageData;
    }
  },
  {
    name: 'retro',
    label: 'Retro',
    cssFilter: 'sepia(50%) hue-rotate(-30deg) saturate(140%) contrast(110%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Retro effect with color shift
        data[i] = Math.min(255, r * 1.2);       // Enhance red
        data[i + 1] = Math.min(255, g * 0.9);   // Reduce green
        data[i + 2] = Math.min(255, b * 0.8);   // Reduce blue more
        
        // Add slight vignette effect based on position
        const width = imageData.width;
        const height = imageData.height;
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        
        // Calculate distance from center (simplified vignette)
        const centerX = width / 2;
        const centerY = height / 2;
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
        
        // Apply vignette effect
        const vignetteStrength = 0.7;
        const vignetteEffect = 1 - (vignetteStrength * (distanceFromCenter / maxDistance));
        
        data[i] = data[i] * vignetteEffect;
        data[i + 1] = data[i + 1] * vignetteEffect;
        data[i + 2] = data[i + 2] * vignetteEffect;
      }
      return imageData;
    }
  },
  {
    name: 'cartoon',
    label: 'Cartoon',
    cssFilter: 'saturate(150%) contrast(140%) brightness(110%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      
      // Simple edge detection and color quantization for cartoon effect
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const pos = (y * width + x) * 4;
          
          // Color quantization (reduce color palette)
          for (let c = 0; c < 3; c++) {
            data[pos + c] = Math.round(data[pos + c] / 32) * 32;
          }
          
          // Simple edge detection
          const posUp = ((y - 1) * width + x) * 4;
          const posDown = ((y + 1) * width + x) * 4;
          const posLeft = (y * width + (x - 1)) * 4;
          const posRight = (y * width + (x + 1)) * 4;
          
          // Check for edges (simplified)
          const threshold = 30;
          if (
            Math.abs(data[pos] - data[posUp]) > threshold ||
            Math.abs(data[pos] - data[posDown]) > threshold ||
            Math.abs(data[pos] - data[posLeft]) > threshold ||
            Math.abs(data[pos] - data[posRight]) > threshold
          ) {
            // Draw edge (dark outline)
            data[pos] = data[pos + 1] = data[pos + 2] = 0;
          }
        }
      }
      
      return imageData;
    }
  },
  {
    name: 'neon',
    label: 'Neon',
    cssFilter: 'brightness(120%) contrast(120%) saturate(200%) hue-rotate(30deg)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      
      // Create a neon glow effect
      for (let i = 0; i < data.length; i += 4) {
        // Enhance colors dramatically
        data[i] = Math.min(255, data[i] * 1.2);     // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.3); // Green
        data[i + 2] = Math.min(255, data[i + 2] * 1.5); // Blue - extra boost
        
        // Increase contrast
        for (let j = 0; j < 3; j++) {
          data[i + j] = ((data[i + j] / 255 - 0.5) * 1.4 + 0.5) * 255;
        }
        
        // Apply color shift for neon effect
        const temp = data[i];
        data[i] = data[i + 1]; 
        data[i + 1] = data[i + 2];
        data[i + 2] = temp;
      }
      
      return imageData;
    }
  },
  {
    name: 'hdr',
    label: 'HDR',
    cssFilter: 'contrast(150%) brightness(110%) saturate(130%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      
      // Simulate HDR effect
      for (let i = 0; i < data.length; i += 4) {
        // Enhance shadows and highlights
        for (let j = 0; j < 3; j++) {
          // Make dark areas darker and bright areas brighter
          const value = data[i + j] / 255;
          
          // S-curve for contrast enhancement
          if (value < 0.5) {
            data[i + j] = Math.pow(value * 2, 1.2) * 127.5;
          } else {
            data[i + j] = 255 - (Math.pow((1 - value) * 2, 1.2) * 127.5);
          }
          
          // Boost saturation for mid-tones
          if (value > 0.3 && value < 0.7) {
            data[i + j] = Math.min(255, data[i + j] * 1.2);
          }
        }
      }
      
      return imageData;
    }
  },
  {
    name: 'film',
    label: 'Film',
    cssFilter: 'contrast(105%) brightness(95%) sepia(20%)',
    canvasFilter: (ctx, imageData) => {
      const data = imageData.data;
      
      // Add film grain and color grading
      for (let i = 0; i < data.length; i += 4) {
        // Slight color shift for film look
        data[i] = Math.min(255, data[i] * 1.05);     // Slightly boost red
        data[i + 2] = Math.min(255, data[i + 2] * 0.95); // Slightly reduce blue
        
        // Add random grain
        const grain = Math.random() * 20 - 10; // Random value between -10 and 10
        
        // Apply grain to all channels
        for (let j = 0; j < 3; j++) {
          data[i + j] = Math.max(0, Math.min(255, data[i + j] + grain));
        }
      }
      
      return imageData;
    }
  }
];

// Helper function to detect skin tones (for beauty filter)
function isLikelySkinTone(r: number, g: number, b: number): boolean {
  // Simple skin tone detection based on RGB ranges
  // This is a very simplified approach
  const isDark = r < 40 && g < 40 && b < 40;
  if (isDark) return false;
  
  // Check if red channel is dominant (characteristic of skin tones)
  if (r > g && r > b) {
    // Check typical skin tone ratios
    const rg = r / g;
    if (rg > 1.0 && rg < 1.7) {
      const rb = r / b;
      if (rb > 1.0 && rb < 2.0) {
        return true;
      }
    }
  }
  
  return false;
}

export const getFilterByName = (name: FilterType): Filter => {
  return filters.find(filter => filter.name === name) || filters[0];
};

