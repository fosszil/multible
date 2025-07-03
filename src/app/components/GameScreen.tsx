"use client";

import React, { useState, useEffect, useCallback } from "react";
import Numpad from "./NumPad";
import ProblemDisplay from "./ProblemDisplay";
import Scoreboard from "./Scoreboard";

type GameScreenProps = {
  mode: "practice" | "pro";
  practiceTable?: number;
  onScoreUpdate: (newScore: number) => void;
  onGameOver?: () => void;
  initialTime?: number;
};

const generateRandomNumber = (max = 12) =>
  Math.floor(Math.random() * (max + 1));

export const GameScreen = ({
  mode,
  practiceTable,
  onScoreUpdate,
  onGameOver,
  initialTime = 60,
}: GameScreenProps) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  // --- THE FIX: We add a new state to track if the game is active ---
  const [isGameActive, setIsGameActive] = useState(true);

  const [timeLeft, setTimeLeft] = useState(initialTime);

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

    // Set up the interval
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        // --- THE FIX: We update our own state first ---
        if (prevTime <= 1) {
          setIsGameActive(false); // Stop the game internally
          clearInterval(timerId); // Stop the timer immediately
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [mode, isGameActive]); // Depend on our new state

  // --- THE FIX: A NEW useEffect to handle telling the parent about the game over ---
  // This effect runs ONLY when 'isGameActive' changes.
  useEffect(() => {
    // If the game has just become inactive, tell the parent.
    if (!isGameActive) {
      onGameOver?.();
    }
  }, [isGameActive, onGameOver]);

  const checkAnswer = useCallback(
    (currentAnswer: string) => {
      if (!currentAnswer) return;

      const correctAnswer = num1 * num2;
      if (parseInt(currentAnswer, 10) === correctAnswer) {
        setIsCorrect(true);
        const newScore = score + 1;
        setScore(newScore);
        onScoreUpdate(newScore);
        setTimeout(() => generateNewProblem(), 800);
      } else if (currentAnswer.length >= String(correctAnswer).length) {
        setIsCorrect(false);
        setTimeout(() => {
          setUserAnswer("");
          setIsCorrect(null);
        }, 800);
      }
    },
    [num1, num2, score, onScoreUpdate, generateNewProblem]
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (isCorrect || !isGameActive) return; // Also block input if game is over
      setUserAnswer((prev) => {
        const newAnswer = prev + digit;
        checkAnswer(newAnswer);
        return newAnswer;
      });
    },
    [isCorrect, isGameActive, checkAnswer]
  );

  const handleDelete = useCallback(
    () => setUserAnswer((prev) => prev.slice(0, -1)),
    []
  );
  const handleClear = useCallback(() => setUserAnswer(""), []);

  const getBorderColor = () => {
    if (isCorrect === true) return "border-green-500";
    if (isCorrect === false) return "border-red-500";
    return "border-gray-700";
  };

  return (
    <div
      className={`w-full max-w-xs mx-auto rounded-lg shadow-2xl overflow-hidden border-4 transition-all duration-300 ${getBorderColor()}`}
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
  );
};
