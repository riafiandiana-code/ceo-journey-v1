'use server';
/**
 * @fileOverview A Genkit flow for generating a weekly news headline for the game.
 *
 * - generateWeeklyNewsHeadline - A function that generates a single news headline.
 * - GenerateWeeklyNewsHeadlineInput - The input type for the generateWeeklyNewsHeadline function.
 * - GenerateWeeklyNewsHeadlineOutput - The return type for the generateWeeklyNewsHeadline function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateWeeklyNewsHeadlineInputSchema = z.object({
  currentDate: z.string().describe('The current game date or week to contextualize the news.').default('Upcoming Week'),
});
export type GenerateWeeklyNewsHeadlineInput = z.infer<typeof GenerateWeeklyNewsHeadlineInputSchema>;

const GenerateWeeklyNewsHeadlineOutputSchema = z.object({
  headline: z.string().describe('A single, concise news headline for the game world.'),
});
export type GenerateWeeklyNewsHeadlineOutput = z.infer<typeof GenerateWeeklyNewsHeadlineOutputSchema>;

export async function generateWeeklyNewsHeadline(input: GenerateWeeklyNewsHeadlineInput): Promise<GenerateWeeklyNewsHeadlineOutput> {
  return generateWeeklyNewsHeadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklyNewsHeadlinePrompt',
  input: { schema: GenerateWeeklyNewsHeadlineInputSchema },
  output: { schema: GenerateWeeklyNewsHeadlineOutputSchema },
  prompt: `You are a news reporter for a business simulation game.
Your task is to generate a single, concise news headline for the current game week, dated: {{{currentDate}}}.
The headline should be relevant to a dynamic economy, potentially influencing investment decisions in stocks, crypto, or commodities. Consider market trends, corporate news, or global economic events.
Make it sound like a real news headline. Do not include any introductory or concluding remarks, just the headline itself.`,
});

const generateWeeklyNewsHeadlineFlow = ai.defineFlow(
  {
    name: 'generateWeeklyNewsHeadlineFlow',
    inputSchema: GenerateWeeklyNewsHeadlineInputSchema,
    outputSchema: GenerateWeeklyNewsHeadlineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
