
import React from "react";
import { BsBackspace } from "react-icons/bs"; 

type NumpadButtonProps = {
  children: React.ReactNode; // 'children' can be a string, number, or another component (like an icon)
  onClick: React.MouseEventHandler<HTMLButtonElement>; // 'onClick' must be a function that handles a mouse click on a button
  className?: string; // The '?' makes the className prop optional
};

const NumpadButton = ({
  children,
  onClick,
  className = "",
}: NumpadButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center 
        bg-gray-200 hover:bg-gray-300 
        dark:bg-gray-700 dark:hover:bg-gray-600
        text-2xl font-semibold text-gray-800 dark:text-white 
        rounded-lg aspect-square 
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Define the types for the main Numpad's props
type NumpadProps = {
  onDigit: (digit: string) => void;
  onClear: () => void;
  onDelete: () => void;
};

// The main Numpad component
const Numpad = ({ onDigit, onClear, onDelete }: NumpadProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      {/* --- FIX #3: Use the NumpadButton component --- */}

      {/* Number Buttons (7-9) */}
      <NumpadButton onClick={() => onDigit("7")}>7</NumpadButton>
      <NumpadButton onClick={() => onDigit("8")}>8</NumpadButton>
      <NumpadButton onClick={() => onDigit("9")}>9</NumpadButton>

      {/* Number Buttons (4-6) */}
      <NumpadButton onClick={() => onDigit("4")}>4</NumpadButton>
      <NumpadButton onClick={() => onDigit("5")}>5</NumpadButton>
      <NumpadButton onClick={() => onDigit("6")}>6</NumpadButton>

      {/* Number Buttons (1-3) */}
      <NumpadButton onClick={() => onDigit("1")}>1</NumpadButton>
      <NumpadButton onClick={() => onDigit("2")}>2</NumpadButton>
      <NumpadButton onClick={() => onDigit("3")}>3</NumpadButton>

      {/* Bottom Row */}
      <NumpadButton onClick={onClear} className="bg-red-500">Clear</NumpadButton>
      <NumpadButton onClick={() => onDigit("0")}>0</NumpadButton>
      <NumpadButton onClick={onDelete}>
        <BsBackspace />
      </NumpadButton>
    </div>
  );
};

export default Numpad;
