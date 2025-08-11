'use server';

/**
 * @fileOverview A flow to estimate the cost of an activity for a bucket list.
 *
 * - estimateActivityCost - Estimates the cost of a given activity.
 * - EstimateActivityCostInput - The input type for the estimateActivityCost function.
 * - EstimateActivityCostOutput - The return type for the estimateActivityCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateActivityCostInputSchema = z.object({
  activity: z.string().describe('The bucket list activity to estimate the cost for.'),
  location: z.string().optional().describe('The location where the activity will take place. If not provided, cost will be estimated assuming an average cost.'),
});
export type EstimateActivityCostInput = z.infer<typeof EstimateActivityCostInputSchema>;

const EstimateActivityCostOutputSchema = z.object({
  estimatedCost: z.string().describe('The estimated cost of the activity, including currency.'),
  currency: z.string().describe('The currency of the estimated cost.'),
  costBreakdown: z.string().describe('A detailed breakdown of the estimated cost.'),
});
export type EstimateActivityCostOutput = z.infer<typeof EstimateActivityCostOutputSchema>;

export async function estimateActivityCost(input: EstimateActivityCostInput): Promise<EstimateActivityCostOutput> {
  return estimateActivityCostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateActivityCostPrompt',
  input: {schema: EstimateActivityCostInputSchema},
  output: {schema: EstimateActivityCostOutputSchema},
  prompt: `You are a cost estimator expert. You are provided with a bucket list activity and a location.

  Activity: {{{activity}}}
  Location: {{{location}}}

  Estimate the total cost of the activity.  Provide a detailed breakdown of the costs, including the currency.
  If no location is provided, give a general average estimate of the cost of the activity.  Consider that costs vary.
  Be as accurate as possible.
  Return a detailed breakdown of the cost, the estimated cost, and the currency.
  `,
});

const estimateActivityCostFlow = ai.defineFlow(
  {
    name: 'estimateActivityCostFlow',
    inputSchema: EstimateActivityCostInputSchema,
    outputSchema: EstimateActivityCostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
