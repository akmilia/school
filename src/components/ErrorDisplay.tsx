import React from 'react';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="error-container">
      <div className="error-message">
        {error}
      </div>
    </div>
  );
};