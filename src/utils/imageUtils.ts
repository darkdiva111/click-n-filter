
import { FilterType, getFilterByName } from './filters';

// Get image from webcam video stream
export const captureFromVideo = (
  videoElement: HTMLVideoElement, 
  width: number = 640, 
  height: number = 480
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Flip the image horizontally (mirror effect)
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      
      // Draw the video frame to the canvas
      ctx.drawImage(videoElement, 0, 0, width, height);
      
      // Get the image data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
};

// Apply filter to an image
export const applyFilter = (
  imageDataUrl: string, 
  filterName: FilterType,
  width: number = 640,
  height: number = 480
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const filter = getFilterByName(filterName);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw the image to canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Apply filter if it has a canvas implementation
        if (filter.canvasFilter) {
          const imageData = ctx.getImageData(0, 0, width, height);
          const filteredData = filter.canvasFilter(ctx, imageData);
          ctx.putImageData(filteredData, 0, 0);
        }
        
        // Get the filtered image data URL
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for filtering'));
      };
      
      img.src = imageDataUrl;
    } catch (error) {
      reject(error);
    }
  });
};

// Create a photo strip from selected images
export const createPhotoStrip = (
  imageDataUrls: string[],
  orientation: 'vertical' | 'horizontal' = 'vertical',
  padding: number = 10,
  backgroundColor: string = 'white',
  borderWidth: number = 5,
  borderColor: string = 'white',
  textOverlays: Array<{ 
    content: string; 
    x: number; 
    y: number; 
    color: string; 
    fontSize: number 
  } | null> = []
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (imageDataUrls.length === 0) {
        reject(new Error('No images provided for photo strip'));
        return;
      }
      
      // Load all images first
      const imagePromises = imageDataUrls.map(url => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to load image for photo strip'));
          img.src = url;
        });
      });
      
      Promise.all(imagePromises)
        .then(images => {
          // All images loaded, now create the strip
          const imgWidth = images[0].width;
          const imgHeight = images[0].height;
          
          // Calculate dimensions based on orientation
          let stripWidth: number;
          let stripHeight: number;
          
          if (orientation === 'vertical') {
            stripWidth = imgWidth + (padding * 2) + (borderWidth * 2);
            stripHeight = (imgHeight * images.length) + (padding * (images.length + 1)) + (borderWidth * 2);
          } else {
            stripWidth = (imgWidth * images.length) + (padding * (images.length + 1)) + (borderWidth * 2);
            stripHeight = imgHeight + (padding * 2) + (borderWidth * 2);
          }
          
          // Create the canvas for the strip
          const canvas = document.createElement('canvas');
          canvas.width = stripWidth;
          canvas.height = stripHeight;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Fill background
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, stripWidth, stripHeight);
          
          // Draw border if needed
          if (borderWidth > 0) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(
              borderWidth / 2, 
              borderWidth / 2, 
              stripWidth - borderWidth, 
              stripHeight - borderWidth
            );
          }
          
          // Draw each image and add text if present
          images.forEach((img, index) => {
            let x: number;
            let y: number;
            
            if (orientation === 'vertical') {
              x = padding + borderWidth;
              y = padding + borderWidth + (index * (imgHeight + padding));
            } else {
              x = padding + borderWidth + (index * (imgWidth + padding));
              y = padding + borderWidth;
            }
            
            // Draw the image
            ctx.drawImage(img, x, y, imgWidth, imgHeight);
            
            // Draw text overlay if present for this image
            const textOverlay = textOverlays[index];
            if (textOverlay && textOverlay.content) {
              // Set text properties
              ctx.font = `${textOverlay.fontSize}px Arial`;
              ctx.fillStyle = textOverlay.color;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // Calculate text position based on percentage coordinates
              const textX = x + (imgWidth * (textOverlay.x / 100));
              const textY = y + (imgHeight * (textOverlay.y / 100));
              
              // Add a text shadow/outline for better visibility
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 4;
              ctx.shadowOffsetX = 1;
              ctx.shadowOffsetY = 1;
              
              // Draw the text
              ctx.fillText(textOverlay.content, textX, textY);
              
              // Reset shadow
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            }
          });
          
          // Get the final strip as data URL
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// Download an image
export const downloadImage = (dataUrl: string, filename: string = 'photo-strip.png'): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
};
