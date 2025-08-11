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

const GeneratePersonalizedBucketListInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma-separated list of the user\'s interests and preferences.'),
  limitations: z
    .string()
    .optional()
    .describe('Any limitations or constraints the user has (e.g., budget, time, physical limitations).'),
});
export type GeneratePersonalizedBucketListInput = z.infer<typeof GeneratePersonalizedBucketListInputSchema>;

const GeneratePersonalizedBucketListOutputSchema = z.object({
  bucketListItems: z.array(
    z.object({
      activity: z.string().describe('The name of the activity.'),
      description: z.string().describe('A brief description of the activity.'),
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

  Based on the user's interests and preferences, and taking into account any limitations they have, generate a list of bucket list items.

  Interests and Preferences: {{{interests}}}
  Limitations: {{{limitations}}}

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
    return output!;
  }
);
