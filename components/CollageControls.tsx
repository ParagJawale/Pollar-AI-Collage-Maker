import React, { useState, useEffect, useRef } from 'react';
import type { CollageStyle, Background } from '../types';
import { SparklesIcon, UploadIcon, TrashIcon } from './icons';
import Button from './Button';

const STYLES: { id: CollageStyle; label: string; description: string }[] = [
  { id: 'Dynamic', label: 'Dynamic', description: 'Energetic and creative.' },
  { id: 'Minimal', label: 'Minimal', description: 'Clean and balanced.' },
  { id: 'Overlap', label: 'Overlap', description: 'Layered and scrapbook-like.' },
  { id: 'Grid', label: 'Grid', description: 'Structured and uniform.' },
  { id: 'Polaroid', label: 'Polaroid', description: 'Vintage and scattered look.' },
];

const BACKGROUND_TABS: { id: Background['type'], label: string }[] = [
    { id: 'color', label: 'Color' },
    { id: 'image', label: 'Image' },
    { id: 'generated', label: 'Generate AI' }
];

// Visual preview component for each template style
const TemplatePreview: React.FC<{ style: CollageStyle }> = ({ style }) => {
  const commonBox = "absolute rounded-sm";
  const bg1 = "bg-slate-400";
  const bg2 = "bg-slate-500";
  const bg3 = "bg-slate-600";

  return (
    <div className="relative w-16 h-12 scale-90 flex-shrink-0 mb-1">
      {(() => {
        switch (style) {
          case 'Dynamic':
            return <>
              <div className={`${commonBox} w-8 h-6 ${bg1} top-1 left-1 transform -rotate-12`}></div>
              <div className={`${commonBox} w-10 h-5 ${bg2} top-4 left-6 transform rotate-6`}></div>
              <div className={`${commonBox} w-6 h-8 ${bg3} top-2 left-4`}></div>
            </>;
          case 'Minimal':
            return <>
              <div className={`${commonBox} w-10 h-6 ${bg1} top-1 left-1`}></div>
              <div className={`${commonBox} w-4 h-9 ${bg2} top-1 right-1`}></div>
            </>;
          case 'Overlap':
            return <>
              <div className={`${commonBox} w-8 h-6 ${bg1} top-1 left-1 transform -rotate-6 z-10`}></div>
              <div className={`${commonBox} w-10 h-6 ${bg2} top-3 left-4 z-20`}></div>
              <div className={`${commonBox} w-6 h-6 ${bg3} top-6 left-1 z-0`}></div>
            </>;
          case 'Grid':
            return (
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5">
                <div className={`rounded-sm ${bg1}`}></div>
                <div className={`rounded-sm ${bg2}`}></div>
                <div className={`rounded-sm ${bg3}`}></div>
                <div className={`rounded-sm ${bg1}`}></div>
              </div>
            );
          case 'Polaroid':
            return <>
              <div className={`${commonBox} w-7 h-8 p-0.5 bg-white top-1 left-2 transform -rotate-12`}>
                <div className={`w-full h-full ${bg1}`}></div>
              </div>
              <div className={`${commonBox} w-7 h-8 p-0.5 bg-white top-3 left-8 transform rotate-6`}>
                <div className={`w-full h-full ${bg2}`}></div>
              </div>
            </>;
          default:
            return null;
        }
      })()}
    </div>
  );
};


interface CollageControlsProps {
  selectedStyle: CollageStyle;
  onStyleChange: (style: CollageStyle) => void;
  background: Background;
  onBackgroundChange: (background: Background) => void;
  onGenerateBackground: (prompt: string) => void;
  onBackgroundImageUpload: (file: File) => void;
  isGeneratingBackground: boolean;
  disabled?: boolean;
}

export default function CollageControls({
  selectedStyle,
  onStyleChange,
  background,
  onBackgroundChange,
  onGenerateBackground,
  onBackgroundImageUpload,
  isGeneratingBackground,
  disabled = false,
}: CollageControlsProps) {
  const [activeTab, setActiveTab] = useState<Background['type']>(background.type);
  // FIX: Use a lazy initializer for useState to allow TypeScript to correctly
  // narrow the discriminated union type and safely access `background.prompt`.
  const [prompt, setPrompt] = useState(() => {
    if (background.type === 'generated') {
        return background.prompt;
    }
    return 'A soft, abstract watercolor texture';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FIX: The dependency array was accessing `background.prompt` unsafely.
  // By depending on the whole `background` object, the effect will correctly
  // re-run on any change, and the type guard inside will work as expected.
  useEffect(() => {
    // Sync active tab if background type is changed externally
    setActiveTab(background.type);
    if(background.type === 'generated') {
        setPrompt(background.prompt);
    }
  }, [background]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onBackgroundImageUpload(event.target.files[0]);
    }
    // Reset input to allow re-uploading the same file
    if(event.target) event.target.value = '';
  };
  
  const handleRemoveImage = () => {
    onBackgroundChange({ type: 'color', value: '#111827' });
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col gap-6">
      {/* Style Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">1. Select a Template</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              disabled={disabled}
              aria-pressed={selectedStyle === style.id}
              aria-label={`Select ${style.label} template`}
              className={`flex flex-col items-center justify-start text-center p-3 border-2 rounded-md h-full transition-all duration-200 ${selectedStyle === style.id ? 'border-indigo-500 bg-indigo-900/50 text-white' : 'border-gray-600 bg-gray-700/50 text-gray-400'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-indigo-400 hover:bg-indigo-900/30'}`}
            >
              <TemplatePreview style={style.id} />
              <span className="font-bold text-sm leading-tight">{style.label}</span>
              <span className="text-xs mt-1 text-gray-500">{style.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Background Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">2. Choose Background</h3>
        <div className="flex border-b border-gray-700">
            {BACKGROUND_TABS.map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id)} disabled={disabled} className={`px-4 py-2 text-sm font-medium transition-colors duration-200 disabled:opacity-50 ${activeTab === tab.id ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
                    {tab.label}
                 </button>
            ))}
        </div>
        <div className="pt-4">
            {activeTab === 'color' && (
                <div className="flex items-center gap-4">
                     <label htmlFor="color-picker" className="sr-only">Custom Background Color</label>
                     <input type="color" id="color-picker" value={background.type === 'color' ? background.value : '#111827'} onChange={(e) => onBackgroundChange({ type: 'color', value: e.target.value })} disabled={disabled} className="p-0 h-12 w-24 block bg-gray-700 border-2 border-gray-600 cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500" />
                     <p className="text-sm text-gray-400">Select a solid color for the background.</p>
                </div>
            )}
            {activeTab === 'image' && (
                 <div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple={false} accept="image/png, image/jpeg, image/webp" className="hidden" />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={disabled} variant="secondary"><UploadIcon /> Upload Image</Button>
                    {background.type === 'image' && (
                        <div className="mt-4 flex items-center gap-4">
                            <img src={background.value} alt="Background preview" className="w-16 h-16 rounded-md object-cover border-2 border-gray-600" />
                            <p className="text-sm text-gray-400 flex-grow">Image uploaded.</p>
                            <button onClick={handleRemoveImage} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors" aria-label="Remove background image"><TrashIcon /></button>
                        </div>
                    )}
                 </div>
            )}
            {activeTab === 'generated' && (
                <div className="flex flex-col gap-3">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} disabled={disabled || isGeneratingBackground} placeholder="e.g., a serene mountain landscape" rows={2} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50" />
                    <Button onClick={() => onGenerateBackground(prompt)} disabled={disabled || isGeneratingBackground} className="self-start"><SparklesIcon /> {isGeneratingBackground ? 'Generating...' : 'Generate'}</Button>
                    {background.type === 'generated' && (
                         <div className="mt-2 flex items-center gap-4">
                            <img src={background.value} alt="Generated background preview" className="w-16 h-16 rounded-md object-cover border-2 border-gray-600" />
                            <p className="text-sm text-gray-400 flex-grow">AI background generated.</p>
                            <button onClick={handleRemoveImage} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors" aria-label="Remove background image"><TrashIcon /></button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}