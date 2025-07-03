import React from 'react';

type ScoreboardProps = {
    score: number;
    timeLeft?:number;
};

const Scoreboard = ({ score, timeLeft }: ScoreboardProps) => {
  return (
    <div className="flex justify-between items-center bg-gray-700 p-2 text-white font-semibold">
      <div className="text-lg">
        Score: <span className="font-bold text-yellow-400">{score}</span>
      </div>
      {typeof timeLeft === "number" && (
        <div className="text-lg">
          Time: <span className="font-bold text-red-400">{timeLeft}s</span>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;