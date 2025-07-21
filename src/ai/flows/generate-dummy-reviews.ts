'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating dummy reviews for a business.
 *
 * The flow takes a business name and website as input and returns an array of dummy review objects.
 * - generateDummyReviews - A function that generates dummy reviews for a business.
 * - GenerateDummyReviewsInput - The input type for the generateDummyReviews function.
 * - GenerateDummyReviewsOutput - The return type for the generateDummyReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDummyReviewsInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  website: z.string().describe('The website URL of the business.'),
});
export type GenerateDummyReviewsInput = z.infer<typeof GenerateDummyReviewsInputSchema>;

const GenerateDummyReviewsOutputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the reviewer.'),
    stars: z.number().min(1).max(5).describe('The star rating given by the reviewer.'),
    text: z.string().describe('The text of the review.'),
    source: z.string().describe('The source of the review (e.g., Google, Facebook).'),
  })
);
export type GenerateDummyReviewsOutput = z.infer<typeof GenerateDummyReviewsOutputSchema>;

export async function generateDummyReviews(input: GenerateDummyReviewsInput): Promise<GenerateDummyReviewsOutput> {
  return generateDummyReviewsFlow(input);
}

const generateDummyReviewsPrompt = ai.definePrompt({
  name: 'generateDummyReviewsPrompt',
  input: {schema: GenerateDummyReviewsInputSchema},
  output: {schema: GenerateDummyReviewsOutputSchema},
  prompt: `You are an expert in generating realistic and diverse customer reviews for businesses.

  Given the business name and website, create 5 dummy reviews with realistic names, star ratings, review texts, and review sources like Google or Facebook. Vary the review sentiment (positive, negative and neutral) as well.

  Business Name: {{{businessName}}}
  Website: {{{website}}}
  Reviews:`, // Keep it concise, the LLM should return the object directly
});

const generateDummyReviewsFlow = ai.defineFlow(
  {
    name: 'generateDummyReviewsFlow',
    inputSchema: GenerateDummyReviewsInputSchema,
    outputSchema: GenerateDummyReviewsOutputSchema,
  },
  async input => {
    const {output} = await generateDummyReviewsPrompt(input);
    return output!;
  }
);
