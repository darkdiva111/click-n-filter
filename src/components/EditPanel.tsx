
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterType, filters } from '../utils/filters';
import FilterButton from './FilterButton';
import AdjustmentPanel from './AdjustmentPanel';
import TextEditor from './TextEditor';
import StickersPanel from './StickersPanel';
import FramesPanel from './FramesPanel';
import { Sliders, Type, Sticker, Frame } from 'lucide-react';

interface EditPanelProps {
  imageUrl: string | null;
  onApplyFilter: (filterName: FilterType) => void;
  selectedFilter: FilterType;
  onApplyAdjustment: (type: string, value: number) => void;
  onAddText: (text: { content: string; x: number; y: number; color: string; fontSize: number }) => void;
  onAddSticker: (stickerUrl: string) => void;
  onSelectFrame: (frameType: string, frameColor: string) => void;
  selectedFrame: { type: string; color: string } | null;
  onCancelTextEdit: () => void;
}

const EditPanel: React.FC<EditPanelProps> = ({ 
  imageUrl, 
  onApplyFilter, 
  selectedFilter,
  onApplyAdjustment,
  onAddText,
  onAddSticker,
  onSelectFrame,
  selectedFrame,
  onCancelTextEdit
}) => {
  const [activeTab, setActiveTab] = useState("filters");

  return (
    <div className="py-4 animate-slide-up">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="filters" className="flex items-center gap-1">
            <img src="/filter-icon.svg" alt="" className="w-4 h-4" />
            <span>Filters</span>
          </TabsTrigger>
          <TabsTrigger value="adjustments" className="flex items-center gap-1">
            <Sliders className="w-4 h-4" />
            <span>Adjust</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-1">
            <Type className="w-4 h-4" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="stickers" className="flex items-center gap-1">
            <Sticker className="w-4 h-4" />
            <span>Stickers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filters" className="mt-0">
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
        </TabsContent>

        <TabsContent value="adjustments" className="mt-0">
          <AdjustmentPanel onApplyAdjustment={onApplyAdjustment} />
        </TabsContent>

        <TabsContent value="text" className="mt-0">
          <TextEditor onAddText={onAddText} onCancel={onCancelTextEdit} />
        </TabsContent>

        <TabsContent value="stickers" className="mt-0">
          <StickersPanel onSelectSticker={onAddSticker} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditPanel;
