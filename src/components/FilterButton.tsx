
import React from 'react';
import { Filter } from '../utils/filters';

interface FilterButtonProps {
  filter: Filter;
  isActive: boolean;
  onSelect: (filterName: Filter['name']) => void;
  previewImage?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  filter, 
  isActive, 
  onSelect, 
  previewImage 
}) => {
  return (
    <button
      className={`
        filter-button rounded-lg overflow-hidden
        ${isActive ? 'ring-2 ring-booth-accent ring-offset-2' : 'border border-booth-border'}
      `}
      onClick={() => onSelect(filter.name)}
      aria-label={`Apply ${filter.label} filter`}
    >
      <div className="w-16 h-16 relative">
        {previewImage ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${previewImage})`,
              filter: filter.cssFilter
            }}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-booth-secondary/20`}
            style={{ filter: filter.cssFilter }}
          >
            <span className="text-xs text-center font-medium text-booth-primary">
              {filter.label}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};

export default FilterButton;
