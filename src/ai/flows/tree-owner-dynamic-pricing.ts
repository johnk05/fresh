'use server';
/**
 * @fileOverview This file implements a Genkit flow to provide AI-generated dynamic pricing suggestions for mangoes.
 *
 * - getDynamicPricingSuggestion - A function that handles the dynamic pricing suggestion process.
 * - TreeOwnerDynamicPricingInput - The input type for the getDynamicPricingSuggestion function.
 * - TreeOwnerDynamicPricingOutput - The return type for the getDynamicPricingSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TreeOwnerDynamicPricingInputSchema = z.object({
  treeType: z.string().describe('The type of mango tree (e.g., Alphonso, Priyoor, Neelum).'),
  estimatedQuantity: z.number().int().positive().describe('Estimated quantity of mangoes in kg.'),
  location: z.object({
    lat: z.number().describe('Latitude of the tree location.'),
    lng: z.number().describe('Longitude of the tree location.'),
  }).describe('The geographical location of the tree.'),
  qualityDescription: z.string().optional().describe('A brief description of the mango quality, if available.'),
  currentMarketPriceData: z.string().describe('Real-time market data for mangoes in Kerala, e.g., "Palakkad market Alphonso: 60-70 INR/kg, Ernakulam market Priyoor: 50-65 INR/kg".'),
  localDemandDescription: z.string().describe('A description of the current local demand for mangoes, e.g., "High demand due to festival season" or "Moderate demand, early season".'),
});
export type TreeOwnerDynamicPricingInput = z.infer<typeof TreeOwnerDynamicPricingInputSchema>;

const TreeOwnerDynamicPricingOutputSchema = z.object({
  suggestedPricePerKg: z.number().describe('The AI-generated suggested price per kg for the mangoes.'),
  reasoning: z.string().describe('An explanation of why this price is suggested, considering market data, tree characteristics, and local demand.'),
});
export type TreeOwnerDynamicPricingOutput = z.infer<typeof TreeOwnerDynamicPricingOutputSchema>;

export async function getDynamicPricingSuggestion(input: TreeOwnerDynamicPricingInput): Promise<TreeOwnerDynamicPricingOutput> {
  return treeOwnerDynamicPricingFlow(input);
}

const treeOwnerDynamicPricingPrompt = ai.definePrompt({
  name: 'treeOwnerDynamicPricingPrompt',
  input: {schema: TreeOwnerDynamicPricingInputSchema},
  output: {schema: TreeOwnerDynamicPricingOutputSchema},
  prompt: `You are an expert market analyst for fresh produce in Kerala.\nYour task is to provide a fair and competitive dynamic pricing suggestion for mangoes from a tree owner, based on the provided information.\n\nConsider the following details:\n- Tree Type: {{{treeType}}}\n- Estimated Quantity: {{{estimatedQuantity}}} kg\n- Location: Latitude {{{location.lat}}}, Longitude {{{location.lng}}}\n{{#if qualityDescription}}- Quality Description: {{{qualityDescription}}}\n{{/if}}- Real-time Kerala Market Data: {{{currentMarketPriceData}}}\n- Local Demand Description: {{{localDemandDescription}}}\n\nBased on this information, suggest a price per kilogram (in INR) that is competitive and fair for the tree owner, and provide a clear reasoning for your suggestion.`,
});

const treeOwnerDynamicPricingFlow = ai.defineFlow(
  {
    name: 'treeOwnerDynamicPricingFlow',
    inputSchema: TreeOwnerDynamicPricingInputSchema,
    outputSchema: TreeOwnerDynamicPricingOutputSchema,
  },
  async input => {
    const {output} = await treeOwnerDynamicPricingPrompt(input);
    return output!;
  }
);
