
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Camera, Share2, Download, RefreshCw, Image, Sliders } from 'lucide-react';
import CameraComponent from './Camera';
import EditPanel from './EditPanel';
import PhotoStrip from './PhotoStrip';
import FramesPanel from './FramesPanel';
import { FilterType } from '../utils/filters';
import { applyFilter, downloadImage } from '../utils/imageUtils';

interface Photo {
  id: number;
  url: string;
  originalUrl: string;
  filter: FilterType;
  selected: boolean;
  text?: {
    content: string;
    x: number;
    y: number;
    color: string;
    fontSize: number;
  } | null;
  stickers?: string[];
  adjustments?: Record<string, number>;
}

interface Frame {
  type: string;
  color: string;
}

const PhotoBooth: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentMode, setCurrentMode] = useState<'welcome' | 'capture' | 'edit' | 'strip'>('welcome');
  const [capturingPhoto, setCapturingPhoto] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('normal');
  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
  const [photoStripUrl, setPhotoStripUrl] = useState<string | null>(null);
  const [captureCount, setCaptureCount] = useState(0);
  const [editingText, setEditingText] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [currentEditingTab, setCurrentEditingTab] = useState<'photo' | 'strip'>('photo');
  
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
      selected: photos.filter(p => p.selected).length < 3,
      text: null,
      stickers: [],
      adjustments: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        vignette: 0
      }
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

  // Handle image adjustments (brightness, contrast, etc.)
  const handleApplyAdjustment = (type: string, value: number) => {
    if (editingPhotoId === null) return;
    
    setPhotos(prev => prev.map(p => {
      if (p.id === editingPhotoId) {
        const updatedAdjustments = {
          ...p.adjustments,
          [type]: value
        };
        
        return {
          ...p,
          adjustments: updatedAdjustments
        };
      }
      return p;
    }));
    
    // In a real implementation, we would apply the adjustment to the image in real-time
    // This would require extending the imageUtils.ts to handle multiple adjustments
    toast(`Applied ${type}: ${value}`, {
      duration: 1000
    });
  };

  // Add text to the current photo
  const handleAddText = (text: { content: string; x: number; y: number; color: string; fontSize: number }) => {
    if (editingPhotoId === null) return;
    
    setPhotos(prev => prev.map(p => 
      p.id === editingPhotoId 
        ? { ...p, text }
        : p
    ));
    
    setEditingText(false);
    toast.success('Text added to photo!');
  };
  
  // Add a sticker to the current photo
  const handleAddSticker = (stickerUrl: string) => {
    if (editingPhotoId === null) return;
    
    setPhotos(prev => prev.map(p => {
      if (p.id === editingPhotoId) {
        const updatedStickers = [...(p.stickers || []), stickerUrl];
        return { ...p, stickers: updatedStickers };
      }
      return p;
    }));
    
    toast.success('Sticker added to photo!');
  };
  
  // Handle frame selection for the photo strip
  const handleSelectFrame = (frameType: string, frameColor: string) => {
    setSelectedFrame({
      type: frameType,
      color: frameColor
    });
    
    toast.success(`Frame updated: ${frameType} - ${frameColor}`);
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

  // Handle photo strip sharing
  const handleShareStrip = () => {
    if (!photoStripUrl) return;
    
    if (navigator.share) {
      fetch(photoStripUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'my-photo-booth-strip.png', { type: 'image/png' });
          navigator.share({
            title: 'My Photo Booth Strip',
            text: 'Check out my photo booth strip!',
            files: [file]
          }).then(() => {
            toast.success('Shared successfully!');
          }).catch(error => {
            console.error('Error sharing:', error);
            toast.error('Failed to share');
          });
        });
    } else {
      toast.error('Web Share API not supported in your browser');
    }
  };
  
  // Start a new session
  const handleNewSession = () => {
    setPhotos([]);
    setPhotoStripUrl(null);
    setCurrentMode('welcome');
    setCaptureCount(0);
    setCapturingPhoto(false);
    setEditingPhotoId(null);
    setSelectedFilter('normal');
    setEditingText(false);
    setSelectedFrame(null);
    
    toast.success('Started a new session!');
  };

  // Start the photo booth session
  const handleStartSession = () => {
    setCurrentMode('capture');
    
    setTimeout(() => {
      setCapturingPhoto(true);
    }, 1000);
    
    toast.success('Session started! Get ready for your first photo!');
  };

  // Toggle between photo editing and strip customization
  const handleToggleEditTab = (tab: 'photo' | 'strip') => {
    setCurrentEditingTab(tab);
  };
  
  // Render the current mode content
  const renderContent = () => {
    switch (currentMode) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center justify-center animate-fade-in py-12">
            <div className="w-24 h-24 rounded-full bg-booth-accent flex items-center justify-center mb-6 shadow-lg">
              <Camera size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-booth-primary mb-4">Welcome to the Photo Booth!</h2>
            <p className="text-booth-muted max-w-md text-center mb-8">
              Take 4 photos, apply cool filters, and create your own photo strip to download and share!
            </p>
            <button
              className="px-8 py-4 rounded-full font-medium bg-booth-accent text-white shadow-lg hover:shadow-xl transition-all text-lg"
              onClick={handleStartSession}
            >
              Start Session
            </button>
          </div>
        );
        
      case 'capture':
        return (
          <div className="animate-fade-in">
            <CameraComponent 
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
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-lg bg-booth-secondary/40 p-1">
                <button
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                    currentEditingTab === 'photo' 
                      ? 'bg-white text-booth-primary shadow-sm' 
                      : 'text-booth-muted hover:text-booth-primary'
                  }`}
                  onClick={() => handleToggleEditTab('photo')}
                >
                  <Image size={16} />
                  <span>Edit Photos</span>
                </button>
                <button
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                    currentEditingTab === 'strip' 
                      ? 'bg-white text-booth-primary shadow-sm' 
                      : 'text-booth-muted hover:text-booth-primary'
                  }`}
                  onClick={() => handleToggleEditTab('strip')}
                >
                  <Sliders size={16} />
                  <span>Customize Strip</span>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                {currentEditingTab === 'photo' && (
                  <>
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
                    
                    {editingPhoto && !editingText && (
                      <EditPanel
                        imageUrl={editingPhoto.originalUrl}
                        onApplyFilter={handleApplyFilter}
                        selectedFilter={selectedFilter}
                        onApplyAdjustment={handleApplyAdjustment}
                        onAddText={handleAddText}
                        onAddSticker={handleAddSticker}
                        onSelectFrame={handleSelectFrame}
                        selectedFrame={selectedFrame}
                        onCancelTextEdit={() => setEditingText(false)}
                      />
                    )}
                  </>
                )}
                
                {currentEditingTab === 'strip' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-booth-primary mb-3">Customize Your Strip</h3>
                    <FramesPanel
                      onSelectFrame={handleSelectFrame}
                      selectedFrame={selectedFrame}
                    />
                  </div>
                )}
              </div>
              
              <div className="md:w-1/2">
                <PhotoStrip
                  photos={photos}
                  onToggleSelect={handleToggleSelect}
                  onGenerateStrip={handleGenerateStrip}
                  selectedFrame={selectedFrame}
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
            
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                className="px-6 py-3 rounded-full font-medium bg-booth-accent text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                onClick={handleDownloadStrip}
              >
                <Download size={18} />
                Download
              </button>
              
              <button
                className="px-6 py-3 rounded-full font-medium bg-booth-primary text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                onClick={handleShareStrip}
              >
                <Share2 size={18} />
                Share
              </button>
              
              <button
                className="px-6 py-3 rounded-full font-medium bg-booth-muted text-white shadow hover:shadow-md transition-all flex items-center gap-2"
                onClick={handleNewSession}
              >
                <RefreshCw size={18} />
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
