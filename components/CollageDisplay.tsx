import React, { forwardRef, useRef } from 'react';
import type { CollageLayout, UploadedImage, FilterStyle, Background } from '../types';

interface CollageDisplayProps {
  layout: CollageLayout;
  images: UploadedImage[];
  background: Background;
  scale: number;
  position: { x: number; y: number };
  setScale: React.Dispatch<React.SetStateAction<number>>;
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

const filterToCss: Record<FilterStyle, string> = {
  none: 'none',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  invert: 'invert(100%)',
};

const CollageDisplay = forwardRef<HTMLDivElement, CollageDisplayProps>(({ layout, images, background, scale, position, setScale, setPosition }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  if (!layout || images.length === 0) {
    return null;
  }

  const { container, images: imageLayouts } = layout;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const zoomFactor = 1.1;
    const newScale = e.deltaY > 0 ? scale / zoomFactor : scale * zoomFactor;
    const clampedScale = Math.max(0.25, Math.min(newScale, 4)); // Clamp scale

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    const newX = mouseX - (mouseX - position.x) * (clampedScale / scale);
    const newY = mouseY - (mouseY - position.y) * (clampedScale / scale);
    
    setScale(clampedScale);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isPanningRef.current = true;
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanningRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    panStartRef.current = { x: e.clientX, y: e.clientY };
    setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleMouseUpOrLeave = () => {
    isPanningRef.current = false;
  };
  
  const backgroundStyle = background.type === 'color'
    ? { backgroundColor: background.value }
    : {
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      <div
        ref={ref}
        className="relative w-full overflow-hidden shadow-2xl rounded-lg transition-transform duration-75 ease-out"
        style={{
          aspectRatio: `${container.width} / ${container.height}`,
          ...backgroundStyle,
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {imageLayouts.map((style, index) => {
          const image = images[index];
          if (!image) return null;
          
          // Check for Polaroid style by looking for the caption property
          if (style.caption !== undefined) {
            return (
              <div
                key={image.id}
                className="absolute flex flex-col p-2 pb-6 bg-white shadow-lg"
                style={{
                  width: style.width,
                  height: style.height,
                  top: style.top,
                  left: style.left,
                  transform: `rotate(${style.rotation}deg)`,
                  zIndex: style.zIndex,
                  boxSizing: 'border-box'
                }}
              >
                <img
                  src={image.previewUrl}
                  alt={`Collage element ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    filter: image.filter ? filterToCss[image.filter] : 'none',
                  }}
                />
                <p 
                  className="absolute bottom-1 left-2 right-2 text-center text-xs text-gray-800 truncate"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  {style.caption}
                </p>
              </div>
            );
          }
          
          return (
            <img
              key={image.id}
              src={image.previewUrl}
              alt={`Collage element ${index + 1}`}
              className="absolute object-cover shadow-lg"
              style={{
                width: style.width,
                height: style.height,
                top: style.top,
                left: style.left,
                transform: `rotate(${style.rotation}deg)`,
                zIndex: style.zIndex,
                border: '2px solid white',
                filter: image.filter ? filterToCss[image.filter] : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
});

CollageDisplay.displayName = 'CollageDisplay';

export default CollageDisplay;