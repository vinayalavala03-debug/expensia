import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";

const Calculator = () => {
  useUserAuth()
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleCalculate = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput("Error");
    }
  };

  return (
    
    <DashboardLayout activeMenu="Calculator">
      <div className="my-5 mx-auto">
      <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-200 rounded-lg p-4 w-full max-w-sm mx-auto text-white">
      <input
        type="text"
        value={input}
        readOnly
        className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white text-right text-xl outline-none"
      />

      <div className="grid grid-cols-4 gap-3">
        {["7", "8", "9", "/",
          "4", "5", "6", "*",
          "1", "2", "3", "-",
          "0", ".", "=", "+"].map((val) => (
          <button
            key={val}
            onClick={() =>
              val === "=" ? handleCalculate() : handleClick(val)
            }
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold text-lg py-3 rounded-lg transition-all duration-200"
          >
            {val}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="col-span-4 bg-red-500 hover:bg-red-600 text-white font-semibold text-lg py-3 rounded-lg transition-all duration-200"
        >
          Clear
        </button>
      </div>
    </div>
    </div>
      </div>
    </DashboardLayout>
    
  );
};

export default Calculator;
