import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block mb-2 text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            block w-full rounded-lg border bg-dark-surface
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            text-white placeholder-gray-500
            transition-all duration-200
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
              : 'border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue shadow-[0_0_0_1px_rgba(59,130,246,0)] focus:shadow-[0_0_10px_rgba(59,130,246,0.2)]'
            }
            focus:outline-none
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-pulse">{error}</p>
      )}
    </div>
  );
};

export default Input;
