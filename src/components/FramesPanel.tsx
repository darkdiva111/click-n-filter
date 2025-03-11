
import React from 'react';

interface FramesPanelProps {
  onSelectFrame: (frameType: string, frameColor: string) => void;
  selectedFrame: { type: string; color: string } | null;
}

const FramesPanel: React.FC<FramesPanelProps> = ({ onSelectFrame, selectedFrame }) => {
  const frameTypes = [
    { id: 'none', label: 'None' },
    { id: 'thin', label: 'Thin' },
    { id: 'thick', label: 'Thick' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'polaroid', label: 'Polaroid' },
    { id: 'filmstrip', label: 'Filmstrip' },
  ];
  
  const frameColors = [
    { id: 'white', label: 'White', color: '#ffffff' },
    { id: 'black', label: 'Black', color: '#000000' },
    { id: 'gold', label: 'Gold', color: '#ffd700' },
    { id: 'silver', label: 'Silver', color: '#c0c0c0' },
    { id: 'booth-accent', label: 'Purple', color: 'hsl(var(--booth-accent))' },
  ];

  return (
    <div className="py-4 animate-slide-up">
      <h3 className="text-lg font-medium text-booth-primary mb-3">Frames & Borders</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-booth-muted mb-2">Frame Style</h4>
          <div className="grid grid-cols-3 gap-2">
            {frameTypes.map((frameType) => (
              <button
                key={frameType.id}
                className={`p-2 rounded-lg text-sm transition-all
                  ${selectedFrame?.type === frameType.id
                    ? 'bg-booth-accent text-white'
                    : 'bg-booth-secondary/40 hover:bg-booth-secondary/60 text-booth-primary'
                  }`}
                onClick={() => onSelectFrame(
                  frameType.id,
                  selectedFrame?.color || frameColors[0].id
                )}
              >
                {frameType.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-booth-muted mb-2">Frame Color</h4>
          <div className="flex flex-wrap gap-2">
            {frameColors.map((frameColor) => (
              <button
                key={frameColor.id}
                className={`
                  w-8 h-8 rounded-full border-2 transition-all
                  ${selectedFrame?.color === frameColor.id
                    ? 'border-booth-accent scale-110'
                    : 'border-transparent hover:scale-105'
                  }
                `}
                style={{ backgroundColor: frameColor.color }}
                onClick={() => onSelectFrame(
                  selectedFrame?.type || 'thin',
                  frameColor.id
                )}
                title={frameColor.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FramesPanel;
