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
    <div className="w-4 h-4 rounded-full animate-pulse bg-purple-400"></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-purple-400" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-4 h-4 rounded-full animate-pulse bg-purple-400" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

const CategoryInsightCard: React.FC<{ insight: CategoryInsight }> = ({ insight }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
             <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <h4 className="font-semibold text-lg text-gray-200">{insight.categoryName}</h4>
                <span className="ml-3 text-xs font-medium text-gray-400 bg-gray-700 px-2 py-1 rounded-full">{insight.reviewCount} reviews</span>
              </div>
                 <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                 <div className="px-5 pb-5 pt-2 border-t border-gray-700 animate-fade-in-down">
                    <p className="text-gray-400 mb-4 text-sm italic">{insight.summary}</p>
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
        </div>
    )
}

const SentimentDistributionDisplay: React.FC<{ distribution: AnalysisResult['sentimentDistribution'] }> = ({ distribution }) => {
  const items = [
    { label: 'Positive', value: distribution.positivePercentage, color: 'green', Icon: CheckCircleIcon },
    { label: 'Neutral', value: distribution.neutralPercentage, color: 'amber', Icon: MinusCircleIcon },
    { label: 'Negative', value: distribution.negativePercentage, color: 'red', Icon: XCircleIcon },
  ];

  return (
    <div className="lg:col-span-1 bg-gray-900/50 p-6 rounded-xl border border-gray-700 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-gray-300 mb-4 text-center">Sentiment Distribution</h3>
      <div className="space-y-4">
        {items.map(({ label, value, color, Icon }) => (
          <div key={label} className="flex items-center">
            <Icon className={`w-6 h-6 mr-3 text-${color}-400`} />
            <div className="flex-grow">
              <div className="flex justify-between text-sm font-medium text-gray-300">
                <span>{label}</span>
                <span>{value.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                <div className={`bg-${color}-500 h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ status, analysisResult, error, fileName, categoryLabel, onReset }) => {
  const hasVennData = useMemo(() => {
    return analysisResult && analysisResult.categoryIntersections && analysisResult.categoryIntersections.length > 0;
  }, [analysisResult]);

  if (status === Status.Processing) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner />
        <h2 className="mt-4 text-xl font-semibold text-gray-300">Performing Deep Analysis...</h2>
        <p className="text-gray-400">The AI is discovering categories and sentiments in <span className="font-medium text-purple-300">{fileName}</span>.</p>
      </div>
    );
  }

  if (status === Status.Error) {
    return (
      <div className="text-center py-16 bg-red-900/20 border border-red-500/30 rounded-lg p-6">
        <XCircleIcon className="w-12 h-12 mx-auto text-red-400" />
        <h2 className="mt-4 text-xl font-semibold text-red-300">Analysis Failed</h2>
        <p className="mt-2 text-gray-300">{error}</p>
        <button
          onClick={onReset}
          className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === Status.Success && analysisResult) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
                    <p className="text-gray-400">Results for <span className="font-medium text-purple-300">{categoryLabel}</span> from <span className="font-medium text-purple-300">{fileName}</span></p>
                </div>
                 <button
                    onClick={onReset}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                    Analyze New File
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SentimentDistributionDisplay distribution={analysisResult.sentimentDistribution} />
          <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
              <InfoIcon className="w-5 h-5 mr-2 text-cyan-400"/>
              Executive Summary
            </h3>
            <p className="text-gray-300 leading-relaxed">{analysisResult.overallSummary}</p>
          </div>
        </div>
        
        {hasVennData && (
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Review Category Overlap</h3>
            <VennDiagram intersectionData={analysisResult.categoryIntersections} />
          </div>
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