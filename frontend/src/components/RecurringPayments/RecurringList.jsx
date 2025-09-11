import React, { useState } from "react";
import RecurringCard from "./RecurringCard";
import Modal from "../Modal";

const RecurringList = ({
  payments = [],
  loading,
  onDelete,
  onToggle,
  onUndo,
}) => {
  const [undoModal, setUndoModal] = useState({ show: false, expenseId: null });

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-500 text-sm animate-pulse">
          Loading subscriptions...
        </p>
      </div>
    );
  }

  // 🔹 Empty state
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
          <span className="text-3xl">📭</span>
        </div>
        <p className="text-gray-600 font-medium">
          No subscriptions found
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Add your first recurring payment to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.map((sub) => (
          <RecurringCard
            key={sub._id}
            subscription={sub}
            onDelete={onDelete}
            onToggle={onToggle}
            onUndo={(expenseId) =>
              setUndoModal({ show: true, expenseId })
            }
          />
        ))}
      </div>

      {/* Undo Modal */}
      <Modal
        isOpen={undoModal.show}
        onClose={() => setUndoModal({ show: false, expenseId: null })}
        title="Undo Last Payment"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to undo the last generated expense for this subscription?
          </p>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              onClick={() => setUndoModal({ show: false, expenseId: null })}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              onClick={() => {
                onUndo(undoModal.expenseId);
                setUndoModal({ show: false, expenseId: null });
              }}
            >
              Undo Payment
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RecurringList;
