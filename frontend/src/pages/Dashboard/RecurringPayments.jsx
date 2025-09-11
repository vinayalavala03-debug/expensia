import React, { useEffect, useState } from "react";
import RecurringList from "../../components/RecurringPayments/RecurringList";
import SubscriptionOverview from "../../components/RecurringPayments/SubscriptionOverview";
import AddRecurringForm from "../../components/RecurringPayments/AddRecurringForm";
import {
  getRecurringPayments,
  deleteRecurringPayment,
  toggleSubscription,
  undoLastExpense,
  addRecurringPayment,
  getSubscriptionOverview,
} from "../../services/recurringPaymentService";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";

const RecurringPayments = () => {
  const [payments, setPayments] = useState([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Fetch subscriptions + overview
  const fetchData = async () => {
    setLoading(true);
    try {
      const subs = await getRecurringPayments();       // array
      const stats = await getSubscriptionOverview();   // normalized object

      console.log("📊 Subscriptions fetched:", subs);
      console.log("📈 Overview fetched:", stats);

      setPayments(subs || []);
      setOverview(stats || {});
    } catch (err) {
      console.error("Error fetching recurring payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Add new subscription
  const handleAdd = async (formData) => {
    try {
      await addRecurringPayment(formData);
      await fetchData();
      setIsModalOpen(false); // close modal after success
    } catch (err) {
      console.error("Error adding a payment:", err);
    }
  };

  // 🔹 Delete subscription
  const handleDelete = async (id) => {
    try {
      await deleteRecurringPayment(id);
      await fetchData();
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

  // 🔹 Toggle pause/resume
  const handleToggle = async (id, status) => {
    try {
      await toggleSubscription(id, status);
      await fetchData();
    } catch (err) {
      console.error("Error toggling payment:", err);
    }
  };

  // 🔹 Undo last generated expense
  const handleUndo = async (expenseId) => {
    try {
      await undoLastExpense(expenseId);
      await fetchData();
    } catch (err) {
      console.error("Error undoing last expense:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="card mx-auto my-5 p-6">
        {/* Header + Add button */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg ">
            Scheduled Payments
          </h2>
          <p className="text-xs text-gray-400">Schedule your payments with ease.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-btn"
          >
            + Add a payment
          </button>
        </div>

        {/* Overview Stats */}
        {overview && <SubscriptionOverview data={overview} />}

        {/* Modal for Adding Subscription */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add a Payment"
        >
          <AddRecurringForm onAdd={handleAdd} />
        </Modal>

        {/* Subscriptions List */}
        <RecurringList
          payments={payments}
          loading={loading}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onUndo={handleUndo}
        />
      </div>
    </DashboardLayout>
  );
};

export default RecurringPayments;
