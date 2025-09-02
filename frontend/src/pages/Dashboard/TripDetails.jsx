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

// ✅ Charts
import CustomBarChart from "../../components/Charts/CustomBarChart";
import CustomLineChart from "../../components/Charts/CustomLineChart";

// ✅ Icons
import { IoMdCard } from "react-icons/io";
import { LuWalletMinimal, LuHandCoins } from "react-icons/lu";

const addThousandSeparator = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

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

  const totalIncome =
    trip?.incomes?.reduce((acc, i) => acc + i.amount, 0) || 0;
  const totalExpenses =
    trip?.expenses?.reduce((acc, e) => acc + e.amount, 0) || 0;
  const balance = totalIncome - totalExpenses;

  return (
    <DashboardLayout activeMenu="Trips">
      <div className="my-6 mx-auto max-w-6xl space-y-10">
        {/* Trip Header */}
        {trip && (
          <div className="flex items-center border border-gray-200 rounded-lg p-6 space-x-4">
            <h2 className="text-2xl font-bold mb-1">{trip.name}</h2>
            <p className="text-gray-600 text-sm">{trip.destination}</p>
            <p className="text-xs text-gray-400">
              {new Date(trip.startDate).toLocaleDateString()} –{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Summary Row (bordered boxes only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center border border-gray-200 rounded-lg p-6 space-x-4">
            <div className="bg-primary text-white p-3 rounded-full">
              <IoMdCard className="text-2xl" />
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-600">
                Total Balance
              </h4>
              <p className="text-xl font-bold text-gray-900">
                ₹{addThousandSeparator(balance)}
              </p>
            </div>
          </div>

          <div className="flex items-center border border-gray-200 rounded-lg p-6 space-x-4">
            <div className="bg-orange-500 text-white p-3 rounded-full">
              <LuWalletMinimal className="text-2xl" />
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-600">
                Total Income
              </h4>
              <p className="text-xl font-bold text-gray-900">
                ₹{addThousandSeparator(totalIncome)}
              </p>
            </div>
          </div>

          <div className="flex items-center border border-gray-200 rounded-lg p-6 space-x-4">
            <div className="bg-red-500 text-white p-3 rounded-full">
              <LuHandCoins className="text-2xl" />
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-600">
                Total Expenses
              </h4>
              <p className="text-xl font-bold text-gray-900">
                ₹{addThousandSeparator(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs (no inside white card) */}
        <div>
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "expenses"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("expenses")}
            >
              Expenses
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "income"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("income")}
            >
              Income
            </button>
          </div>

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <>
              <div className="flex justify-between items-center m-4">
                <h3 className="text-lg font-semibold">Expenses</h3>
                <button
                  className="add-btn"
                  onClick={() => setOpenExpenseModal(true)}
                >
                  + Add Expense
                </button>
              </div>

              <div className="mb-4">
                <CustomLineChart data={trip?.expenses || []} />
              </div>

              <ExpenseList
                transactions={trip?.expenses || []}
                onDelete={() => {}}
              />
            </>
          )}

          {/* Income Tab */}
          {activeTab === "income" && (
            <>
              <div className="flex justify-between items-center m-4">
                <h3 className="text-lg font-semibold">Income</h3>
                <button
                  className="add-btn"
                  onClick={() => setOpenIncomeModal(true)}
                >
                  + Add Income
                </button>
              </div>

              <div className="mb-4">
                <CustomBarChart data={trip?.incomes || []} />
              </div>

              <IncomeList
                transactions={trip?.incomes || []}
                onDelete={() => {}}
              />
            </>
          )}
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
