'use server';

/**
 * @fileOverview A flow that intelligently combines facial and vocal features for disease prediction.
 *
 * - intelligentFeatureFusion - A function that handles the intelligent feature fusion process.
 * - IntelligentFeatureFusionInput - The input type for the intelligentFeatureFusion function.
 * - IntelligentFeatureFusionOutput - The return type for the intelligentFeatureFusion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentFeatureFusionInputSchema = z.object({
  facialFeatures: z.string().describe('Extracted features from facial analysis.'),
  vocalFeatures: z.string().describe('Extracted features from vocal analysis.'),
  diseaseContext: z.string().describe('The disease for which prediction is being made.'),
});
export type IntelligentFeatureFusionInput = z.infer<typeof IntelligentFeatureFusionInputSchema>;

const IntelligentFeatureFusionOutputSchema = z.object({
  fusedFeatures: z.string().describe('Intelligently fused features, combining facial and vocal data with dynamic weighting.'),
  reasoning: z.string().describe('Explanation of how the features were weighted and combined.'),
});
export type IntelligentFeatureFusionOutput = z.infer<typeof IntelligentFeatureFusionOutputSchema>;

export async function intelligentFeatureFusion(input: IntelligentFeatureFusionInput): Promise<IntelligentFeatureFusionOutput> {
  return intelligentFeatureFusionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentFeatureFusionPrompt',
  input: {schema: IntelligentFeatureFusionInputSchema},
  output: {schema: IntelligentFeatureFusionOutputSchema},
  prompt: `You are an expert in multimodal data fusion for disease prediction.

You will receive facial features, vocal features, and the disease context. Your task is to intelligently combine these features, dynamically weighing them based on their relevance to the specified disease.

Facial Features: {{{facialFeatures}}}
Vocal Features: {{{vocalFeatures}}}
Disease Context: {{{diseaseContext}}}

Consider which features are more indicative of the disease and weigh them accordingly. Provide a fused feature vector and a clear explanation of your reasoning for the weighting.

Output the fused features and reasoning in the format specified by the output schema.
`,
});

const intelligentFeatureFusionFlow = ai.defineFlow(
  {
    name: 'intelligentFeatureFusionFlow',
    inputSchema: IntelligentFeatureFusionInputSchema,
    outputSchema: IntelligentFeatureFusionOutputSchema,
  },
  async input => {
    const maxRetries = 5;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error) {
        lastError = error as Error;
        const isRetryable = lastError.message.includes('503') || lastError.message.includes('Service Unavailable') || lastError.message.includes('overloaded');

        if (!isRetryable || attempt === maxRetries - 1) {
          throw lastError;
        }

        // Exponential backoff: wait 3^attempt seconds (3, 9, 27, 81 seconds)
        const delay = Math.pow(3, attempt) * 1000;
        console.log(`Gemini API error (attempt ${attempt + 1}/${maxRetries}): ${lastError.message}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
);
