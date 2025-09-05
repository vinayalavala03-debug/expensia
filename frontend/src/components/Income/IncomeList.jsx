import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const IncomeList = ({
  groupedIncomes,
  onDelete,
  onDownload,
  currentPage,
  totalPages,
  onPageChange,
  onDatePick,
}) => {
  // ✅ Generate page numbers (max 5 visible at once)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Incomes by Date</h5>

        <div className="flex gap-2 items-center">
          {/* Date Picker */}
          <input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            onChange={(e) => onDatePick(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />

          {/* Download Button */}
          <button
            className="card-btn flex items-center gap-1"
            onClick={onDownload}
          >
            <LuDownload className="text-base" />
            Download
          </button>
        </div>
      </div>

      {/* Income Groups */}
      {groupedIncomes && groupedIncomes.length > 0 ? (
        groupedIncomes.map((group) => (
          <div key={group._id} className="mt-4">
            {/* Group Date */}
            <h6 className="font-semibold text-gray-700 mb-2">
              {moment(group._id).format("DD MMM YYYY")}
            </h6>

            {/* Incomes for this date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(group.incomes) &&
                group.incomes.map((income) => (
                  <TransactionInfoCard
                    key={income._id}
                    title={income.source}
                    amount={income.amount}
                    date={moment(income.date).format("DD MMM YYYY")}
                    type="income"
                    icon={income.icon}
                    description={income.description}
                    onDelete={() => onDelete(income._id)}
                  />
                ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 mt-4 text-sm">No incomes found.</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          {/* Prev */}
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`px-3 py-1 rounded border ${
              currentPage <= 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded border ${
                page === currentPage
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage >= totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
