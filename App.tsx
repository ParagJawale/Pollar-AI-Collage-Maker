import React, { useState, useCallback, useRef } from 'react';
import type { UploadedImage, CollageLayout, CollageStyle, FilterStyle, Background } from './types';
import { generateCollageLayout, generateBackgroundImage } from './services/geminiService';
import Header from './components/Header';
import ImageManager from './components/ImageManager';
import CollageDisplay from './components/CollageDisplay';
import Button from './components/Button';
import { DownloadIcon, SparklesIcon, ResetViewIcon } from './components/icons';
import Spinner from './components/Spinner';
import CollageControls from './components/CollageControls';

// For using html-to-image from CDN
declare const htmlToImage: any;

export default function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [collageLayout, setCollageLayout] = useState<CollageLayout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingBackground, setIsGeneratingBackground] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [collageStyle, setCollageStyle] = useState<CollageStyle>('Dynamic');
  const [background, setBackground] = useState<Background>({ type: 'color', value: '#111827' });
  
  // State for zoom and pan
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const collageRef = useRef<HTMLDivElement>(null);

  const handleImagesChange = useCallback((newImages: UploadedImage[]) => {
    setImages(newImages);
    setCollageLayout(null); // Reset collage if images change
  }, []);
  
  const handleFilterChange = useCallback((id: string, filter: FilterStyle) => {
    setImages(prevImages =>
      prevImages.map(image =>
        image.id === id ? { ...image, filter: filter === 'none' ? undefined : filter } : image
      )
    );
  }, []);

  const handleGenerateCollage = async () => {
    if (images.length < 2) {
      setError('Please upload at least 2 images to create a collage.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCollageLayout(null);

    try {
      const files = images.map(img => img.file);
      const layout = await generateCollageLayout(files, collageStyle, background.type === 'color' ? background.value : '#111827');
      setCollageLayout(layout);
      setScale(1);
      setPosition({ x: 0, y: 0 });

      if (layout.container.backgroundColor && background.type === 'color') {
        setBackground({ type: 'color', value: layout.container.backgroundColor });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate collage. The AI may be busy, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBackground = async (prompt: string) => {
    if (!prompt) {
      setError('Please enter a prompt for the background image.');
      return;
    }
    setIsGeneratingBackground(true);
    setError(null);
    try {
      const imageDataUrl = await generateBackgroundImage(prompt);
      setBackground({ type: 'generated', value: imageDataUrl, prompt });
    } catch (err) {
      console.error(err);
      setError('Failed to generate background image. Please try again.');
    } finally {
      setIsGeneratingBackground(false);
    }
  };

  const handleBackgroundImageUpload = (file: File) => {
    // Clean up old object URL if it exists
    if (background.type === 'image') {
      URL.revokeObjectURL(background.value);
    }
    const previewUrl = URL.createObjectURL(file);
    setBackground({ type: 'image', value: previewUrl, file });
  };

  const handleExport = async (format: 'png' | 'jpeg') => {
    if (!collageRef.current) return;
    
    const originalTransform = collageRef.current.style.transform;
    collageRef.current.style.transform = 'translate(0px, 0px) scale(1)';

    try {
      const options = background.type === 'color' ? { backgroundColor: background.value } : {};
      let dataUrl;
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(collageRef.current, options);
      } else {
        dataUrl = await htmlToImage.toJpeg(collageRef.current, { ...options, quality: 0.95 });
      }
      const link = document.createElement('a');
      link.download = `ai-collage.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export the collage. Please try again.');
    } finally {
      if (collageRef.current) {
        collageRef.current.style.transform = originalTransform;
      }
    }
  };
  
  const handleResetTransform = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <ImageManager 
                images={images} 
                onImagesChange={handleImagesChange} 
                onFilterChange={handleFilterChange} 
              />
              
              {images.length > 1 && (
                <>
                  <CollageControls
                    selectedStyle={collageStyle}
                    onStyleChange={setCollageStyle}
                    background={background}
                    onBackgroundChange={setBackground}
                    onGenerateBackground={handleGenerateBackground}
                    onBackgroundImageUpload={handleBackgroundImageUpload}
                    isGeneratingBackground={isGeneratingBackground}
                    disabled={isLoading}
                  />
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <Button 
                      onClick={handleGenerateCollage} 
                      disabled={isLoading || isGeneratingBackground}
                      className="w-full"
                    >
                      <SparklesIcon />
                      {isLoading ? 'Generating Collage...' : `Generate ${collageStyle} Collage`}
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 min-h-[400px] lg:min-h-[600px] flex flex-col items-center justify-center">
              {isLoading && (
                <div className="text-center">
                  <Spinner />
                  <p className="mt-4 text-lg text-gray-400 animate-pulse">AI is crafting your collage...</p>
                </div>
              )}
              {error && !isLoading && (
                <div className="text-center text-red-400">
                  <h3 className="text-xl font-bold">An Error Occurred</h3>
                  <p className="mt-2">{error}</p>
                </div>
              )}
              {!isLoading && !error && collageLayout && (
                <div className="w-full flex flex-col gap-4 animate-fade-in-up">
                  <CollageDisplay 
                    ref={collageRef} 
                    layout={collageLayout} 
                    images={images}
                    background={background}
                    scale={scale}
                    position={position}
                    setScale={setScale}
                    setPosition={setPosition}
                  />
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <Button onClick={() => handleExport('png')} variant="secondary">
                      <DownloadIcon /> Export as PNG
                    </Button>
                    <Button onClick={() => handleExport('jpeg')} variant="secondary">
                      <DownloadIcon /> Export as JPG
                    </Button>
                     <Button onClick={handleResetTransform} variant="secondary" title="Reset view">
                      <ResetViewIcon /> Reset View
                    </Button>
                  </div>
                </div>
              )}
              {!isLoading && !error && !collageLayout && (
                 <div className="text-center text-gray-500">
                  <p className="text-xl">Your beautiful collage will appear here.</p>
                  <p className="mt-2">Upload your images and click "Generate Collage" to start.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}