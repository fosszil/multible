"use client";

import React, { useState } from "react";
import GameMenu from "./components/GameMenu";
import { GameScreen } from "./components/GameScreen";
import GameOver from "./components/GameOver";

type GameState = "menu" | "practice" | "pro" | "gameover";

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [practiceTable, setPracticeTable] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const handleStartPractice = (table: number) => {
    setPracticeTable(table);
    setGameState("practice");
  };

  const handleStartPro = () => {
    setFinalScore(0); // Reset score for a new game
    setGameState("pro");
  };

  const handleGameOver = () => {
    setGameState("gameover");
  };

  const handlePlayAgain = () => {
    setGameState("menu");
  };

  const handleScoreUpdate = (newScore: number) => {
    // This is useful for Pro Mode to set the final score
    setFinalScore(newScore);
  };

  const renderGameState = () => {
    switch (gameState) {
      case "practice":
        return (
          <GameScreen
            mode="practice"
            practiceTable={practiceTable}
            onScoreUpdate={handleScoreUpdate}
          />
        );
      case "pro":
        return (
          <GameScreen
            mode="pro"
            onScoreUpdate={handleScoreUpdate}
            onGameOver={handleGameOver}
            initialTime={60}
          />
        );
      case "gameover":
        return <GameOver score={finalScore} onPlayAgain={handlePlayAgain} />;
      case "menu":
      default:
        return (
          <GameMenu
            onStartPractice={handleStartPractice}
            onStartPro={handleStartPro}
          />
        );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      {renderGameState()}
    </main>
  );
}
