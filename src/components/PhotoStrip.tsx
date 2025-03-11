
import React from 'react';
import { createPhotoStrip } from '../utils/imageUtils';

interface PhotoStripProps {
  photos: { id: number; url: string; selected: boolean }[];
  onToggleSelect: (id: number) => void;
  onGenerateStrip: (stripUrl: string) => void;
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ 
  photos, 
  onToggleSelect, 
  onGenerateStrip 
}) => {
  // Generate the actual photo strip
  const handleCreateStrip = async () => {
    try {
      const selectedPhotos = photos.filter(photo => photo.selected);
      if (selectedPhotos.length === 0) {
        throw new Error('Select at least one photo for the strip');
      }
      
      const imageUrls = selectedPhotos.map(photo => photo.url);
      const stripUrl = await createPhotoStrip(
        imageUrls, 
        'vertical', 
        10, 
        'white', 
        5, 
        'white'
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
              photo-thumbnail cursor-pointer aspect-[3/4]
              ${photo.selected ? 'selected scale-105' : ''}
            `}
            onClick={() => onToggleSelect(photo.id)}
          >
            <img 
              src={photo.url}
              alt={`Photo ${photo.id}`}
              className="w-full h-full object-cover"
            />
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
