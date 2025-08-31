import React from 'react';

const CustomLegend = ({ payload }) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center space-x-2">
          {/* Color dot */}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>

          {/* Label + Amount */}
          <span className="text-sm text-gray-700 font-medium">
            {entry.value}  
            {entry.payload?.amount !== undefined && (
              <span className="ml-1 text-gray-500">
                (₹{entry.payload.amount.toLocaleString()})
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
