import React from "react";

type GameOverProps = {
  score: number;
  onPlayAgain: () => void;
};

const GameOver = ({ score, onPlayAgain }: GameOverProps) => {
  return (
    <div className="w-full max-w-sm mx-auto p-8 bg-gray-800 rounded-lg shadow-2xl text-white text-center">
      <h1 className="text-5xl font-bold text-red-500 mb-4">Time Up!</h1>
      <p className="text-2xl mb-6">Your final score is:</p>
      <div className="text-6xl font-bold text-yellow-400 mb-8">{score}</div>
      <button
        onClick={onPlayAgain}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-xl transition-transform transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOver;
