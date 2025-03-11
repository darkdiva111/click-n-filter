
import React, { useState } from 'react';

interface TextEditorProps {
  onAddText: (text: { content: string; x: number; y: number; color: string; fontSize: number }) => void;
  onCancel: () => void;
  initialText?: { content: string; x: number; y: number; color: string; fontSize: number };
}

const TextEditor: React.FC<TextEditorProps> = ({ onAddText, onCancel, initialText }) => {
  const [text, setText] = useState(initialText?.content || '');
  const [color, setColor] = useState(initialText?.color || '#ffffff');
  const [fontSize, setFontSize] = useState(initialText?.fontSize || 24);
  const [fontStyle, setFontStyle] = useState('normal'); // normal, italic, bold, bold-italic
  
  const fontStyles = [
    { id: 'normal', label: 'Normal', style: 'normal', weight: 'normal' },
    { id: 'italic', label: 'Italic', style: 'italic', weight: 'normal' },
    { id: 'bold', label: 'Bold', style: 'normal', weight: 'bold' },
    { id: 'bold-italic', label: 'Bold Italic', style: 'italic', weight: 'bold' }
  ];
  
  const textColors = [
    '#ffffff', // white
    '#000000', // black
    '#ff0000', // red
    '#00ff00', // green
    '#0000ff', // blue
    '#ffff00', // yellow
    '#ff00ff', // magenta
    '#00ffff', // cyan
    '#ffa500', // orange
    '#800080'  // purple
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      return;
    }
    
    // Set default position in the center of the image
    // In a more advanced implementation, you would allow dragging the text to position it
    onAddText({
      content: text,
      x: 50, // Center horizontally (as percentage of image width)
      y: 50, // Center vertically (as percentage of image height)
      color,
      fontSize
    });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
      <h3 className="text-lg font-medium text-booth-primary mb-3">Add Text to Photo</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-booth-muted mb-1">
            Enter Text
          </label>
          <input
            type="text"
            id="text"
            className="w-full p-2 border border-booth-border rounded-md"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-booth-muted mb-1">
            Font Style
          </label>
          <div className="flex flex-wrap gap-2">
            {fontStyles.map(style => (
              <button
                key={style.id}
                type="button"
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  fontStyle === style.id
                    ? 'bg-booth-accent text-white'
                    : 'bg-booth-secondary/40 text-booth-primary hover:bg-booth-secondary/60'
                }`}
                onClick={() => setFontStyle(style.id)}
                style={{
                  fontStyle: style.style,
                  fontWeight: style.weight
                }}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-booth-muted mb-1">
            Text Color
          </label>
          <div className="flex flex-wrap gap-2">
            {textColors.map((textColor, index) => (
              <button
                key={index}
                type="button"
                className={`
                  w-8 h-8 rounded-full transition-all
                  ${color === textColor ? 'ring-2 ring-booth-accent ring-offset-2 scale-110' : 'hover:scale-105'}
                `}
                style={{ backgroundColor: textColor }}
                onClick={() => setColor(textColor)}
                aria-label={`Color ${index + 1}`}
              />
            ))}
            <div className="flex items-center">
              <input
                type="color"
                id="customColor"
                className="h-8 w-8 cursor-pointer rounded-full"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="fontSize" className="block text-sm font-medium text-booth-muted mb-1">
            Font Size: {fontSize}px
          </label>
          <input
            type="range"
            id="fontSize"
            min="12"
            max="72"
            className="w-full"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            className="px-4 py-2 border border-booth-border text-booth-muted rounded-md hover:bg-booth-secondary/20 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-booth-accent text-white rounded-md hover:bg-booth-accent/80 transition-colors"
          >
            Add Text
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextEditor;
