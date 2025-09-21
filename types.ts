export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  filter?: FilterStyle;
}

export interface CollageImageLayout {
  width: string;
  height: string;
  top: string;
  left: string;
  rotation: number;
  zIndex: number;
  caption?: string; // For Polaroid style
}

export interface CollageLayout {
  container: {
    width: number;
    height: number;
    backgroundColor: string;
  };
  images: CollageImageLayout[];
}

export type CollageStyle = 'Dynamic' | 'Minimal' | 'Overlap' | 'Grid' | 'Polaroid';

export type FilterStyle = 'none' | 'grayscale' | 'sepia' | 'invert';

// A new type to handle different kinds of backgrounds
export type Background =
  | { type: 'color'; value: string }
  | { type: 'image'; value: string; file: File } // value is a previewUrl
  | { type: 'generated'; value: string; prompt: string }; // value is a base64 data url