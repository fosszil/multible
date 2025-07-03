"use client";

import React, { useState, useCallback } from "react";
import GameMenu from "./components/GameMenu";
import { GameScreen } from "./components/GameScreen";
import GameOver from "./components/GameOver";

type GameState = "menu" | "practice" | "pro" | "gameover";

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [practiceTable, setPracticeTable] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  // --- THE FIX: Wrap every handler function in useCallback ---
  // This ensures that the GameScreen component receives stable props,
  // preventing unnecessary re-renders and useEffect triggers.

  const handleStartPractice = useCallback((table: number) => {
    setPracticeTable(table);
    setGameState("practice");
  }, []); // The empty array [] means this function is created only once.

  const handleStartPro = useCallback(() => {
    setFinalScore(0);
    setGameState("pro");
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState("gameover");
  }, []);

  const handleGoToMenu = useCallback(() => {
    setGameState("menu");
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setFinalScore(newScore);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      {/* Using direct conditional rendering is the standard, safest pattern in React */}

      {gameState === "menu" && (
        <GameMenu
          onStartPractice={handleStartPractice}
          onStartPro={handleStartPro}
        />
      )}

      {gameState === "practice" && (
        <GameScreen
          mode="practice"
          practiceTable={practiceTable}
          onScoreUpdate={handleScoreUpdate}
          onGoToMenu={handleGoToMenu}
        />
      )}

      {gameState === "pro" && (
        <GameScreen
          mode="pro"
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          onGoToMenu={handleGoToMenu}
          initialTime={60}
        />
      )}

      {gameState === "gameover" && (
        <GameOver score={finalScore} onPlayAgain={handleGoToMenu} />
      )}
    </main>
  );
}
