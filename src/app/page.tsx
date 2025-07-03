// src/app/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Numpad from "./components/NumPad";
import ProblemDisplay from "./components/ProblemDisplay";

const generateRandomNumber = (max = 12) => {
  // Increased max for more variety
  return Math.floor(Math.random() * max); // Generates 0 to 11
};

export default function HomePage() {
  // --- STATE MANAGEMENT ---
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // --- PROBLEM GENERATION LOGIC ---
  const generateNewProblem = useCallback(() => {
    setNum1(generateRandomNumber());
    setNum2(generateRandomNumber());
    setUserAnswer("");
    setIsCorrect(null);
  }, []); // This function has no dependencies, so it's created only once.

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  // --- ANSWER CHECKING LOGIC ---
  // 1. Wrap `checkAnswer` in useCallback and define its dependencies.
  const checkAnswer = useCallback(
    (currentAnswer: string) => {
      if (!currentAnswer) return; // Don't check if the answer is empty

      const correctAnswer = num1 * num2;
      if (parseInt(currentAnswer, 10) === correctAnswer) {
        setIsCorrect(true);
        setTimeout(() => generateNewProblem(), 1000);
      } else if (currentAnswer.length >= String(correctAnswer).length) {
        setIsCorrect(false);
        setTimeout(() => {
          setUserAnswer("");
          setIsCorrect(null);
        }, 1000);
      } else {
        setIsCorrect(null); // Still typing
      }
    },
    [num1, num2, generateNewProblem]
  ); // Its dependencies are the values it uses

  // --- HANDLER FUNCTIONS for Numpad and Keyboard ---
  const handleDigit = useCallback(
    (digit: string) => {
      if (isCorrect) return; // Prevent typing after a correct answer

      setUserAnswer((prevAnswer) => {
        const newAnswer = prevAnswer + digit;
        checkAnswer(newAnswer); // Check the answer immediately after state update
        return newAnswer;
      });
    },
    [isCorrect, checkAnswer]
  ); // 2. Add 'checkAnswer' to the dependency array.

  const handleDelete = useCallback(() => {
    setUserAnswer((prev) => prev.slice(0, -1));
    setIsCorrect(null);
  }, []);

  const handleClear = useCallback(() => {
    setUserAnswer("");
    setIsCorrect(null);
  }, []);

  // Keyboard support remains the same but now uses the stable handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isCorrect) return; // Also block keyboard input when correct

      if (event.key >= "0" && event.key <= "9") {
        handleDigit(event.key);
      } else if (event.key === "Backspace") {
        handleDelete();
      } else if (event.key === "Escape" || event.key === "Delete") {
        handleClear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCorrect, handleDigit, handleDelete, handleClear]);

  // --- UI LOGIC ---
  const getBorderColor = () => {
    if (isCorrect === true) return "border-green-500";
    if (isCorrect === false) return "border-red-500";
    return "border-gray-700";
  };

  // A small improvement to add a "shake" animation on wrong answers
  const getShakeClass = () => {
    return isCorrect === false ? "animate-shake" : "";
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div
        className={`w-full max-w-xs mx-auto rounded-lg shadow-2xl overflow-hidden border-4 transition-all duration-300 ${getBorderColor()} ${getShakeClass()}`}
      >
        <ProblemDisplay num1={num1} num2={num2} userAnswer={userAnswer} />
        <Numpad
          onDigit={handleDigit}
          onDecimal={() => {}} // Decimal button does nothing
          onClear={handleClear}
          onDelete={handleDelete}
        />
      </div>
      <button
        onClick={generateNewProblem}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip / New Problem
      </button>
    </main>
  );
}

