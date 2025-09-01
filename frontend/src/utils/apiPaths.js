export const BASE_URL = 'http://localhost:4001';

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getuser",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard"
  },
  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get",
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
    DOWNLOAD_INCOME: "/api/v1/income/download"
  },
  TRIP: {
    GET_ALL_TRIPS: "/api/v1/trips",
    ADD_TRIP: "/api/v1/trips",
    GET_TRIP_DETAILS: (id) => `/api/v1/trips/${id}`,
    ADD_EXPENSE_TO_TRIP: (id) => `/api/v1/trips/${id}/expenses`,
    ADD_INCOME_TO_TRIP: (id) => `/api/v1/trips/${id}/incomes`,
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/get",
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
    DOWNLOAD_EXPENSE: "/api/v1/expense/download"
  },
  IMAGE:{
    UPLOAD_IMAGE:'/api/v1/auth/upload-image',
  }
};
