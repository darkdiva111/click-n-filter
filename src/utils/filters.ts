
export type FilterType = 
  | 'normal' 
  | 'grayscale' 
  | 'sepia' 
  | 'vintage' 
  | 'fade' 
  | 'cold' 
  | 'warm' 
  | 'saturate';

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
];

export const getFilterByName = (name: FilterType): Filter => {
  return filters.find(filter => filter.name === name) || filters[0];
};
