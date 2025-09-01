import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";

const Calculator = () => {
  useUserAuth();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]); // store past calculations

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      const result = eval(input).toString();
      setHistory((prev) => [...prev, `${input} = ${result}`]); // save history
      setInput(result);
    } catch {
      setInput("Error");
    }
  };

  return (
    <DashboardLayout activeMenu="Calculator">
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 space-y-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl rounded-3xl p-6 w-full max-w-sm">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Expensia Calculator
          </h2>

          {/* Display */}
          <div className="mb-6">
            <input
              type="text"
              value={input}
              readOnly
              className="w-full p-4 rounded-2xl bg-white shadow-inner text-gray-900 text-right text-3xl font-bold tracking-wide outline-none border border-gray-200"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-4">
            {[
              "7",
              "8",
              "9",
              "÷",
              "4",
              "5",
              "6",
              "×",
              "1",
              "2",
              "3",
              "−",
              "0",
              ".",
              "=",
              "+",
            ].map((val) => (
              <button
                key={val}
                onClick={() =>
                  val === "="
                    ? handleCalculate()
                    : handleClick(
                        val
                          .replace("÷", "/")
                          .replace("×", "*")
                          .replace("−", "-")
                          .replace("+", "+")
                      )
                }
                className={`${
                  val === "="
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : ["÷", "×", "−", "+"].includes(val)
                    ? "bg-purple-200 text-purple-900 hover:bg-purple-300"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                } font-semibold text-xl py-4 rounded-2xl shadow-md transition-all duration-200 active:scale-95`}
              >
                {val}
              </button>
            ))}

            {/* Backspace Button */}
            <button
              onClick={handleBackspace}
              className="col-span-2 bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg py-4 rounded-2xl shadow-md transition-all duration-200 active:scale-95"
            >
              ⌫ Backspace
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClear}
              className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-bold text-lg py-4 rounded-2xl shadow-md transition-all duration-200 active:scale-95"
            >
              Clear
            </button>
          </div>
        </div>

        {/* History Panel */}
        <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-sm h-48 overflow-y-auto">
          <h3 className="text-md font-semibold text-gray-700 mb-2">History</h3>
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">No history yet</p>
          ) : (
            <ul className="space-y-1 text-sm text-gray-800">
              {history.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between border-b pb-1 text-gray-600"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calculator;
