import { GoogleGenAI } from "@google/genai";
import type { CollageLayout, CollageStyle } from '../types';
import { GEMINI_MODEL, COLLAGE_PROMPT, COLLAGE_LAYOUT_SCHEMA } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix e.g. "data:image/png;base64,"
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateCollageLayout = async (files: File[], style: CollageStyle, backgroundColor: string): Promise<CollageLayout> => {
  const imageParts = await Promise.all(
    files.map(async (file) => {
      const base64Data = await fileToBase64(file);
      return {
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      };
    })
  );

  const textPart = {
    text: COLLAGE_PROMPT(files.length, style, backgroundColor)
  };

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: { parts: [textPart, ...imageParts] },
    config: {
      responseMimeType: "application/json",
      responseSchema: COLLAGE_LAYOUT_SCHEMA,
    },
  });

  try {
    const jsonString = response.text.trim();
    const layout = JSON.parse(jsonString) as CollageLayout;
    
    if (layout.images.length !== files.length) {
      throw new Error("AI returned an incorrect number of image layouts.");
    }

    return layout;
  } catch (e) {
    console.error("Failed to parse AI response:", response.text);
    throw new Error("The AI returned an invalid layout. Please try again.");
  }
};

export const generateBackgroundImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: `A beautiful, aesthetically pleasing background image for a photo collage. Style: ${prompt}. The image should be visually interesting but not distracting. Avoid text or prominent figures.`,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '1:1',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
  } else {
    throw new Error("AI failed to generate a background image.");
  }
};
