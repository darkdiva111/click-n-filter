
import React, { useState, useEffect } from 'react';
import { FilterType, filters } from '../utils/filters';
import FilterButton from './FilterButton';

interface EditPanelProps {
  imageUrl: string | null;
  onApplyFilter: (filterName: FilterType) => void;
  selectedFilter: FilterType;
}

const EditPanel: React.FC<EditPanelProps> = ({ imageUrl, onApplyFilter, selectedFilter }) => {
  return (
    <div className="py-4 animate-slide-up">
      <h3 className="text-lg font-medium text-booth-primary mb-3">Filters</h3>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {filters.map((filter) => (
          <FilterButton
            key={filter.name}
            filter={filter}
            isActive={selectedFilter === filter.name}
            onSelect={onApplyFilter}
            previewImage={imageUrl || undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default EditPanel;
