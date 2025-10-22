
export interface StrengthCriterion {
  id: string;
  label: string;
  regex: RegExp;
  satisfied: boolean;
}

export interface GeminiAnalysisResult {
  overall_strength: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  feedback: string[];
  compromise_risk: 'High' | 'Medium' | 'Low' | 'Very Low';
  common_patterns: string[];
}
