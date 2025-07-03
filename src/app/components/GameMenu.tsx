import React from "react";

type GameMenuProps = {
  onStartPractice: (table: number) => void;
  onStartPro: () => void;
};

const GameMenu = ({ onStartPractice, onStartPro }: GameMenuProps) => {
  const practiceTables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-gray-800 rounded-lg shadow-2xl text-white text-center">
      <h1 className="text-4xl font-bold mb-6">Multiplication Master</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-300">
          Practice Mode
        </h2>
        <p className="text-gray-400 mb-4">
          Choose a number to practice its multiplication table. No time limit!
        </p>
        <div className="grid grid-cols-4 gap-2">
          {practiceTables.map((table) => (
            <button
              key={table}
              onClick={() => onStartPractice(table)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-110"
            >
              {table}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-red-400">Pro Mode</h2>
        <p className="text-gray-400 mb-4">
          Random questions up to 12x12. How many can you get in 60 seconds?
        </p>
        <button
          onClick={onStartPro}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg text-xl transition-transform transform hover:scale-105"
        >
          Start Pro Mode
        </button>
      </div>
    </div>
  );
};

export default GameMenu;
