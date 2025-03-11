
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface AdjustmentPanelProps {
  onApplyAdjustment: (type: string, value: number) => void;
}

interface Adjustment {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  currentValue: number;
}

const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({ onApplyAdjustment }) => {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([
    { name: 'brightness', label: 'Brightness', min: 50, max: 150, step: 5, defaultValue: 100, currentValue: 100 },
    { name: 'contrast', label: 'Contrast', min: 50, max: 150, step: 5, defaultValue: 100, currentValue: 100 },
    { name: 'saturation', label: 'Saturation', min: 0, max: 200, step: 5, defaultValue: 100, currentValue: 100 },
    { name: 'blur', label: 'Blur', min: 0, max: 10, step: 0.5, defaultValue: 0, currentValue: 0 },
    { name: 'vignette', label: 'Vignette', min: 0, max: 100, step: 5, defaultValue: 0, currentValue: 0 },
  ]);

  const handleSliderChange = (index: number, newValue: number[]) => {
    const updatedAdjustments = [...adjustments];
    updatedAdjustments[index].currentValue = newValue[0];
    setAdjustments(updatedAdjustments);
    
    // Notify parent component about the adjustment
    onApplyAdjustment(adjustments[index].name, newValue[0]);
  };

  const handleReset = (index: number) => {
    const updatedAdjustments = [...adjustments];
    const defaultValue = updatedAdjustments[index].defaultValue;
    updatedAdjustments[index].currentValue = defaultValue;
    setAdjustments(updatedAdjustments);
    
    // Reset the adjustment in parent component
    onApplyAdjustment(adjustments[index].name, defaultValue);
  };

  return (
    <div className="py-4 animate-slide-up">
      <h3 className="text-lg font-medium text-booth-primary mb-3">Adjustments</h3>
      
      <div className="space-y-4">
        {adjustments.map((adjustment, index) => (
          <div key={adjustment.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-booth-primary">
                {adjustment.label}
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-booth-muted">
                  {adjustment.currentValue}
                </span>
                {adjustment.currentValue !== adjustment.defaultValue && (
                  <button 
                    onClick={() => handleReset(index)}
                    className="text-xs text-booth-accent hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            
            <Slider
              value={[adjustment.currentValue]}
              min={adjustment.min}
              max={adjustment.max}
              step={adjustment.step}
              onValueChange={(value) => handleSliderChange(index, value)}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdjustmentPanel;
