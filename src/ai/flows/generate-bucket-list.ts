'use server';

/**
 * @fileOverview A personalized bucket list generator AI agent.
 *
 * - generatePersonalizedBucketList - A function that generates a personalized bucket list.
 * - GeneratePersonalizedBucketListInput - The input type for the generatePersonalizedBucketList function.
 * - GeneratePersonalizedBucketListOutput - The return type for the generatePersonalizedBucketList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateActivityImage } from './generate-activity-image';

const GeneratePersonalizedBucketListInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma-separated list of the user\'s interests and preferences.'),
  budget: z.string().optional().describe('The user\'s budget for the activities.'),
});
export type GeneratePersonalizedBucketListInput = z.infer<typeof GeneratePersonalizedBucketListInputSchema>;

const GeneratePersonalizedBucketListOutputSchema = z.object({
  bucketListItems: z.array(
    z.object({
      activity: z.string().describe('The name of the activity.'),
      description: z.string().describe('A brief description of the activity.'),
      imageUrl: z.string().optional().describe('URL of an image representing the activity.'),
    })
  ).describe('A list of personalized bucket list items.'),
});
export type GeneratePersonalizedBucketListOutput = z.infer<typeof GeneratePersonalizedBucketListOutputSchema>;

export async function generatePersonalizedBucketList(
  input: GeneratePersonalizedBucketListInput
): Promise<GeneratePersonalizedBucketListOutput> {
  return generatePersonalizedBucketListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedBucketListPrompt',
  input: {schema: GeneratePersonalizedBucketListInputSchema},
  output: {schema: GeneratePersonalizedBucketListOutputSchema},
  prompt: `You are a bucket list expert, skilled at creating personalized lists of activities and experiences for users.

  Based on the user's interests and preferences, and budget, generate a list of bucket list items.

  Interests and Preferences: {{{interests}}}
  {{#if budget}}
  Budget: {{{budget}}}
  {{/if}}

  Format the output as a JSON array of bucket list items, where each item has an activity and description.
  `,
});

const generatePersonalizedBucketListFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedBucketListFlow',
    inputSchema: GeneratePersonalizedBucketListInputSchema,
    outputSchema: GeneratePersonalizedBucketListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate bucket list");
    }

    const imageGenerationPromises = output.bucketListItems.map(item =>
      generateActivityImage({ activity: item.activity })
        .then(imageResult => ({ ...item, imageUrl: imageResult.imageUrl }))
        .catch(() => item)
    );
    
    const itemsWithImages = await Promise.all(imageGenerationPromises);

    return {
      bucketListItems: itemsWithImages
    };
  }
);

