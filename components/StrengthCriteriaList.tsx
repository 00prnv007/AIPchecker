
import React from 'react';
import { StrengthCriterion } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface StrengthCriteriaListProps {
  criteria: StrengthCriterion[];
}

const StrengthCriteriaList: React.FC<StrengthCriteriaListProps> = ({ criteria }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {criteria.map((criterion) => (
        <li key={criterion.id} className="flex items-center">
          {criterion.satisfied ? (
            <CheckIcon className="text-green-400 mr-2 flex-shrink-0" />
          ) : (
            <XIcon className="text-red-400 mr-2 flex-shrink-0" />
          )}
          <span className={`text-sm ${criterion.satisfied ? 'text-gray-400' : 'text-gray-300'}`}>
            {criterion.label}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default StrengthCriteriaList;
