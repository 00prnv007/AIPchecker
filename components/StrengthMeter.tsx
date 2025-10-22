
import React from 'react';

interface StrengthMeterProps {
  score: number; // 0-100
}

const StrengthMeter: React.FC<StrengthMeterProps> = ({ score }) => {
  const getMeterColor = () => {
    if (score < 40) return 'bg-red-500';
    if (score < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthLabel = () => {
    if (score < 40) return 'Weak';
    if (score < 80) return 'Moderate';
    return 'Strong';
  };

  const color = getMeterColor();
  const label = getStrengthLabel();

  return (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-400">Basic Strength</span>
            <span className={`text-sm font-bold ${color.replace('bg-', 'text-')}`}>{label}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
                className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${color}`}
                style={{ width: `${score}%` }}
            ></div>
        </div>
    </div>
  );
};

export default StrengthMeter;
