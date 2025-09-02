import React from 'react';
import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2 } from 'react-icons/lu';

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete, description }) => {

  const getAmountStyles = () => {
    if (type === 'income') {
      return 'bg-green-50 text-green-500';
    }
    if (type === 'expense') {
      return 'bg-red-50 text-red-500';
    }
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
        {icon ? (
          typeof icon === 'string' && icon.startsWith('http') ? (
            <img src={icon} alt={title} className="w-6 h-6" />
          ) : (
            <span className="text-xl">{icon}</span>
          )
        ) : (
          <LuUtensils />
        )}
      </div>

      {/* Transaction details */}
      <div className="flex-1 flex-col items-center justify-between">
        <h6 className="text-sm font-medium text-gray-700">{title}</h6>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{date}</p>
      </div>

      {/* Right side (amount + delete button) */}
      <div className="flex flex-col sm:flex-row-reverse items-center-safe sm:items-center  gap-2">
        {/* Amount */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
          <h6 className="text-xs font-medium">
            {type === 'income' ? "+ " : "- "}₹{amount}
          </h6>
          {type === 'income' ? (
            <LuTrendingUp className="text-green-500" />
          ) : (
            <LuTrendingDown className="text-red-500" />
          )}
        </div>

        {/* Delete button */}
        {!hideDeleteBtn && (
          <button
            className="
              text-gray-400 hover:text-red-500
              block sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:block
              transition-opacity
            "
            onClick={onDelete}
          >
            <LuTrash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionInfoCard;
