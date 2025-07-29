'use server';
/**
 * @fileOverview A flow for extracting review information from a custom text format.
 *
 * - extractReview - A function that handles the review extraction process.
 * - ExtractReviewInput - The input type for the extractReview function.
 * - ExtractReviewOutput - The return type for the extractReview function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractReviewInputSchema = z.object({
  text: z.string().describe('The text blob containing the reviews in the custom format.'),
});
export type ExtractReviewInput = z.infer<typeof ExtractReviewInputSchema>;

const ExtractReviewOutputSchema = z.object({
  source: z.string().describe('The name of the social network or origin of the reviews.'),
  reviews: z.array(z.object({
    name: z.string().describe('The name of the reviewer.'),
    stars: z.number().min(1).max(5).describe('The star rating given in the review.'),
    text: z.string().describe('The full text content of the review.'),
  })),
});
export type ExtractReviewOutput = z.infer<typeof ExtractReviewOutputSchema>;

export async function extractReview(input: ExtractReviewInput): Promise<ExtractReviewOutput> {
  return extractReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractReviewPrompt',
  input: { schema: ExtractReviewInputSchema },
  output: { schema: ExtractReviewOutputSchema },
  prompt: `You are an expert at parsing and extracting structured data from custom text formats.
Your task is to analyze the provided text and extract the review source and all customer reviews.

The format will be:
reviews (source name){ { User: "...", Rate: X, commentary: "..." }, { ... } }

For each review, you must identify the reviewer's name (User), the star rating (Rate), and the full review text (commentary).
Return an object containing the source and an array of all the reviews you find.

Extract the data from the following text:
{{{text}}}
`
});

const extractReviewFlow = ai.defineFlow(
  {
    name: 'extractReviewFlow',
    inputSchema: ExtractReviewInputSchema,
    outputSchema: ExtractReviewOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
