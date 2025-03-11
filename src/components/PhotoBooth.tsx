
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Camera from './Camera';
import EditPanel from './EditPanel';
import PhotoStrip from './PhotoStrip';
import { FilterType } from '../utils/filters';
import { applyFilter, downloadImage } from '../utils/imageUtils';

interface Photo {
  id: number;
  url: string;
  originalUrl: string;
  filter: FilterType;
  selected: boolean;
}

const PhotoBooth: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentMode, setCurrentMode] = useState<'capture' | 'edit' | 'strip'>('capture');
  const [capturingPhoto, setCapturingPhoto] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('normal');
  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
  const [photoStripUrl, setPhotoStripUrl] = useState<string | null>(null);
  const [captureCount, setCaptureCount] = useState(0);
  
  // Find the currently editing photo
  const editingPhoto = editingPhotoId !== null 
    ? photos.find(p => p.id === editingPhotoId) 
    : null;

  // Handle a new photo capture
  const handlePhotoCapture = (imageDataUrl: string) => {
    const newId = Date.now();
    const newPhoto: Photo = {
      id: newId,
      url: imageDataUrl,
      originalUrl: imageDataUrl,
      filter: 'normal',
      selected: photos.filter(p => p.selected).length < 3
    };
    
    setPhotos(prev => [...prev, newPhoto]);
    setCaptureCount(prev => prev + 1);
    setCapturingPhoto(false);
    
    if (captureCount < 3) { // Automatically take the next photo
      setTimeout(() => {
        setCapturingPhoto(true);
      }, 500);
    } else {
      setCurrentMode('edit');
      setEditingPhotoId(newId);
      toast.success('Photos captured! Now you can edit them.');
    }
  };
  
  // Apply a filter to the current photo
  const handleApplyFilter = async (filterName: FilterType) => {
    if (editingPhotoId === null) return;
    
    try {
      const photo = photos.find(p => p.id === editingPhotoId);
      if (!photo) return;
      
      const filteredImageUrl = await applyFilter(photo.originalUrl, filterName);
      
      setPhotos(prev => prev.map(p => 
        p.id === editingPhotoId 
          ? { ...p, url: filteredImageUrl, filter: filterName }
          : p
      ));
      
      setSelectedFilter(filterName);
    } catch (error) {
      console.error('Error applying filter:', error);
      toast.error('Failed to apply filter');
    }
  };
  
  // Toggle photo selection for the strip
  const handleToggleSelect = (photoId: number) => {
    setPhotos(prev => {
      const selectedCount = prev.filter(p => p.selected && p.id !== photoId).length;
      
      // If trying to select a 4th photo, don't allow it
      if (selectedCount >= 3 && !prev.find(p => p.id === photoId)?.selected) {
        toast.error('You can only select 3 photos for your strip');
        return prev;
      }
      
      return prev.map(p => 
        p.id === photoId ? { ...p, selected: !p.selected } : p
      );
    });
  };
  
  // Handle photo strip generation
  const handleGenerateStrip = (stripUrl: string) => {
    setPhotoStripUrl(stripUrl);
    setCurrentMode('strip');
    toast.success('Photo strip created!');
  };
  
  // Handle photo strip download
  const handleDownloadStrip = () => {
    if (!photoStripUrl) return;
    
    downloadImage(photoStripUrl, 'my-photo-booth-strip.png');
    toast.success('Photo strip downloaded!');
  };
  
  // Start a new session
  const handleNewSession = () => {
    setPhotos([]);
    setPhotoStripUrl(null);
    setCurrentMode('capture');
    setCaptureCount(0);
    setCapturingPhoto(false);
    setEditingPhotoId(null);
    setSelectedFilter('normal');
    
    setTimeout(() => {
      setCapturingPhoto(true);
    }, 500);
    
    toast.success('Started a new session!');
  };
  
  // Start capturing photos on first load
  useEffect(() => {
    if (photos.length === 0 && currentMode === 'capture') {
      setTimeout(() => {
        setCapturingPhoto(true);
      }, 1000);
    }
  }, [photos.length, currentMode]);

  // Render the current mode content
  const renderContent = () => {
    switch (currentMode) {
      case 'capture':
        return (
          <div className="animate-fade-in">
            <Camera 
              onCapture={handlePhotoCapture} 
              isCapturing={capturingPhoto} 
              countdownSeconds={5}
            />
            <div className="text-center mt-4 text-booth-primary">
              <p>
                {captureCount === 0 
                  ? 'Get ready for your first photo!' 
                  : `Photo ${captureCount}/4 captured. ${4 - captureCount} remaining.`}
              </p>
            </div>
          </div>
        );
      
      case 'edit':
        return (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h3 className="text-lg font-medium text-booth-primary mb-3">Edit Your Photos</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                  {photos.map((photo) => (
                    <div 
                      key={photo.id}
                      className={`
                        photo-thumbnail cursor-pointer
                        ${editingPhotoId === photo.id ? 'ring-2 ring-booth-accent ring-offset-2' : ''}
                      `}
                      onClick={() => {
                        setEditingPhotoId(photo.id);
                        setSelectedFilter(photo.filter);
                      }}
                    >
                      <img 
                        src={photo.url}
                        alt={`Photo ${photo.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                {editingPhoto && (
                  <EditPanel
                    imageUrl={editingPhoto.originalUrl}
                    onApplyFilter={handleApplyFilter}
                    selectedFilter={selectedFilter}
                  />
                )}
              </div>
              
              <div className="md:w-1/2">
                <PhotoStrip
                  photos={photos}
                  onToggleSelect={handleToggleSelect}
                  onGenerateStrip={handleGenerateStrip}
                />
              </div>
            </div>
          </div>
        );
      
      case 'strip':
        return (
          <div className="animate-scale-in flex flex-col items-center">
            <h3 className="text-xl font-medium text-booth-primary mb-4">Your Photo Strip</h3>
            
            {photoStripUrl && (
              <div className="max-w-xs mx-auto mb-6 photo-strip">
                <img 
                  src={photoStripUrl}
                  alt="Photo Strip"
                  className="max-w-full h-auto"
                />
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                className="px-6 py-3 rounded-full font-medium bg-booth-accent text-white shadow-lg hover:shadow-xl transition-all"
                onClick={handleDownloadStrip}
              >
                Download
              </button>
              
              <button
                className="px-6 py-3 rounded-full font-medium bg-booth-muted text-white shadow hover:shadow-md transition-all"
                onClick={handleNewSession}
              >
                New Session
              </button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="photo-booth-container p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-booth-primary">
          Online Photo Booth
        </h1>
        <p className="text-booth-muted mt-2">
          Capture, edit, and create your photo memories!
        </p>
      </header>
      
      <main className="rounded-xl overflow-hidden">
        {renderContent()}
      </main>
      
      <footer className="mt-8 text-center text-sm text-booth-muted">
        <p>Get creative with your photos and share your memories!</p>
      </footer>
    </div>
  );
};

export default PhotoBooth;
