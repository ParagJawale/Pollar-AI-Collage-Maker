import React, { useRef, useCallback, useState } from 'react';
import type { UploadedImage, FilterStyle } from '../types';
import { AddImageIcon, TrashIcon, FilterIcon } from './icons';

interface ImageManagerProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  onFilterChange: (id: string, filter: FilterStyle) => void;
}

const filterToCss: Record<FilterStyle, string> = {
  none: 'none',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  invert: 'invert(100%)',
};

const FILTERS: { id: FilterStyle, label: string }[] = [
    { id: 'grayscale', label: 'Grayscale' },
    { id: 'sepia', label: 'Sepia' },
    { id: 'invert', label: 'Invert' },
    { id: 'none', label: 'None' },
];

const ImagePreview: React.FC<{ 
  image: UploadedImage; 
  onRemove: (id: string) => void;
  onFilterChange: (id: string, filter: FilterStyle) => void;
}> = ({ image, onRemove, onFilterChange }) => {
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);

  return (
    <div className="relative group w-full h-full">
      <img 
        src={image.previewUrl} 
        alt={image.file.name} 
        className="w-full h-full object-cover rounded-md shadow-md transition-all duration-300"
        style={{ filter: image.filter ? filterToCss[image.filter] : 'none' }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center gap-2 rounded-md">
        {/* Remove Button */}
        <button
          onClick={() => onRemove(image.id)}
          className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Remove image"
        >
          <TrashIcon />
        </button>
        {/* Filter Button */}
        <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(prev => !prev)}
              className="p-2 bg-gray-700 text-white rounded-full opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Apply filter"
            >
              <FilterIcon />
            </button>
            {isFilterMenuOpen && (
                <div 
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-28 bg-gray-800 rounded-md shadow-lg z-10 p-1"
                    onMouseLeave={() => setFilterMenuOpen(false)}
                >
                    {FILTERS.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => {
                                onFilterChange(image.id, filter.id);
                                setFilterMenuOpen(false);
                            }}
                            className="w-full text-left text-sm px-3 py-1.5 rounded text-gray-300 hover:bg-indigo-600 hover:text-white"
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default function ImageManager({ images, onImagesChange, onFilterChange }: ImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const newImages: UploadedImage[] = newFiles.map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      onImagesChange([...images, ...newImages]);
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleRemoveImage = useCallback((id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if(imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    onImagesChange(images.filter(image => image.id !== id));
  }, [images, onImagesChange]);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Your Images</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {images.map(image => (
          <div key={image.id} className="aspect-square">
            <ImagePreview 
                image={image} 
                onRemove={handleRemoveImage} 
                onFilterChange={onFilterChange}
            />
          </div>
        ))}
        <div className="aspect-square">
          <button
            onClick={handleAddClick}
            className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-indigo-400 text-gray-500 hover:text-indigo-400 rounded-md transition-all duration-300"
          >
            <AddImageIcon />
            <span className="text-sm mt-1">Add</span>
          </button>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
    </div>
  );
}