'use server';

import { z } from 'zod';
import { generateModelInsights } from '@/ai/flows/generate-model-insights';
import { intelligentFeatureFusion } from '@/ai/flows/intelligent-feature-fusion';

const analysisSchema = z.object({
  faceDataUri: z.string().min(1, 'Face image is required.'),
  voiceDataUri: z.string().min(1, 'Voice recording is required.'),
  diseaseContext: z.string(),
});

export type AnalysisState = {
  prediction?: string;
  insights?: string;
  fusionReasoning?: string;
  error?: string;
  success?: boolean;
};

export async function analyzeHealth(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  try {
    const validatedFields = analysisSchema.safeParse({
      faceDataUri: formData.get('faceDataUri'),
      voiceDataUri: formData.get('voiceDataUri'),
      diseaseContext: formData.get('diseaseContext'),
    });

    if (!validatedFields.success) {
      return {
        error: 'Invalid input data. Please provide both face and voice data.',
      };
    }

    const { faceDataUri, voiceDataUri, diseaseContext } = validatedFields.data;

    // 1. Simulate a prediction
    const prediction = Math.random() > 0.4 ? diseaseContext : 'Healthy';

    // 2. Simulate feature extraction for the fusion model
    const facialFeatures =
      'Extracted features include facial landmarks, skin texture patterns, and micro-expression analysis.';
    const vocalFeatures =
      'Extracted features include MFCCs, pitch variations, jitter, and shimmer values.';

    // 3. Call AI flows in parallel
    const [fusionResult, insightsResult] = await Promise.all([
      intelligentFeatureFusion({
        facialFeatures,
        vocalFeatures,
        diseaseContext,
      }),
      generateModelInsights({
        faceDataUri,
        voiceDataUri,
        prediction,
      }),
    ]);
    
    if (!fusionResult?.reasoning || !insightsResult?.insights) {
      throw new Error('AI analysis failed to generate complete results.');
    }

    return {
      prediction: prediction,
      fusionReasoning: fusionResult.reasoning,
      insights: insightsResult.insights,
      success: true,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error(errorMessage);
    return {
      error: `Analysis failed. Please try again.`,
    };
  }
}
