'use server';
/**
 * @fileOverview A Genkit flow to generate a unique, context-aware weekly event based on character status.
 *
 * - generateWeeklyEvent - A function that handles the weekly event generation process.
 * - GenerateWeeklyEventInput - The input type for the generateWeeklyEvent function.
 * - GenerateWeeklyEventOutput - The return type for the generateWeeklyEvent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateWeeklyEventInputSchema = z.object({
  age: z.number().describe('Current age of the character.'),
  mood: z.string().describe('Current mood of the character (e.g., Happy, Neutral, Stressed).'),
  health: z.string().describe('Current health status of the character (e.g., Healthy, Mild Cold, Sick).'),
  hunger: z.number().describe('Current hunger level of the character (0-100, 0 being starving, 100 being full).'),
  cash: z.number().describe('Current cash on hand.'),
  bankBalance: z.number().describe('Current bank account balance.'),
  resourceManagementProficiency: z.number().describe('Player\'s resource management proficiency score (0-100).'),
  career: z.string().describe('Current career path or field.'),
  education: z.string().describe('Highest level of education attained.'),
  currentJob: z.string().describe('Current job title.'),
  investmentPortfolioSummary: z.string().describe('A summary of current investments and their performance.'),
});
export type GenerateWeeklyEventInput = z.infer<typeof GenerateWeeklyEventInputSchema>;

const GenerateWeeklyEventOutputSchema = z.object({
  title: z.string().describe('A concise title for the weekly event.'),
  description: z.string().describe('A detailed description of the event, including context and potential impact.'),
  type: z.enum([
    'job_offer',
    'illness',
    'unexpected_expense',
    'news_headline',
    'opportunity',
    'market_fluctuation',
    'social_event',
    'personal_crisis',
  ]).describe('The category of the event.'),
  potentialChoices: z.array(z.string()).optional().describe('Optional: A list of choices the player can make in response to the event.').default([]),
});
export type GenerateWeeklyEventOutput = z.infer<typeof GenerateWeeklyEventOutputSchema>;

export async function generateWeeklyEvent(
  input: GenerateWeeklyEventInput
): Promise<GenerateWeeklyEventOutput> {
  return generateWeeklyEventFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklyEventPrompt',
  input: { schema: GenerateWeeklyEventInputSchema },
  output: { schema: GenerateWeeklyEventOutputSchema },
  prompt: `You are the game master for CEO Journey, a life simulation game.
Your task is to generate a unique, context-aware weekly event for the player based on their current character status.
The event should provide new challenges or opportunities and make the CEO's journey dynamic.

Consider the following character status details:
Age: {{{age}}}
Mood: {{{mood}}}
Health: {{{health}}}
Hunger: {{{hunger}}}
Cash: {{{cash}}}
Bank Balance: {{{bankBalance}}}
Resource Management Proficiency: {{{resourceManagementProficiency}}}
Career: {{{career}}}
Education: {{{education}}}
Current Job: {{{currentJob}}}
Investment Portfolio Summary: {{{investmentPortfolioSummary}}}

Generate an event that feels realistic and relevant to the character's current situation. The event should fit one of the specified types: 'job_offer', 'illness', 'unexpected_expense', 'news_headline', 'opportunity', 'market_fluctuation', 'social_event', or 'personal_crisis'. If there are potential choices for the player, list them.

Example:
{
  "title": "Sudden Stock Market Dip",
  "description": "A sudden economic downturn has caused a significant dip in the stock market. Your technology stocks have taken a hit.",
  "type": "market_fluctuation",
  "potentialChoices": ["Hold investments", "Sell some stocks", "Buy the dip"]
}

Another example:
{
  "title": "Networking Gala Invitation",
  "description": "You've received an exclusive invitation to a high-profile networking gala where influential industry leaders will be present.",
  "type": "social_event",
  "potentialChoices": ["Attend the gala", "Decline and work late"]
}

Generate the event now:`,
});

const generateWeeklyEventFlow = ai.defineFlow(
  {
    name: 'generateWeeklyEventFlow',
    inputSchema: GenerateWeeklyEventInputSchema,
    outputSchema: GenerateWeeklyEventOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
