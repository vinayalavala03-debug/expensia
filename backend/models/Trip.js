const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, default: "" },
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
    incomes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Income" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
