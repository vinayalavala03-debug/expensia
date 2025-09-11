import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// 🔹 Get all recurring payments (list)
export const getRecurringPayments = async () => {
  const res = await axiosInstance.get(API_PATHS.RECURRING.GET_ALL);
  // Always return an array
  return res.data?.data || [];
};

// 🔹 Add a new recurring payment
export const addRecurringPayment = async (payment) => {
  const res = await axiosInstance.post(API_PATHS.RECURRING.ADD, payment);
  return res.data?.data;
};

// 🔹 Delete a recurring payment
export const deleteRecurringPayment = async (id) => {
  const res = await axiosInstance.delete(API_PATHS.RECURRING.DELETE(id));
  return res.data;
};

// 🔹 Undo the last generated expense
export const undoLastExpense = async (expenseId) => {
  const res = await axiosInstance.post(API_PATHS.RECURRING.UNDO, { expenseId });
  return res.data;
};

// 🔹 Pause a subscription
export const pauseSubscription = async (id) => {
  const res = await axiosInstance.put(API_PATHS.RECURRING.PAUSE(id));
  return res.data;
};

// 🔹 Resume a subscription
export const resumeSubscription = async (id) => {
  const res = await axiosInstance.put(API_PATHS.RECURRING.RESUME(id));
  return res.data;
};

// 🔹 Toggle subscription (Pause/Resume based on status)
export const toggleSubscription = async (id, status) => {
  if (status === "active") {
    return pauseSubscription(id);
  } else {
    return resumeSubscription(id);
  }
};

// 🔹 Get subscription overview (dashboard)
export const getSubscriptionOverview = async () => {
  const res = await axiosInstance.get(API_PATHS.RECURRING.DASHBOARD);

  // Normalize response → extract from data.subscriptions
  const raw = res.data?.data?.subscriptions || {};

  return {
    totalActive: raw.totalActive || 0,
    totalAmount: raw.totalAmount || 0,
    upcoming: raw.upcoming || [],
  };
};
