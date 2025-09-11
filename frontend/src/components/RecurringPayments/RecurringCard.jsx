import React from "react";
import moment from "moment";
import {
  CreditCard,
  Wifi,
  Music,
  Tv,
  Smartphone,
  ShoppingBag,
  Repeat,
} from "lucide-react";

const getIcon = (name) => {
  if (!name) return Repeat;
  const lower = name.toLowerCase();
  if (lower.includes("netflix") || lower.includes("prime")) return Tv;
  if (lower.includes("spotify") || lower.includes("music")) return Music;
  if (lower.includes("internet") || lower.includes("wifi")) return Wifi;
  if (lower.includes("phone") || lower.includes("mobile")) return Smartphone;
  if (lower.includes("shopping") || lower.includes("amazon")) return ShoppingBag;
  if (lower.includes("card") || lower.includes("payment")) return CreditCard;
  return Repeat;
};

const RecurringCard = ({ subscription, onDelete, onToggle, onUndo }) => {
  const {
    _id,
    name,
    amount,
    frequency,
    customInterval = 1,
    startDate,
    nextDate,
    status,
    lastGenerated,
    lastGeneratedExpenseId,
  } = subscription;

  const Icon = getIcon(name);

  return (
    <div className="card mt-6">
      {/* Icon badge */}
      <div className="absolute -top-4 right-4 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shadow">
        <Icon size={20} className="text-indigo-600" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-900 truncate">{name}</h4>
        <span
          className={`ml-2 text-xs px-3 py-1 rounded-full font-medium ${
            status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-2">
        <p className="text-sm text-gray-500">
          Every {customInterval} {frequency}
        </p>
        <p className="text-sm text-gray-500">
          Started {moment(startDate).format("DD MMM YYYY")}
        </p>

        <div>
          <p className="text-xs text-gray-400">Next Payment</p>
          <p className="text-sm font-semibold text-gray-800">
            {nextDate ? moment(nextDate).format("DD MMM YYYY") : "Not Scheduled"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Amount</p>
          <p className="text-2xl font-extrabold text-emerald-700">₹{amount}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
          onClick={() => onToggle(_id, status)}
        >
          {status === "active" ? "Pause" : "Resume"}
        </button>

        {lastGenerated && (
          <button
            className="px-4 py-1 text-xs rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
            onClick={() => onUndo(lastGeneratedExpenseId)}
          >
            Undo
          </button>
        )}

        <button
          className="px-4 py-1 text-xs rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
          onClick={() => onDelete(_id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default RecurringCard;
