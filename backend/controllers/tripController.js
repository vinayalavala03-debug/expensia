const Trip = require("../models/Trip");
const Expense = require("../models/Expense");
const Income = require("../models/Income");

// Add Trip
exports.addTrip = async (req, res) => {
  try {
    const { name, destination, startDate, endDate, description } = req.body;
    const trip = new Trip({
      userId: req.user.id,
      name,
      destination,
      startDate,
      endDate,
      description,
    });
    await trip.save();
    res.status(201).json({ data: trip });
  } catch (err) {
    console.error("Add Trip Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all Trips for user
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ startDate: -1 });
    res.json({ data: trips });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Trip details (with populated expenses & incomes)
exports.getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("expenses")
      .populate("incomes");

    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ data: trip });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add Expense to a Trip
exports.addExpenseToTrip = async (req, res) => {
  try {
    const { category, amount, date, description, icon } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // create expense
    const expense = new Expense({
      userId: req.user.id,
      category,
      amount,
      date,
      description: description || "No description",
      icon: icon || "💸",
    });
    await expense.save();

    trip.expenses.push(expense._id);
    await trip.save();

    res.json({ data: expense });
  } catch (err) {
    console.error("Add Expense to Trip Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add Income to a Trip
exports.addIncomeToTrip = async (req, res) => {
  try {
    const { source, amount, date, description, icon } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // create income
    const income = new Income({
      userId: req.user.id,
      source,
      amount,
      date,
      description: description || "No description",
      icon: icon || "💰",
    });
    await income.save();

    trip.incomes.push(income._id);
    await trip.save();

    res.json({ data: income });
  } catch (err) {
    console.error("Add Income to Trip Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
