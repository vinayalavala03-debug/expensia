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

// Charts
import CustomBarChart from "../../components/Charts/CustomBarChart";
import CustomLineChart from "../../components/Charts/CustomLineChart";

// Icons
import { IoMdCard } from "react-icons/io";
import {
  LuWalletMinimal,
  LuHandCoins,
  LuUserPlus,
  LuUserMinus,
  LuMapPin,
} from "react-icons/lu";

// Delete Alert
import DeleteAlert from "../../components/DeleteAlert";

// Trip Chat
import TripChat from "../../components/Trip/TripChat";

const addThousandSeparator = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    type: null,
    data: null,
  });

  // Local UI state for participants & places
  const [participantEmailsInput, setParticipantEmailsInput] = useState(""); // comma/space separated emails
  const [newPlace, setNewPlace] = useState({
    name: "",
    location: "",
    plannedCost: "",
    notes: "",
  });

  // ---------- Fetch helpers ----------
  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.TRIP.GET_TRIP_BY_ID(id));
      const details = res.data?.data || res.data;
      setTrip(details);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to fetch trip details");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Participants actions ----------
  const handleAddParticipants = async () => {
    const raw = participantEmailsInput.trim();
    if (!raw) {
      toast.error("Enter one or more emails (comma/space separated)");
      return;
    }

    const emails = Array.from(
      new Set(
        raw
          .split(/[,\s]+/)
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      )
    );

    try {
      await axiosInstance.post(API_PATHS.TRIP.ADD_PARTICIPANTS(id), { emails });
      toast.success("Participants added");
      setParticipantEmailsInput("");
      fetchTripDetails();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add participants");
    }
  };

  const handleRemoveParticipant = async (userId) => {
    try {
      await axiosInstance.delete(API_PATHS.TRIP.REMOVE_PARTICIPANTS(id, userId));
      toast.success("Participant removed");
      fetchTripDetails();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to remove participant");
    }
  };

  // ---------- Expense actions ----------
  const handleAddExpense = async (expense) => {
    try {
      const res = await axiosInstance.post(
        API_PATHS.TRIP.ADD_EXPENSE_TO_TRIP(id),
        expense
      );
      const newExpense = res.data.data;

      setTrip((prev) => ({
        ...prev,
        expenses: [...(prev?.expenses || []), newExpense],
      }));

      toast.success("Expense added to trip");
      setOpenExpenseModal(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to add expense");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId));
      toast.success("Expense deleted");
      setOpenDeleteAlert({ show: false, type: null, data: null });
      fetchTripDetails();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete expense");
    }
  };

  // ---------- Income actions ----------
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

  const handleDeleteIncome = async (incomeId) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeId));
      setOpenDeleteAlert({ show: false, type: null, data: null });
      toast.success("Income deleted successfully");
      fetchTripDetails();
    } catch (error) {
      console.error(
        "Failed to delete income:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to delete income");
    }
  };

  // ---------- Places actions ----------
  const handleAddPlace = async () => {
    const payload = {
      name: newPlace.name?.trim(),
      location: newPlace.location?.trim(),
      plannedCost: Number(newPlace.plannedCost) || 0,
      notes: newPlace.notes?.trim(),
    };

    if (!payload.name) {
      toast.error("Place name is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.TRIP.ADD_PLACE(id), payload);
      toast.success("Place added");
      setNewPlace({ name: "", location: "", plannedCost: "", notes: "" });
      fetchTripDetails();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add place");
    }
  };

  const toggleVisited = async (placeId, current) => {
    try {
      await axiosInstance.put(API_PATHS.TRIP.MARK_PLACE_VISITED(id, placeId), {
        visited: !current,
      });
      setTrip((prev) => ({
        ...prev,
        places: prev.places.map((p) =>
          String(p._id) === String(placeId)
            ? { ...p, visited: !current }
            : p
        ),
      }));
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update place");
    }
  };

  useEffect(() => {
    fetchTripDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ---------- Financial totals ----------
  const totalIncome =
    trip?.incomes?.reduce((acc, i) => acc + (Number(i.amount) || 0), 0) || 0;
  const totalExpenses =
    trip?.expenses?.reduce((acc, e) => acc + (Number(e.amount) || 0), 0) || 0;
  const balance = totalIncome - totalExpenses;

  return (
    <DashboardLayout activeMenu="Trips">
      <div className="my-6 mx-auto max-w-6xl space-y-10">
        {/* Trip Header */}
        {trip && (
          <div className="bg-white rounded-2xl shadow p-6 flex flex-wrap items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">{trip.name}</h2>
            <span className="text-gray-600 text-sm">{trip.destination}</span>
            <span className="text-xs text-gray-500">
              {new Date(trip.startDate).toLocaleDateString()} –{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                trip.visibility === "group"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {trip.visibility === "group" ? "🌍 Group" : "🔒 Private"}
            </span>
            <span className="text-xs text-gray-500">
              {(trip.participants?.length || 0)} people
            </span>
          </div>
        )}

        {!trip && loading && (
          <div className="text-center text-gray-500">Loading trip…</div>
        )}

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
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

          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
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

          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
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

        {/* Tabs */}
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
              <div className="flex flex-col items-center text-center gap-2 m-4 md:flex-row-reverse md:justify-start lg:justify-between">
                <button
                  className="add-btn"
                  onClick={() => setOpenExpenseModal(true)}
                >
                  + Add Expense
                </button>
                <h3 className="text-lg font-semibold">Expenses</h3>
              </div>

              <div className="mb-4">
                <CustomLineChart data={trip?.expenses || []} />
              </div>

              <ExpenseList
                transactions={trip?.expenses || []}
                onDelete={(id) =>
                  setOpenDeleteAlert({ show: true, type: "expense", data: id })
                }
              />
            </>
          )}

          {/* Income Tab */}
          {activeTab === "income" && (
            <>
              <div className="flex flex-col items-center text-center gap-2 m-4 md:flex-row-reverse md:justify-start lg:justify-between">
                <button
                  className="add-btn"
                  onClick={() => setOpenIncomeModal(true)}
                >
                  + Add Income
                </button>
                <h3 className="text-lg font-semibold">Income</h3>
              </div>

              <div className="mb-4">
                <CustomBarChart data={trip?.incomes || []} />
              </div>

              <IncomeList
                transactions={trip?.incomes || []}
                onDelete={(id) =>
                  setOpenDeleteAlert({ show: true, type: "income", data: id })
                }
              />
            </>
          )}
        </div>

        {/* Participants & Places */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Participants Card */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Participants
            </h3>

            {/* Add participants */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
                placeholder="Enter participant emails (comma/space separated)"
                value={participantEmailsInput}
                onChange={(e) => setParticipantEmailsInput(e.target.value)}
              />
              <button className="add-btn" onClick={handleAddParticipants}>
                <LuUserPlus className="inline-block mr-1" /> Add
              </button>
            </div>

            {/* List */}
            <div className="space-y-2">
              {(trip?.participants || []).length === 0 ? (
                <p className="text-sm text-gray-500">No participants yet.</p>
              ) : (
                trip.participants.map((p) => {
                  const idStr = typeof p === "string" ? p : p._id;
                  const name =
                    typeof p === "string"
                      ? `User ${idStr.slice(-4)}`
                      : p.fullName || `User ${idStr?.slice(-4) || ""}`;
                  const email = typeof p === "string" ? "" : p.email;
                  return (
                    <div
                      key={idStr}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {name}
                        </div>
                        {email && (
                          <div className="text-xs text-gray-500">{email}</div>
                        )}
                      </div>
                      <button
                        className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                        onClick={() => handleRemoveParticipant(idStr)}
                      >
                        <LuUserMinus /> Remove
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Places Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Places</h3>
            <button className="add-btn" onClick={handleAddPlace}>
              <LuMapPin className="inline-block mr-1" /> Add Place
            </button>
          </div>

          {/* Add place inputs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
            <input
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="Name *"
              value={newPlace.name}
              onChange={(e) =>
                setNewPlace((s) => ({ ...s, name: e.target.value }))
              }
            />
            <input
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="Location"
              value={newPlace.location}
              onChange={(e) =>
                setNewPlace((s) => ({ ...s, location: e.target.value }))
              }
            />
            <input
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="Planned Cost"
              type="number"
              value={newPlace.plannedCost}
              onChange={(e) =>
                setNewPlace((s) => ({ ...s, plannedCost: e.target.value }))
              }
            />
            <input
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="Notes"
              value={newPlace.notes}
              onChange={(e) =>
                setNewPlace((s) => ({ ...s, notes: e.target.value }))
              }
            />
          </div>
            {/* Places list */}
            <div className="space-y-2">
              {(trip?.places || []).length === 0 ? (
                <p className="text-sm text-gray-500">No places added yet.</p>
              ) : (
                trip.places.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {p.name}{" "}
                        {p.location && (
                          <span className="text-xs text-gray-500">
                            — {p.location}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Planned: ₹{addThousandSeparator(p.plannedCost || 0)}{" "}
                        {p.notes ? `• ${p.notes}` : ""}
                      </div>
                    </div>
                    <button
                      className={`text-sm flex items-center gap-1 ${
                        p.visited ? "text-green-600" : "text-gray-600"
                      } hover:opacity-80`}
                      onClick={() => toggleVisited(p._id, p.visited)}
                    >
                      {p.visited ? "Visited ✅" : "Mark visited"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Group Chat */}
        {trip?.visibility === "group" && (
          <div className="bg-white rounded-2xl shadow p-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Trip Chat 💬
            </h3>
            <TripChat tripId={trip._id} />
          </div>
        )}

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

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() =>
            setOpenDeleteAlert({ show: false, type: null, data: null })
          }
          title={`Delete ${
            openDeleteAlert.type === "income" ? "Income" : "Expense"
          }`}
        >
          <DeleteAlert
            content={`Are you sure you want to delete this ${openDeleteAlert.type}?`}
            onDelete={() => {
              if (openDeleteAlert.type === "income") {
                handleDeleteIncome(openDeleteAlert.data);
              } else {
                handleDeleteExpense(openDeleteAlert.data);
              }
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default TripDetails;
