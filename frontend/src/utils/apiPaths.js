export const BASE_URL = 'https://expense-tracker-back-eight.vercel.app';

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getuser",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },

  TRIP: {
    GET_ALL_TRIPS: "/api/v1/trips",               // GET
    ADD_TRIP: "/api/v1/trips",                    // POST
    GET_TRIP_BY_ID: (id) => `/api/v1/trips/${id}`,

    // Expenses & incomes
    ADD_EXPENSE_TO_TRIP: (id) => `/api/v1/trips/${id}/expenses`,
    ADD_INCOME_TO_TRIP: (id) => `/api/v1/trips/${id}/incomes`,

    // Participants (creator only)
    ADD_PARTICIPANTS: (tripId) => `/api/v1/trips/${tripId}/participants`,
    REMOVE_PARTICIPANTS: (tripId, userId) => `/api/v1/trips/${tripId}/participants/${userId}`,

    // Places (creator only)
    ADD_PLACE: (tripId) => `/api/v1/trips/${tripId}/places`,
    MARK_PLACE_VISITED: (tripId, placeId) => `/api/v1/trips/${tripId}/places/${placeId}`,

    // Stats
    GET_TRIP_STATS: (tripId) => `/api/v1/trips/${tripId}/stats`,

    // Chat
    POST_MESSAGE: (tripId) => `/api/v1/trips/${tripId}/messages`,
    GET_CHAT: (tripId) => `/api/v1/trips/${tripId}/messages`,

    // Visibility
    UPDATE_VISIBILITY: (tripId) => `/api/v1/trips/${tripId}/visibility`,
  },

  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get",
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
    DOWNLOAD_INCOME: "/api/v1/income/download",
  },

  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/get",
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
    DOWNLOAD_EXPENSE: "/api/v1/expense/download",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
};
