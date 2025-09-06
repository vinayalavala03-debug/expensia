import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const ExpenseList = ({
  groupedExpenses,
  onDelete,
  onDownload,
  currentPage,
  totalPages,
  onPageChange,
  onDatePick
}) => {
  // ✅ Generate page numbers (max 5 visible at once)
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h5 className="text-lg font-semibold">Expenses by Date</h5>

        {/* ✅ Controls with mobile right-align */}
        <div className="flex justify-between items-center md:justify-end gap-2 w-full md:w-auto">
          {/* Date Picker */}
          <input
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            onChange={(e) => onDatePick(e.target.value)}
            className="card-btn"
          />

          {/* Download Button */}
          <button
            className="add-btn"
            onClick={onDownload}
          >
            <LuDownload className="text-sm sm:text-base" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Download</span>
          </button>
        </div>
      </div>

      {/* Expense Groups */}
      {groupedExpenses && groupedExpenses.length > 0 ? (
        groupedExpenses.map((group) => (
          <div key={group._id} className="mt-4">
            {/* Group Date */}
            <h6 className="font-semibold text-gray-700 mb-2">
              {moment(group._id).format('DD MMM YYYY')}
            </h6>

            {/* Expenses for this date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(group.expenses) &&
                group.expenses.map((expense) => (
                  <div key={expense._id} className="flex justify-center">
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-none">
                      <TransactionInfoCard
                        title={expense.category}
                        amount={expense.amount}
                        date={moment(expense.date).format('DD MMM YYYY')}
                        type="expense"
                        icon={expense.icon}
                        description={expense.description}
                        onDelete={() => onDelete(expense._id)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 mt-4 text-sm">No expenses found.</p>
      )}

      {/* ✅ Pagination INSIDE card */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          {/* Prev */}
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-lg border ${
              currentPage <= 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-lg border ${
                page === currentPage
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm rounded-lg border ${
              currentPage >= totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ExpenseList
