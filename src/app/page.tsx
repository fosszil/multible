// src/app/page.tsx

"use client";

// 1. Import useEffect and useCallback from React
import React, { useState, useEffect, useCallback } from "react";
import Numpad from "./components/NumPad";

export default function HomePage() {
  const [value, setValue] = useState("");

  // --- Handler Functions ---
  // We wrap these in useCallback to prevent them from being recreated on every render.
  // This is an optimization that helps our useEffect hook work more efficiently.

  const handleDigit = useCallback((digit: string) => {
    // Use the functional form of setValue to avoid dependency on 'value'
    setValue((prevValue) => prevValue + digit);
  }, []); // Empty dependency array means this function is never recreated


  const handleClear = useCallback(() => {
    setValue("");
  }, []);

  const handleDelete = useCallback(() => {
    setValue((prevValue) => prevValue.slice(0, -1));
  }, []);

  // 2. The useEffect hook to handle keyboard input
  useEffect(() => {
    // This function will be called whenever a key is pressed down
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault(); // Prevent default browser actions for keys

      // Check which key was pressed
      if (event.key >= "0" && event.key <= "9") {
        handleDigit(event.key);
      } else if (event.key === "Backspace") {
        handleDelete();
      } else if (event.key === "Escape" || event.key === "Delete") {
        // Use 'Escape' or 'Delete' key to clear the input
        handleClear();
      }
    };

    // Add the event listener to the whole window
    window.addEventListener("keydown", handleKeyDown);

    // 3. The "cleanup" function
    // This function is returned by useEffect and runs when the component is unmounted.
    // It's crucial for preventing memory leaks!
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDigit, handleDelete, handleClear]); // 4. The dependency array

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-xs mx-auto">
        <div className="bg-gray-800 rounded-t-lg p-4 text-right text-4xl font-mono text-white overflow-x-auto">
          {value || "0"}
        </div>
        <Numpad
          onDigit={handleDigit}
          onClear={handleClear}
          onDelete={handleDelete}
        />
      </div>
      <p className="mt-8 text-gray-400 text-center">
        Try using your physical keyboard! (Numbers, '.', Backspace, Escape)
      </p>
    </main>
  );
}
