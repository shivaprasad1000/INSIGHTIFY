import React, { useState, useMemo } from 'react';
import type { AnalysisResult, CategoryInsight } from '../types';
import { Status } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { InfoIcon } from './icons/InfoIcon';
import { MinusCircleIcon } from './icons/MinusCircleIcon';
import VennDiagram from './VennDiagram';

interface AnalysisDisplayProps {
  status: Status;
  analysisResult: AnalysisResult | null;
  error: string | null;
  fileName: string | null;
  categoryLabel: string;
  onReset: () => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400"></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

const GlassCard: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
    <div className={`
      bg-black/20 backdrop-blur-lg rounded-2xl p-6
      border border-solid border-white/20
      shadow-2xl shadow-black/40
      ${className}`}
    >
        {children}
    </div>
);

const CategoryInsightCard: React.FC<{ insight: CategoryInsight }> = ({ insight }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <GlassCard className="p-0 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-fuchsia-500/20 hover:shadow-2xl">
             <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-5 flex justify-between items-center text-left hover:bg-slate-800/40 transition-colors"
                aria-expanded={isOpen}
            >
              <div className="flex items-center">
                <h4 className="font-semibold text-lg text-slate-200">{insight.categoryName}</h4>
                <span className="ml-3 text-xs font-medium text-slate-400 bg-slate-700/80 px-2.5 py-1 rounded-full">{insight.reviewCount} reviews</span>
              </div>
                 <svg
                    className={`w-6 h-6 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                 <div className="px-5 pb-5 pt-3 border-t border-slate-700/80 animate-fade-in-down">
                    <p className="text-slate-300 mb-4 text-sm">{insight.summary}</p>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center text-green-400">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            <span className="font-semibold">{insight.positiveCount} Positive</span>
                        </div>
                         <div className="flex items-center text-red-400">
                            <XCircleIcon className="w-5 h-5 mr-2" />
                            <span className="font-semibold">{insight.negativeCount} Negative</span>
                        </div>
                    </div>
                 </div>
            )}
        </GlassCard>
    )
}

const sentimentStyles: { [key: string]: { icon: string; progress: string } } = {
  positive: { icon: 'text-green-400', progress: 'bg-gradient-to-r from-green-400 to-cyan-400' },
  neutral: { icon: 'text-amber-400', progress: 'bg-gradient-to-r from-amber-400 to-orange-400' },
  negative: { icon: 'text-red-400', progress: 'bg-gradient-to-r from-rose-500 to-fuchsia-500' },
};

const SentimentDistributionDisplay: React.FC<{ distribution: AnalysisResult['sentimentDistribution'] }> = ({ distribution }) => {
  const items = [
    { label: 'Positive', value: distribution.positivePercentage, Icon: CheckCircleIcon },
    { label: 'Neutral', value: distribution.neutralPercentage, Icon: MinusCircleIcon },
    { label: 'Negative', value: distribution.negativePercentage, Icon: XCircleIcon },
  ];

  return (
    <GlassCard className="lg:col-span-1 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-slate-200 mb-5 text-center">Sentiment Distribution</h3>
      <div className="space-y-5">
        {items.map(({ label, value, Icon }) => {
          const style = sentimentStyles[label.toLowerCase()];
          return (
            <div key={label} className="flex items-center">
              <Icon className={`w-6 h-6 mr-3 flex-shrink-0 ${style.icon}`} />
              <div className="flex-grow">
                <div className="flex justify-between text-sm font-medium text-slate-300 mb-1">
                  <span>{label}</span>
                  <span>{value.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700/80 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${style.progress}`} style={{ width: `${value}%` }}></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  );
};

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className }) => (
    <button
        onClick={onClick}
        className={`
            px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 relative overflow-hidden group
            bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:shadow-lg hover:shadow-fuchsia-500/40
            focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50
            ${className}`}
    >
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
        <span className="relative">{children}</span>
    </button>
);


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ status, analysisResult, error, fileName, categoryLabel, onReset }) => {
  const hasVennData = useMemo(() => {
    return analysisResult && analysisResult.categoryIntersections && analysisResult.categoryIntersections.length > 1;
  }, [analysisResult]);

  if (status === Status.Processing) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <LoadingSpinner />
        <h2 className="mt-6 text-xl font-semibold text-slate-300">Performing Deep Analysis...</h2>
        <p className="text-slate-400">The AI is discovering categories and sentiments in <span className="font-medium text-violet-300">{fileName}</span>.</p>
      </div>
    );
  }

  if (status === Status.Error) {
    return (
      <div className="text-center py-10 bg-red-900/20 border border-red-500/30 rounded-lg p-6 animate-fade-in">
        <XCircleIcon className="w-12 h-12 mx-auto text-red-400" />
        <h2 className="mt-4 text-xl font-semibold text-red-300">Analysis Failed</h2>
        <p className="mt-2 text-slate-300 max-w-md mx-auto">{error}</p>
        <ActionButton onClick={onReset} className="mt-8">Try Again</ActionButton>
      </div>
    );
  }

  if (status === Status.Success && analysisResult) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white">Analysis Complete</h2>
                <p className="text-slate-400 mt-1">Results for <span className="font-medium text-violet-300">{categoryLabel}</span> from <span className="font-medium text-cyan-300">{fileName}</span></p>
            </div>
              <ActionButton onClick={onReset}>Analyze New File</ActionButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SentimentDistributionDisplay distribution={analysisResult.sentimentDistribution} />
          <GlassCard className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
              <InfoIcon className="w-6 h-6 mr-2.5 text-cyan-400"/>
              Executive Summary
            </h3>
            <p className="text-slate-300 leading-relaxed">{analysisResult.overallSummary}</p>
          </GlassCard>
        </div>
        
        {hasVennData && (
          <GlassCard>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Review Category Overlap</h3>
            <VennDiagram intersectionData={analysisResult.categoryIntersections} />
          </GlassCard>
        )}

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Detailed Category Insights</h3>
           <div className="space-y-4">
                {analysisResult.categoryInsights.map((insight, index) => (
                    <CategoryInsightCard key={index} insight={insight} />
                ))}
            </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AnalysisDisplay;