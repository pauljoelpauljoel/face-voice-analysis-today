'use server';

/**
 * @fileOverview A flow for generating human-readable insights into how the AI model is making predictions based on facial and vocal features.
 *
 * - generateModelInsights - A function that generates insights into the AI model's predictions.
 * - GenerateModelInsightsInput - The input type for the generateModelInsights function.
 * - GenerateModelInsightsOutput - The return type for the generateModelInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateModelInsightsInputSchema = z.object({
  faceDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  voiceDataUri: z
    .string()
    .describe(
      "A voice recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prediction: z.string().describe('The disease prediction made by the model.'),
});
export type GenerateModelInsightsInput = z.infer<typeof GenerateModelInsightsInputSchema>;

const GenerateModelInsightsOutputSchema = z.object({
  insights: z.string().describe('Human-readable insights into the model predictions.'),
});
export type GenerateModelInsightsOutput = z.infer<typeof GenerateModelInsightsOutputSchema>;

export async function generateModelInsights(input: GenerateModelInsightsInput): Promise<GenerateModelInsightsOutput> {
  return generateModelInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateModelInsightsPrompt',
  input: {schema: GenerateModelInsightsInputSchema},
  output: {schema: GenerateModelInsightsOutputSchema},
  prompt: `You are an AI model insight generator. You take in the face data, voice data, and the model's disease prediction, and you output human-readable insights into how the model made its predictions based on facial and vocal features.

Face Data: {{media url=faceDataUri}}
Voice Data: {{media url=voiceDataUri}}
Prediction: {{{prediction}}}

Provide insights into which facial and vocal features contributed to the prediction. Explain the biomarkers and validate the model's accuracy and reliability.
`,
});

const generateModelInsightsFlow = ai.defineFlow(
  {
    name: 'generateModelInsightsFlow',
    inputSchema: GenerateModelInsightsInputSchema,
    outputSchema: GenerateModelInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
