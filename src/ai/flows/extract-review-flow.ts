'use server';
/**
 * @fileOverview A flow for extracting review information from a webpage.
 *
 * - extractReview - A function that handles the review extraction process.
 * - ExtractReviewInput - The input type for the extractReview function.
 * - ExtractReviewOutput - The return type for the extractReview function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scrapeWebsite } from '@/lib/scraping';

const ExtractReviewInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to extract the review from.'),
});
export type ExtractReviewInput = z.infer<typeof ExtractReviewInputSchema>;

const ExtractReviewOutputSchema = z.object({
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

const extractReviewTool = ai.defineTool(
    {
      name: 'extractReviewTool',
      description: 'A tool to scrape a website and extract its main content.',
      inputSchema: z.object({ url: z.string().url() }),
      outputSchema: z.string(),
    },
    async (input) => {
      try {
        const content = await scrapeWebsite(input.url);
        return content;
      } catch (error) {
        console.error('Error scraping website:', error);
        return 'Failed to scrape the website.';
      }
    }
);

const prompt = ai.definePrompt({
  name: 'extractReviewPrompt',
  input: { schema: ExtractReviewInputSchema },
  output: { schema: ExtractReviewOutputSchema },
  tools: [extractReviewTool],
  prompt: `You are an expert at extracting structured data from web content.
  Your task is to analyze the provided text content from the URL and extract all customer reviews.
  For each review, you must identify the reviewer's name, the star rating (as a number from 1 to 5), and the full review text.
  If a review does not have a star rating, estimate one based on the sentiment of the text.
  Return an array of all the reviews you find.

  Use the provided tool to scrape the content of the URL: {{{url}}}`
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
