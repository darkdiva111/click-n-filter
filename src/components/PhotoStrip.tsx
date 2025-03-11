
import React from 'react';
import { createPhotoStrip } from '../utils/imageUtils';

interface Photo {
  id: number;
  url: string;
  selected: boolean;
  text?: {
    content: string;
    x: number;
    y: number;
    color: string;
    fontSize: number;
  } | null;
  stickers?: string[];
}

interface PhotoStripProps {
  photos: Photo[];
  onToggleSelect: (id: number) => void;
  onGenerateStrip: (stripUrl: string) => void;
  selectedFrame: { type: string; color: string } | null;
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ 
  photos, 
  onToggleSelect, 
  onGenerateStrip,
  selectedFrame
}) => {
  // Generate the actual photo strip
  const handleCreateStrip = async () => {
    try {
      const selectedPhotos = photos.filter(photo => photo.selected);
      if (selectedPhotos.length === 0) {
        throw new Error('Select at least one photo for the strip');
      }
      
      const imageUrls = selectedPhotos.map(photo => photo.url);
      const textOverlays = selectedPhotos.map(photo => photo.text);
      
      // Convert frame settings to parameters
      const borderWidth = selectedFrame?.type === 'none' ? 0 : 
                          selectedFrame?.type === 'thin' ? 5 :
                          selectedFrame?.type === 'thick' ? 15 :
                          selectedFrame?.type === 'polaroid' ? 30 :
                          selectedFrame?.type === 'rounded' ? 8 : 5;
      
      const borderColor = selectedFrame?.color || 'white';
      const padding = selectedFrame?.type === 'polaroid' ? 40 : 10;
      const backgroundColor = 'white';
      
      const stripUrl = await createPhotoStrip(
        imageUrls, 
        'vertical', 
        padding, 
        backgroundColor, 
        borderWidth, 
        borderColor,
        textOverlays
      );
      
      onGenerateStrip(stripUrl);
    } catch (error) {
      console.error('Error creating photo strip:', error);
    }
  };
  
  const selectedCount = photos.filter(photo => photo.selected).length;
  
  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-lg font-medium text-booth-primary mb-3">
        Your Photos ({selectedCount}/3 selected)
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {photos.map((photo) => (
          <div 
            key={photo.id}
            className={`
              photo-thumbnail cursor-pointer aspect-[3/4] relative
              ${photo.selected ? 'selected scale-105' : ''}
            `}
            onClick={() => onToggleSelect(photo.id)}
          >
            <img 
              src={photo.url}
              alt={`Photo ${photo.id}`}
              className="w-full h-full object-cover"
            />
            {photo.text && photo.text.content && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span 
                  style={{
                    color: photo.text.color,
                    fontSize: `${photo.text.fontSize / 2}px`, // Scale down for thumbnail
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                  }}
                >
                  {photo.text.content}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <button
          className={`
            px-6 py-3 rounded-full font-medium
            ${selectedCount > 0 
              ? 'bg-booth-accent text-white shadow-lg hover:shadow-xl transition-all' 
              : 'bg-booth-muted text-white cursor-not-allowed'}
          `}
          onClick={handleCreateStrip}
          disabled={selectedCount === 0}
        >
          Create Photo Strip
        </button>
      </div>
    </div>
  );
};

export default PhotoStrip;
