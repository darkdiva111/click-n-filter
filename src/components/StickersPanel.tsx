
import React from 'react';

interface StickersPanelProps {
  onSelectSticker: (stickerUrl: string) => void;
}

const StickersPanel: React.FC<StickersPanelProps> = ({ onSelectSticker }) => {
  // Predefined list of emoji stickers
  const emojis = [
    "😀", "😍", "🥳", "😎", "🤩", 
    "❤️", "🔥", "✨", "🎉", "🌈",
    "👑", "💯", "🦄", "🍕", "🥂"
  ];
  
  // Predefined list of decorative stickers (these would be actual image URLs in a real implementation)
  const decorativeStickers = [
    { name: "Party Hat", emoji: "🎩" },
    { name: "Sunglasses", emoji: "👓" },
    { name: "Crown", emoji: "👑" },
    { name: "Mustache", emoji: "👨" },
    { name: "Lips", emoji: "👄" },
    { name: "Star Frame", emoji: "⭐" },
    { name: "Heart Frame", emoji: "💕" },
    { name: "Speech Bubble", emoji: "💬" },
  ];

  return (
    <div className="py-4 animate-slide-up">
      <h3 className="text-lg font-medium text-booth-primary mb-3">Stickers & Emojis</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-booth-muted mb-2">Emojis</h4>
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                className="bg-booth-secondary/40 hover:bg-booth-secondary/60 rounded-lg p-2 text-2xl transition-all"
                onClick={() => onSelectSticker(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-booth-muted mb-2">Decorative Stickers</h4>
          <div className="grid grid-cols-4 gap-2">
            {decorativeStickers.map((sticker, index) => (
              <button
                key={index}
                className="bg-booth-secondary/40 hover:bg-booth-secondary/60 rounded-lg p-3 flex flex-col items-center transition-all"
                onClick={() => onSelectSticker(`sticker-${sticker.name}`)}
              >
                <span className="text-2xl mb-1">{sticker.emoji}</span>
                <span className="text-xs text-booth-primary truncate w-full text-center">
                  {sticker.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <p className="text-xs text-booth-muted text-center mt-2">
          Click a sticker to add it to your photo
        </p>
      </div>
    </div>
  );
};

export default StickersPanel;
