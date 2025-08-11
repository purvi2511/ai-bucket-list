'use server';

/**
 * @fileOverview A flow to suggest the best time of year for a bucket list activity.
 *
 * - suggestActivityTiming - A function that suggests the best time of year for an activity.
 * - SuggestActivityTimingInput - The input type for the suggestActivityTiming function.
 * - SuggestActivityTimingOutput - The return type for the suggestActivityTiming function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActivityTimingInputSchema = z.object({
  activity: z.string().describe('The bucket list activity to find the best time for.'),
});
export type SuggestActivityTimingInput = z.infer<typeof SuggestActivityTimingInputSchema>;

const SuggestActivityTimingOutputSchema = z.object({
  bestTime: z
    .string()
    .describe(
      'The best time of year to do the activity, with a short explanation of why.'
    ),
});
export type SuggestActivityTimingOutput = z.infer<typeof SuggestActivityTimingOutputSchema>;

export async function suggestActivityTiming(
  input: SuggestActivityTimingInput
): Promise<SuggestActivityTimingOutput> {
  return suggestActivityTimingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActivityTimingPrompt',
  input: {schema: SuggestActivityTimingInputSchema},
  output: {schema: SuggestActivityTimingOutputSchema},
  prompt: `Suggest the best time of year to do the following activity, with a short explanation of why:\n\n{{activity}}`,
});

const suggestActivityTimingFlow = ai.defineFlow(
  {
    name: 'suggestActivityTimingFlow',
    inputSchema: SuggestActivityTimingInputSchema,
    outputSchema: SuggestActivityTimingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
