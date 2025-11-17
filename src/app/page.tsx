"use client";

import { useState } from 'react';
import { Header } from '@/components/vocalis-vita/header';
import { AnalysisForm } from '@/components/vocalis-vita/analysis-form';
import { PerformanceDashboard } from '@/components/vocalis-vita/performance-dashboard';

export default function Home() {
  const [analysisKey, setAnalysisKey] = useState(Date.now());

  const handleNewAnalysis = () => {
    setAnalysisKey(Date.now());
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-7xl flex-1 items-start gap-4 md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_400px]">
          <div className="grid auto-rows-max items-start gap-4 h-full">
            <AnalysisForm key={analysisKey} onNewAnalysis={handleNewAnalysis} />
          </div>
          <div className="grid auto-rows-max items-start gap-4">
            <PerformanceDashboard />
          </div>
        </div>
      </main>
    </div>
  );
}
