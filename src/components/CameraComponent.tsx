
import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import CountdownTimer from './CountdownTimer';

interface CameraProps {
  onCapture: (imageDataUrl: string) => void;
  isCapturing: boolean;
  countdownSeconds?: number;
}

const CameraComponent: React.FC<CameraProps> = ({ 
  onCapture, 
  isCapturing, 
  countdownSeconds = 5 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  
  // Initialize camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        
        setStream(mediaStream);
        toast.success('Camera activated successfully');
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast.error('Could not access camera. Please allow camera permissions.');
      }
    };
    
    setupCamera();
    
    // Cleanup function to stop the stream
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Handle capture request
  useEffect(() => {
    if (isCapturing && !countdown) {
      setCountdown(true);
    }
  }, [isCapturing, countdown]);
  
  // Play shutter sound
  const playShutterSound = () => {
    const audio = new Audio();
    // In a real implementation, we'd use a proper shutter sound file
    audio.src = 'data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAABAAADQgD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAA5TEFNRTMuMTAwBLkAAAAAAAAAABUgJAMGQQABmgAAA0KC/hbmAAAAAAD/+5DEAAAJtAF19BEAJTmCrj85iohERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERE765vZizGCDGCDN6bm5vTc3pujruuuuu67roIIIIIIIIIAAAAAAAAAAAARERERERERERERERERERERERERERERERERERERERERERERERERERERERERE56IiIiIiIiIiIiIiIiIiIiIiIiInPRERERERERERERERERERERERERERERETnwiIiIiIiIiIiJ8IiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIif/+yDE1gPUUAFv9BwAAAAAP/wAAAIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIg==';
    audio.play().catch(e => console.error('Error playing shutter sound:', e));
  };
  
  // Capture a frame from the video
  const captureFrame = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Flip the image horizontally (mirror effect)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(video, 0, 0);
    
    // Flash effect
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);
    
    // Play sound
    playShutterSound();
    
    // Convert to data URL and send to parent
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };
  
  // Handle countdown completion
  const handleCountdownComplete = () => {
    captureFrame();
    setCountdown(false);
  };
  
  return (
    <div className="camera-container bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover transform scale-x-[-1]"
      />
      
      {countdown && (
        <CountdownTimer
          seconds={countdownSeconds}
          onComplete={handleCountdownComplete}
          isActive={countdown}
        />
      )}
      
      {flashActive && (
        <div className="absolute inset-0 bg-white animate-camera-flash z-40"></div>
      )}
    </div>
  );
};

export default CameraComponent;
