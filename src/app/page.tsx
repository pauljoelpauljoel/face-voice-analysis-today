"use client";

import { useState, useMemo } from 'react';
import { Header } from '@/components/vocalis-vita/header';
import { AnalysisForm } from '@/components/vocalis-vita/analysis-form';
import { PerformanceDashboard } from '@/components/vocalis-vita/performance-dashboard';
import { type PerformanceMetric } from './actions';

const initialMetrics: PerformanceMetric[] = [
  { metric: "Accuracy", value: 94.7 },
  { metric: "Precision", value: 92.1 },
  { metric: "Recall", value: 95.3 },
  { metric: "F1-Score", value: 93.7 },
];
export default function Home() {
  const [analysisKey, setAnalysisKey] = useState(Date.now());
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>(initialMetrics);

  const handleNewAnalysis = () => {
    setAnalysisKey(Date.now());
     // Optionally reset to initial metrics or keep the last one
    // setPerformanceData(initialMetrics); 
  };

  const handleAnalysisSuccess = (newMetrics: PerformanceMetric[]) => {
    setPerformanceData(newMetrics);
  };
  
  // useMemo to prevent re-rendering of the dashboard unless data changes
  const memoizedDashboard = useMemo(() => <PerformanceDashboard metrics={performanceData} />, [performanceData]);


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-7xl flex-1 items-start gap-4 md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_400px]">
          <div className="grid auto-rows-max items-start gap-4 h-full">
            <AnalysisForm 
              key={analysisKey} 
              onNewAnalysis={handleNewAnalysis} 
              onAnalysisSuccess={handleAnalysisSuccess}
            />
          </div>
          <div className="grid auto-rows-max items-start gap-4">
            {memoizedDashboard}
          </div>
        </div>
      </main>
    </div>
  );
}
