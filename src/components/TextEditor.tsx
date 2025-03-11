
import React, { useState } from 'react';

interface TextEditorProps {
  onAddText: (text: { content: string; x: number; y: number; color: string; fontSize: number }) => void;
  onCancel: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ onAddText, onCancel }) => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  
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
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-booth-muted mb-1">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="color"
                className="h-8 w-8 cursor-pointer"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <span className="text-sm text-booth-muted">{color}</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="fontSize" className="block text-sm font-medium text-booth-muted mb-1">
              Font Size
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="fontSize"
                min="12"
                max="48"
                className="w-full"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
              <span className="text-sm text-booth-muted">{fontSize}px</span>
            </div>
          </div>
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
