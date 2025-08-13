'use server';

/**
 * @fileOverview A flow to generate an image for a bucket list activity.
 *
 * - generateActivityImage - Generates an image for a given activity.
 * - GenerateActivityImageInput - The input type for the generateActivityImage function.
 * - GenerateActivityImageOutput - The return type for the generateActivityImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateActivityImageInputSchema = z.object({
  activity: z.string().describe('The bucket list activity to generate an image for.'),
});
export type GenerateActivityImageInput = z.infer<typeof GenerateActivityImageInputSchema>;

const GenerateActivityImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateActivityImageOutput = z.infer<typeof GenerateActivityImageOutputSchema>;


export async function generateActivityImage(input: GenerateActivityImageInput): Promise<GenerateActivityImageOutput> {
  return generateActivityImageFlow(input);
}

const generateActivityImageFlow = ai.defineFlow(
  {
    name: 'generateActivityImageFlow',
    inputSchema: GenerateActivityImageInputSchema,
    outputSchema: GenerateActivityImageOutputSchema,
  },
  async ({ activity }) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A vibrant, high-quality, photorealistic image representing the activity: ${activity}. The image should be inspiring and visually appealing.`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed.');
    }

    return {
        imageUrl: media.url,
    };
  }
);
