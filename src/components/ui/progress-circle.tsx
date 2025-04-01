import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  value: number;
  size?: 'small' | 'medium' | 'large';
  strokeWidth?: number;
  showValue?: boolean;
  className?: string;
  valueClassName?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 'medium',
  strokeWidth = 4,
  showValue = false,
  className,
  valueClassName,
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  // Calculate sizes based on the size prop
  const dimensions = {
    small: { size: 40, fontSize: 'text-xs' },
    medium: { size: 64, fontSize: 'text-base' },
    large: { size: 120, fontSize: 'text-2xl' },
  }[size];
  
  // SVG parameters
  const radius = (dimensions.size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  
  // Calculate color based on progress value
  const getColor = () => {
    if (normalizedValue >= 75) return 'stroke-green-500';
    if (normalizedValue >= 50) return 'stroke-blue-500';
    if (normalizedValue >= 25) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };
  
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg
        className="transform -rotate-90"
        width={dimensions.size}
        height={dimensions.size}
        viewBox={`0 0 ${dimensions.size} ${dimensions.size}`}
      >
        {/* Background circle */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="stroke-muted-foreground/20"
        />
        
        {/* Progress circle */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={getColor()}
        />
      </svg>
      
      {showValue && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center font-medium',
            dimensions.fontSize,
            valueClassName
          )}
        >
          {Math.round(normalizedValue)}%
        </div>
      )}
    </div>
  );
}; 