const express = require("express");
const { protect } = require('../middleware/authMiddleware.js');
const {
  addTrip,
  getTrips,
  getTripDetails,
  addExpenseToTrip,
  addIncomeToTrip,
} = require("../controllers/tripController");

const router = express.Router();

router.post("/", protect, addTrip);
router.get("/", protect, getTrips);
router.get("/:id", protect, getTripDetails);

// nested routes
router.post("/:id/expenses", protect, addExpenseToTrip);
router.post("/:id/incomes", protect, addIncomeToTrip);

module.exports = router;
