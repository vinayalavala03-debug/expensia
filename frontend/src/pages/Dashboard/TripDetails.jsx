import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import IncomeList from "../../components/Income/IncomeList";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

// ✅ Import Charts
import CustomBarChart from "../../components/Charts/CustomBarChart";
import CustomLineChart from "../../components/Charts/CustomLineChart";

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openIncomeModal, setOpenIncomeModal] = useState(false);

  const fetchTripDetails = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TRIP.GET_TRIP_DETAILS(id));
      setTrip(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch trip details");
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      await axiosInstance.post(API_PATHS.TRIP.ADD_EXPENSE_TO_TRIP(id), expense);
      toast.success("Expense added to trip");
      setOpenExpenseModal(false);
      fetchTripDetails();
    } catch (err) {
      toast.error("Failed to add expense");
    }
  };

  const handleAddIncome = async (income) => {
    try {
      await axiosInstance.post(API_PATHS.TRIP.ADD_INCOME_TO_TRIP(id), income);
      toast.success("Income added to trip");
      setOpenIncomeModal(false);
      fetchTripDetails();
    } catch (err) {
      toast.error("Failed to add income");
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  if (!trip) return <p>Loading...</p>;

  // ✅ Calculate totals
  const totalIncome = trip.incomes?.reduce((acc, i) => acc + i.amount, 0) || 0;
  const totalExpenses = trip.expenses?.reduce((acc, e) => acc + e.amount, 0) || 0;
  const balance = totalIncome - totalExpenses;

  return (
    <DashboardLayout activeMenu="Trips">
      <div className="my-6 mx-auto max-w-5xl space-y-10">
        {/* Trip Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-1">{trip.name}</h2>
          <p className="text-gray-600 text-sm">{trip.destination}</p>
          <p className="text-xs text-gray-400">
            {new Date(trip.startDate).toLocaleDateString()} –{" "}
            {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>

        {/* ✅ Summary Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg shadow p-6 text-center">
            <h4 className="text-lg font-semibold text-green-700">Total Income</h4>
            <p className="text-2xl font-bold text-green-800">₹{totalIncome}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-6 text-center">
            <h4 className="text-lg font-semibold text-red-700">Total Expenses</h4>
            <p className="text-2xl font-bold text-red-800">₹{totalExpenses}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-6 text-center">
            <h4 className="text-lg font-semibold text-blue-700">Balance</h4>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-blue-800" : "text-red-800"
              }`}
            >
              ₹{balance}
            </p>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-semibold">Expenses</h3>
              <p className="text-gray-500 text-sm">Track your spending</p>
            </div>
            <button
              className="add-btn add-btn-fill"
              onClick={() => setOpenExpenseModal(true)}
            >
              + Add Expense
            </button>
          </div>

          {/* Chart */}
          <div className="mb-6">
            <CustomLineChart data={trip.expenses || []} />
          </div>

          {/* List */}
          <ExpenseList transactions={trip.expenses || []} onDelete={() => {}} />
        </div>

        {/* Income Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-semibold">Income</h3>
              <p className="text-gray-500 text-sm">Monitor your earnings</p>
            </div>
            <button
              className="add-btn add-btn-fill"
              onClick={() => setOpenIncomeModal(true)}
            >
              + Add Income
            </button>
          </div>

          {/* Chart */}
          <div className="mb-6">
            <CustomBarChart data={trip.incomes || []} />
          </div>

          {/* List */}
          <IncomeList transactions={trip.incomes || []} onDelete={() => {}} />
        </div>

        {/* Modals */}
        <Modal
          isOpen={openExpenseModal}
          onClose={() => setOpenExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openIncomeModal}
          onClose={() => setOpenIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default TripDetails;
