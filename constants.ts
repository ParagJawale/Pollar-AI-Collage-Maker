import { Type } from "@google/genai";
import type { CollageStyle } from "../types";

export const GEMINI_MODEL = 'gemini-2.5-flash';

const styleInstructions: Record<CollageStyle, string> = {
  Minimal: "Arrange the images in a clean, minimalist style with minimal overlap, straight angles (0-2 degrees rotation), and balanced spacing.",
  Dynamic: "Create a dynamic and energetic layout. Use a variety of rotations (between -15 and 15 degrees) and artistic overlaps to create a sense of movement and depth.",
  Overlap: "Create a heavily layered and overlapping collage, like a scrapbook. Focus on creating depth by stacking many images on top of each other with significant rotation and varied z-indexes.",
  Grid: "Arrange the images in a simple, uniform grid layout. The grid can have varying numbers of rows and columns. All images should be perfectly aligned with no rotation and minimal, consistent spacing between them.",
  Polaroid: "Arrange the images to look like scattered Polaroid photos. Each image should have a thick white border with a larger bottom margin for a caption. Suggest a short, fun, one or two-word caption for each photo based on its content. Include slight, varied rotations for a candid, scattered look."
};

export const COLLAGE_PROMPT = (imageCount: number, style: CollageStyle, color: string) => `
You are an expert collage designer. Your task is to create an aesthetically pleasing collage layout using ${imageCount} provided images.

**Style Guideline: ${style}**
${styleInstructions[style]}

**Background Color Guideline:**
Use the user-provided background color: "${color}". This color MUST be used for the 'backgroundColor' field in your response.

The collage container will have a specific width and height. All image positions and dimensions should be relative to this container, expressed in percentages for responsiveness.

**Caption Guideline (for Polaroid style only):**
If the style is 'Polaroid', you MUST generate a short, fun, one or two-word caption for each photo based on its visual content and include it in the 'caption' field. For all other styles, the 'caption' field should be omitted.

Please return a JSON object that strictly adheres to the provided schema. The output should only be the JSON object.
- The 'images' array in your response MUST contain exactly ${imageCount} items, corresponding to the input images in their original order.
- Ensure all images are mostly visible within the container bounds.
- The background color of the collage MUST be "${color}".
`;

export const COLLAGE_LAYOUT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    container: {
      type: Type.OBJECT,
      properties: {
        width: { type: Type.NUMBER, description: "The width of the collage container in pixels, e.g., 1000." },
        height: { type: Type.NUMBER, description: "The height of the collage container in pixels, e.g., 1000." },
        backgroundColor: { type: Type.STRING, description: "A hex code for the background color, e.g., #1A202C." },
      },
      required: ["width", "height", "backgroundColor"]
    },
    images: {
      type: Type.ARRAY,
      description: "An array of image layout objects, one for each input image in the order they were provided.",
      items: {
        type: Type.OBJECT,
        properties: {
          width: { type: Type.STRING, description: "The width of the image as a percentage of the container width (e.g., '30%')." },
          height: { type: Type.STRING, description: "The height of the image as a percentage of the container height (e.g., '40%')." },
          top: { type: Type.STRING, description: "The top position as a percentage of the container height (e.g., '10%')." },
          left: { type: Type.STRING, description: "The left position as a percentage of the container width (e.g., '5%')." },
          rotation: { type: Type.NUMBER, description: "The rotation in degrees (e.g., -5, 10)." },
          zIndex: { type: Type.NUMBER, description: "The stacking order (e.g., 1, 2, 3)." },
          caption: { type: Type.STRING, description: "An optional short caption for the image, especially for the Polaroid style (e.g., 'Fun times')." }
        },
        required: ["width", "height", "top", "left", "rotation", "zIndex"]
      },
    },
  },
  required: ["container", "images"]
};