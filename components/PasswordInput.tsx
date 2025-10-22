
import React from 'react';
import EyeIcon from './icons/EyeIcon';
import EyeSlashIcon from './icons/EyeSlashIcon';

interface PasswordInputProps {
  password: string;
  isPasswordVisible: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVisibilityChange: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  isPasswordVisible,
  onPasswordChange,
  onVisibilityChange,
}) => {
  return (
    <div>
        <label htmlFor="password-input" className="block text-sm font-medium text-gray-400 mb-2">
            Enter Password
        </label>
        <div className="relative">
            <input
                id="password-input"
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={onPasswordChange}
                placeholder="Enter a password to check"
                className="w-full bg-gray-900/50 border-2 border-dark-border focus:border-brand-primary focus:ring-brand-primary rounded-lg p-4 pr-12 text-lg text-gray-200 transition duration-200 outline-none"
            />
            <button
                type="button"
                onClick={onVisibilityChange}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
                {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
        </div>
    </div>
  );
};

export default PasswordInput;
