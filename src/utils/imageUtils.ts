
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

// Apply adjustments like brightness, contrast, etc.
export const applyAdjustments = (
  imageDataUrl: string,
  adjustments: Record<string, number>,
  width: number = 640,
  height: number = 480
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
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
        
        // Apply adjustments
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Apply brightness
        const brightness = (adjustments.brightness || 100) / 100;
        
        // Apply contrast
        const contrast = (adjustments.contrast || 100) / 100;
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        
        // Apply saturation
        const saturation = (adjustments.saturation || 100) / 100;
        
        // Apply adjustments to each pixel
        for (let i = 0; i < data.length; i += 4) {
          // Apply brightness
          data[i] = data[i] * brightness;
          data[i + 1] = data[i + 1] * brightness;
          data[i + 2] = data[i + 2] * brightness;
          
          // Apply contrast
          data[i] = factor * (data[i] - 128) + 128;
          data[i + 1] = factor * (data[i + 1] - 128) + 128;
          data[i + 2] = factor * (data[i + 2] - 128) + 128;
          
          // Apply saturation
          const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
          data[i] = gray * (1 - saturation) + data[i] * saturation;
          data[i + 1] = gray * (1 - saturation) + data[i + 1] * saturation;
          data[i + 2] = gray * (1 - saturation) + data[i + 2] * saturation;
          
          // Clamp values
          data[i] = Math.min(255, Math.max(0, data[i]));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Apply blur if needed
        if (adjustments.blur && adjustments.blur > 0) {
          ctx.filter = `blur(${adjustments.blur}px)`;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = 'none';
        }
        
        // Apply vignette if needed
        if (adjustments.vignette && adjustments.vignette > 0) {
          const vignetteStrength = adjustments.vignette / 100;
          
          // Create gradient for vignette
          const gradient = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
          );
          
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(0.5, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, `rgba(0,0,0,${vignetteStrength})`);
          
          ctx.fillStyle = gradient;
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillRect(0, 0, width, height);
          ctx.globalCompositeOperation = 'source-over';
        }
        
        // Get the adjusted image data URL
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for adjustments'));
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
          
          // Add special borders based on frame type
          const frameType = borderWidth > 0 ? 'custom' : 'none';
          
          if (frameType === 'custom') {
            // Draw border
            if (borderWidth > 0) {
              ctx.strokeStyle = borderColor;
              ctx.lineWidth = borderWidth;
              
              // Check if it's a rounded frame
              if (borderColor.includes('rounded')) {
                const radius = 15;
                ctx.beginPath();
                ctx.moveTo(borderWidth / 2 + radius, borderWidth / 2);
                ctx.lineTo(stripWidth - borderWidth / 2 - radius, borderWidth / 2);
                ctx.arcTo(stripWidth - borderWidth / 2, borderWidth / 2, stripWidth - borderWidth / 2, borderWidth / 2 + radius, radius);
                ctx.lineTo(stripWidth - borderWidth / 2, stripHeight - borderWidth / 2 - radius);
                ctx.arcTo(stripWidth - borderWidth / 2, stripHeight - borderWidth / 2, stripWidth - borderWidth / 2 - radius, stripHeight - borderWidth / 2, radius);
                ctx.lineTo(borderWidth / 2 + radius, stripHeight - borderWidth / 2);
                ctx.arcTo(borderWidth / 2, stripHeight - borderWidth / 2, borderWidth / 2, stripHeight - borderWidth / 2 - radius, radius);
                ctx.lineTo(borderWidth / 2, borderWidth / 2 + radius);
                ctx.arcTo(borderWidth / 2, borderWidth / 2, borderWidth / 2 + radius, borderWidth / 2, radius);
                ctx.closePath();
                ctx.stroke();
              } else {
                // Regular rectangular border
                ctx.strokeRect(
                  borderWidth / 2, 
                  borderWidth / 2, 
                  stripWidth - borderWidth, 
                  stripHeight - borderWidth
                );
              }
            }
            
            // For Polaroid-style, add extra bottom padding
            if (padding >= 30) {
              ctx.fillStyle = backgroundColor;
              if (orientation === 'vertical') {
                images.forEach((img, index) => {
                  const y = padding + borderWidth + (index * (imgHeight + padding));
                  ctx.fillRect(
                    borderWidth,
                    y + imgHeight,
                    imgWidth + padding,
                    padding * 1.5
                  );
                });
              }
            }
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
          
          // For film strip style, add sprocket holes
          if (borderColor.includes('filmstrip')) {
            // Add film strip sprocket holes
            ctx.fillStyle = 'black';
            const holeRadius = 8;
            const holeMargin = 20;
            
            if (orientation === 'vertical') {
              // Left side holes
              for (let i = 0; i <= images.length; i++) {
                const y = padding + borderWidth + (i * (imgHeight + padding));
                ctx.beginPath();
                ctx.arc(holeMargin, y - holeRadius, holeRadius, 0, Math.PI * 2);
                ctx.fill();
              }
              
              // Right side holes
              for (let i = 0; i <= images.length; i++) {
                const y = padding + borderWidth + (i * (imgHeight + padding));
                ctx.beginPath();
                ctx.arc(stripWidth - holeMargin, y - holeRadius, holeRadius, 0, Math.PI * 2);
                ctx.fill();
              }
            } else {
              // Top holes
              for (let i = 0; i <= images.length; i++) {
                const x = padding + borderWidth + (i * (imgWidth + padding));
                ctx.beginPath();
                ctx.arc(x - holeRadius, holeMargin, holeRadius, 0, Math.PI * 2);
                ctx.fill();
              }
              
              // Bottom holes
              for (let i = 0; i <= images.length; i++) {
                const x = padding + borderWidth + (i * (imgWidth + padding));
                ctx.beginPath();
                ctx.arc(x - holeRadius, stripHeight - holeMargin, holeRadius, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
          
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
