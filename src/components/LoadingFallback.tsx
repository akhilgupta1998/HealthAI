import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we set things up</p>
      </div>
    </div>
  );
};

export default LoadingFallback; 