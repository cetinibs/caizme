"use client";

import React, { forwardRef } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', label, error, fullWidth = false, ...props }, ref) => {
    const baseClasses = 'shadow-md focus:ring-emerald-600 focus:border-emerald-600 block w-full border-gray-400 rounded-md';
    const errorClasses = error ? 'border-red-400 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500' : '';
    const combinedClasses = `${baseClasses} ${errorClasses} ${className}`.trim();
    
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            className="block text-xl font-bold text-gray-800 mb-2"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <textarea
          className={`${combinedClasses} text-lg text-gray-900 font-medium placeholder:text-gray-600 placeholder:text-lg placeholder:font-medium`}
          ref={ref}
          style={{ caretColor: '#047857' }}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
