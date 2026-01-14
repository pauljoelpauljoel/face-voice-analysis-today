'use server';

import { z } from 'zod';
import { generateModelInsights } from '@/ai/flows/generate-model-insights';
import { intelligentFeatureFusion } from '@/ai/flows/intelligent-feature-fusion';

const analysisSchema = z.object({
  faceDataUri: z.string().min(1, 'Face image is required.'),
  voiceDataUri: z.string().min(1, 'Voice recording is required.'),
  diseaseContext: z.string(),
});

export type PerformanceMetric = {
  metric: string;
  value: number;
};
export type AnalysisState = {
  prediction?: string;
  insights?: string;
  fusionReasoning?: string;
  performanceMetrics?: PerformanceMetric[];
  error?: string;
  success?: boolean;
};

// Helper to generate a random number within a range
const randomInRange = (min: number, max: number, decimals: number = 1) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
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

    const { faceDataUri, voiceDataUri } = validatedFields.data;
      let { diseaseContext } = validatedFields.data;

    if (diseaseContext === 'None') {
      diseaseContext = 'General Checkup';
    }


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
    // 4. Simulate new performance metrics
    const performanceMetrics = [
      { metric: "Accuracy", value: randomInRange(92, 98) },
      { metric: "Precision", value: randomInRange(90, 95) },
      { metric: "Recall", value: randomInRange(93, 99) },
      { metric: "F1-Score", value: randomInRange(91, 96) },
    ];
    console.log('Simulated new metrics:', performanceMetrics);
    return {
      prediction: prediction,
      fusionReasoning: fusionResult.reasoning,
      insights: insightsResult.insights,
      performanceMetrics: performanceMetrics,
      success: true,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error(errorMessage);

    // Check if it's a retryable API error
    const isApiError = errorMessage.includes('503') || errorMessage.includes('Service Unavailable') || errorMessage.includes('overloaded');
    const userMessage = isApiError
      ? 'The AI service is currently overloaded. Please wait a moment and try again.'
      : 'Analysis failed. Please try again.';

    return {
      error: userMessage,
    };
  }
}
