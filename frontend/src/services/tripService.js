import axios from "axios";
import { BASE_URL, API_PATHS } from "../utils/apiPaths";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ✅ Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Trips ---
export const getMyTrips = async () => {
  const res = await api.get(API_PATHS.TRIP.GET_ALL_TRIPS);
  return res.data?.data || []; // always return array
};

export const createTrip = (trip) => api.post(API_PATHS.TRIP.ADD_TRIP, trip);

export const getTripById = async (id) => {
  const res = await api.get(API_PATHS.TRIP.GET_TRIP_BY_ID(id));
  return res.data?.data || res.data; // normalize to plain trip object
};

// --- Participants ---
export const addParticipants = (tripId, userIds) =>
  api.post(API_PATHS.TRIP.ADD_PARTICIPANTS(tripId), { userIds });

export const removeParticipant = (tripId, userId) =>
  api.delete(API_PATHS.TRIP.REMOVE_PARTICIPANTS(tripId, userId));

// --- Places ---
export const addPlace = (tripId, place) =>
  api.post(API_PATHS.TRIP.ADD_PLACE(tripId), place);

export const markPlaceVisited = (tripId, placeId, visited) =>
  api.put(API_PATHS.TRIP.MARK_PLACE_VISITED(tripId, placeId), { visited });

// --- Expenses / Incomes ---
export const addExpenseToTrip = (tripId, expense) =>
  api.post(API_PATHS.TRIP.ADD_EXPENSE_TO_TRIP(tripId), expense);

export const addIncomeToTrip = (tripId, income) =>
  api.post(API_PATHS.TRIP.ADD_INCOME_TO_TRIP(tripId), income);

// --- Stats ---
export const getTripStats = async (tripId) => {
  const res = await api.get(API_PATHS.TRIP.GET_TRIP_STATS(tripId));
  return res.data?.data || res.data;
};

// --- Chat ---
export const postMessage = async (tripId, message) => {
  const res = await api.post(API_PATHS.TRIP.POST_MESSAGE(tripId), { message });
  return res.data;
};

export const getChat = async (tripId) => {
  const res = await api.get(API_PATHS.TRIP.GET_CHAT(tripId));
  return res.data; // backend returns array directly
};

// --- Visibility ---
export const updateTripVisibility = (tripId, visibility) =>
  api.patch(API_PATHS.TRIP.UPDATE_VISIBILITY(tripId), { visibility });
