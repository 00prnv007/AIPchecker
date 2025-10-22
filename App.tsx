
import React, { useState, useMemo, useCallback } from 'react';
import { StrengthCriterion, GeminiAnalysisResult } from './types';
import { checkPasswordWithGemini } from './services/geminiService';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import StrengthCriteriaList from './components/StrengthCriteriaList';
import GeminiResult from './components/GeminiResult';

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [geminiResult, setGeminiResult] = useState<GeminiAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisPerformed, setAnalysisPerformed] = useState(false);

  const initialCriteria: StrengthCriterion[] = [
    { id: 'length', label: 'At least 8 characters', regex: /.{8,}/, satisfied: false },
    { id: 'lowercase', label: 'Contains a lowercase letter', regex: /[a-z]/, satisfied: false },
    { id: 'uppercase', label: 'Contains an uppercase letter', regex: /[A-Z]/, satisfied: false },
    { id: 'number', label: 'Contains a number', regex: /[0-9]/, satisfied: false },
    { id: 'special', label: 'Contains a special character', regex: /[^A-Za-z0-9]/, satisfied: false },
  ];

  const { strengthScore, satisfiedCriteria } = useMemo(() => {
    const satisfied = initialCriteria.map(c => ({
      ...c,
      satisfied: c.regex.test(password),
    }));
    const score = (satisfied.filter(c => c.satisfied).length / initialCriteria.length) * 100;
    return { strengthScore: score, satisfiedCriteria: satisfied };
  }, [password]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setAnalysisPerformed(false); // Reset analysis state on new input
    setGeminiResult(null);
    setError(null);
  };
  
  const handleCheckStrength = useCallback(async () => {
    if (!password) {
      setError('Please enter a password to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeminiResult(null);
    setAnalysisPerformed(true);
    try {
      const result = await checkPasswordWithGemini(password);
      setGeminiResult(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze password. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [password]);

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
            Password Security Analyzer
          </h1>
          <p className="text-gray-400 mt-2">Check your password's strength and potential compromise risk with AI.</p>
        </header>

        <main className="bg-dark-card p-6 md:p-8 rounded-2xl shadow-2xl border border-dark-border">
          <div className="space-y-6">
            <PasswordInput
              password={password}
              isPasswordVisible={isPasswordVisible}
              onPasswordChange={handlePasswordChange}
              onVisibilityChange={() => setIsPasswordVisible(prev => !prev)}
            />
            <StrengthMeter score={strengthScore} />
            <StrengthCriteriaList criteria={satisfiedCriteria} />

            <button
              onClick={handleCheckStrength}
              disabled={isLoading || !password}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : "Analyze with AI"}
            </button>
            
            {error && <div className="text-red-400 text-center p-3 bg-red-900/50 rounded-lg">{error}</div>}

            {analysisPerformed && (
                <GeminiResult result={geminiResult} isLoading={isLoading} />
            )}
          </div>
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Password Security Analyzer. Powered by Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
