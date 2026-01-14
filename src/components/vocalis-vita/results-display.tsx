import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, CheckCircle, ShieldAlert, GitMerge, Download, RefreshCcw } from 'lucide-react';
import { type AnalysisState } from '@/app/actions';

interface ResultsDisplayProps {
  results: AnalysisState;
  onNewAnalysis: () => void;
  diseaseContext: string;
}

import { Save, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';

export default function ResultsDisplay({ results, onNewAnalysis, diseaseContext }: ResultsDisplayProps) {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const isHealthy = results.prediction === 'Healthy';
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element = reportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`Disease prediction using face and voice analysis${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleSave = () => {
    const historyItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      diseaseContext: results.prediction === 'Healthy' ? 'General Checkup' : (results.prediction || diseaseContext),
      prediction: results.prediction,
      metrics: results.performanceMetrics,
      insights: results.insights,
      fusionReasoning: results.fusionReasoning
    };

    const stored = localStorage.getItem('analysis_history');
    const history = stored ? JSON.parse(stored) : [];
    localStorage.setItem('analysis_history', JSON.stringify([...history, historyItem]));

    setIsSaved(true);
    toast({
      title: "Saved to History",
      description: "Analysis result has been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
        <div className="space-y-1.5">
          <CardTitle>Analysis Complete</CardTitle>
          <CardDescription>Review the prediction and insights below.</CardDescription>
        </div>
        <div className='flex gap-2'>
          {!isSaved && (
            <Button onClick={handleSave} size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Save Result
            </Button>
          )}
          <Button onClick={handleDownloadPdf} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={onNewAnalysis} size="sm" variant={isSaved ? "default" : "secondary"}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent ref={reportRef} className="pt-6">
        <div className="space-y-4 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                {isHealthy ? (
                  <CheckCircle className="h-7 w-7 text-green-500" />
                ) : (
                  <ShieldAlert className="h-7 w-7 text-amber-500" />
                )}
                Prediction Result: {results.prediction}
              </CardTitle>
              <CardDescription>
                This prediction is based on a multimodal analysis of facial and vocal biomarkers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BrainCircuit className="h-6 w-6 text-primary" />
                AI Model Insights
              </CardTitle>
              <CardDescription>Explanation of biomarkers and contributing factors.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{results.insights}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <GitMerge className="h-6 w-6 text-primary" />
                Feature Fusion Analysis
              </CardTitle>
              <CardDescription>How facial and vocal features were combined for this prediction.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{results.fusionReasoning}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
