"use client";

import React, { useState, useEffect, useCallback } from "react";
import Numpad from "./NumPad";
import ProblemDisplay from "./ProblemDisplay";
import Scoreboard from "./Scoreboard";

type GameScreenProps = {
  mode: "practice" | "pro";
  practiceTable?: number; // The table to practice (e.g., 7s)
  onScoreUpdate: (newScore: number) => void;
  onGameOver?: () => void; // Only for Pro Mode
  initialTime?: number; // Only for Pro Mode
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
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const generateNewProblem = useCallback(() => {
    // In practice mode, one number is fixed. In pro mode, both are random.
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
    if (mode !== "pro") return;

    if (timeLeft <= 0) {
      onGameOver?.(); // Tell the parent component the game is over
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId); // Cleanup on unmount
  }, [mode, timeLeft, onGameOver]);

  const checkAnswer = useCallback(
    (currentAnswer: string) => {
      if (!currentAnswer) return;

      const correctAnswer = num1 * num2;
      if (parseInt(currentAnswer, 10) === correctAnswer) {
        setIsCorrect(true);
        const newScore = score + 1;
        setScore(newScore);
        onScoreUpdate(newScore); // Inform parent of score change
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
      if (isCorrect) return;
      setUserAnswer((prev) => {
        const newAnswer = prev + digit;
        checkAnswer(newAnswer);
        return newAnswer;
      });
    },
    [isCorrect, checkAnswer]
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
