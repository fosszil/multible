"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Numpad from "./NumPad";
import ProblemDisplay from "./ProblemDisplay";
import Scoreboard from "./Scoreboard";

type GameScreenProps = {
  mode: "practice" | "pro";
  practiceTable?: number;
  onScoreUpdate: (newScore: number) => void;
  onGoToMenu: () => void;
  onGameOver?: () => void;
  initialTime?: number;
};

const generateRandomNumber = (max = 12) =>
  Math.floor(Math.random() * (max + 1));

export const GameScreen = ({
  mode,
  practiceTable,
  onScoreUpdate,
  onGoToMenu,
  onGameOver,
  initialTime = 60,
}: GameScreenProps) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // This ref prevents the answer-checking effect from running on the initial render.
  const isInitialMount = useRef(true);

  const generateNewProblem = useCallback(() => {
    const newNum1 =
      mode === "practice" ? practiceTable! : generateRandomNumber();
    const newNum2 = generateRandomNumber();
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer("");
    setIsCorrect(null);
  }, [mode, practiceTable]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  // Timer logic for Pro Mode
  useEffect(() => {
    if (mode !== "pro" || !isGameActive) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsGameActive(false);
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [mode, isGameActive]);

  // Effect to notify parent when the game is over
  useEffect(() => {
    if (!isGameActive) {
      onGameOver?.();
    }
  }, [isGameActive, onGameOver]);

  const checkAnswer = useCallback(
    (currentAnswer: string) => {
      if (!currentAnswer || !isGameActive) return;

      const correctAnswer = num1 * num2;
      if (parseInt(currentAnswer, 10) === correctAnswer) {
        setIsCorrect(true);
        // Use functional update to avoid depending on 'score' state
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          onScoreUpdate(newScore); // Still notify the parent
          return newScore;
        });
        setTimeout(() => generateNewProblem(), 800);
      } else if (currentAnswer.length >= String(correctAnswer).length) {
        setIsCorrect(false);
        setTimeout(() => {
          setUserAnswer("");
          setIsCorrect(null);
        }, 800);
      }
    },
    // This dependency array is now stable because onScoreUpdate and generateNewProblem are stable.
    [num1, num2, isGameActive, onScoreUpdate, generateNewProblem]
  );

  // This effect safely calls checkAnswer only after the user types.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      checkAnswer(userAnswer);
    }
  }, [userAnswer, checkAnswer]);

  // This handler only updates the answer string.
  const handleDigit = useCallback(
    (digit: string) => {
      if (isCorrect || !isGameActive) return;
      setUserAnswer((prev) => prev + digit);
    },
    [isCorrect, isGameActive]
  );

  const handleDelete = useCallback(() => {
    setIsCorrect(null);
    setUserAnswer((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setIsCorrect(null);
    setUserAnswer("");
  }, []);

  const getBorderColor = () => {
    if (isCorrect === true) return "border-green-500";
    if (isCorrect === false) return "border-red-500";
    return "border-gray-700";
  };

  const getShakeClass = () => {
    return isCorrect === false ? "animate-shake" : "";
  };

  return (
    <>
      <div
        className={`w-full max-w-xs mx-auto rounded-lg shadow-2xl overflow-hidden border-4 transition-all duration-300 ${getBorderColor()} ${getShakeClass()}`}
      >
        <Scoreboard
          score={score}
          timeLeft={mode === "pro" ? timeLeft : undefined}
        />
        <ProblemDisplay num1={num1} num2={num2} userAnswer={userAnswer} />
        <Numpad
          onDigit={handleDigit}
          onClear={handleClear}
          onDelete={handleDelete}
        />
      </div>

      <button
        onClick={onGoToMenu}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        ← Back to Menu
      </button>
    </>
  );
};
