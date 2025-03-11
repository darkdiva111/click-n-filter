
import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
  isActive: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds, onComplete, isActive }) => {
  const [count, setCount] = useState(seconds);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (!isActive) {
      setCount(seconds);
      setVisible(false);
      return;
    }
    
    setVisible(true);
    
    if (count <= 0) {
      onComplete();
      setVisible(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setCount(prevCount => prevCount - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [count, seconds, onComplete, isActive]);
  
  useEffect(() => {
    if (isActive) {
      setCount(seconds);
      setVisible(true);
    }
  }, [isActive, seconds]);
  
  if (!visible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-8xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.7)] animate-countdown">
        {count}
      </div>
    </div>
  );
};

export default CountdownTimer;
