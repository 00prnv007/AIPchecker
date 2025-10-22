
import React from 'react';
import { GeminiAnalysisResult } from '../types';

interface GeminiResultProps {
  result: GeminiAnalysisResult | null;
  isLoading: boolean;
}

const ResultPill: React.FC<{
    label: string;
    value: string;
    colorClass: string;
}> = ({ label, value, colorClass }) => (
    <div className="flex flex-col items-center justify-center bg-gray-900/50 p-4 rounded-lg text-center">
        <span className="text-sm text-gray-400 uppercase tracking-wider">{label}</span>
        <span className={`text-xl font-bold ${colorClass}`}>{value}</span>
    </div>
);

const GeminiResult: React.FC<GeminiResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-6 p-6 border-2 border-dashed border-dark-border rounded-lg animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="h-16 bg-gray-700 rounded-lg"></div>
              <div className="h-16 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
          <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }
  
  const strengthColorMap = {
      'Very Weak': 'text-red-500',
      'Weak': 'text-red-400',
      'Moderate': 'text-yellow-400',
      'Strong': 'text-green-400',
      'Very Strong': 'text-green-300'
  };
  
  const riskColorMap = {
      'High': 'text-red-500',
      'Medium': 'text-yellow-400',
      'Low': 'text-green-400',
      'Very Low': 'text-green-300'
  };

  return (
    <div className="mt-6 p-6 border border-dark-border rounded-lg bg-dark-bg/50">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">AI Analysis Report</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ResultPill 
            label="Overall Strength" 
            value={result.overall_strength} 
            colorClass={strengthColorMap[result.overall_strength]} 
        />
        <ResultPill 
            label="Compromise Risk" 
            value={result.compromise_risk} 
            colorClass={riskColorMap[result.compromise_risk]} 
        />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-300 mb-2">Feedback & Suggestions</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            {result.feedback.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>

        {result.common_patterns.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Detected Patterns</h3>
            <div className="flex flex-wrap gap-2">
                {result.common_patterns.map((pattern, index) => (
                    <span key={index} className="bg-yellow-900/50 text-yellow-300 text-xs font-medium px-2.5 py-1 rounded-full">
                        {pattern}
                    </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiResult;
