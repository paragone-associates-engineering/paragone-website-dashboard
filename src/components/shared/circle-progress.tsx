import React from "react";

interface CircleProgressProps {
  percentage: number; // 0 to 100
  size?: number; // in px
  strokeWidth?: number;
}

const OverviewCircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  size = 100,
  strokeWidth = 15,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* Track circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="white"
        strokeOpacity={0.1}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="white"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
       // strokeLinecap=""
      />
    </svg>
  );
};

export default OverviewCircleProgress;
