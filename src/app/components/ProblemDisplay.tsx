import React from 'react';

type ProblemDisplayProps = {
    num1: number;
    num2: number;
    userAnswer: string;
};

const ProblemDisplay = ({ num1, num2, userAnswer }: ProblemDisplayProps) => {
  return (
    <div className="bg-gray-800 rounded-t-lg p-6 text-center shadow-inner">
      <div className="text-white text-5xl font-bold my-4 tracking-wider">
        {num1} × {num2} = ?{/* We use × for a nice multiplication symbol */}
      </div>

      {/* This div will act as our input display */}
      <div className="bg-gray-900 rounded-lg p-4 text-right text-4xl font-mono text-white min-h-[72px]">
        {/* Display the user's current answer, or show a blinking cursor if empty */}
        {userAnswer || <span className="animate-pulse">|</span>}
      </div>
    </div>
  );
};

export default ProblemDisplay;