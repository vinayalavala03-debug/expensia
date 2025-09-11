import React, { useState } from "react";
import Input from "../Inputs/Input";

const AddRecurringForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    frequency: "monthly",
    customInterval: 1,
    startDate: "",
    endDate: "",
    category: "",
    description: "",
  });

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.amount) return alert("Name and amount required");
    onAdd(form);
  };

  return (
    <div className="space-y-4">
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Netflix, Spotify, etc."
      />

      <Input
        label="Amount"
        type="number"
        value={form.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        placeholder="Enter amount"
      />

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Frequency
        </label>
        <select
          value={form.frequency}
          onChange={(e) => handleChange("frequency", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <Input
        label="Custom Interval"
        type="number"
        value={form.customInterval}
        onChange={(e) => handleChange("customInterval", e.target.value)}
        placeholder="1 = every month, 2 = every 2 months"
      />

      <Input
        label="Start Date"
        type="date"
        value={form.startDate}
        onChange={(e) => handleChange("startDate", e.target.value)}
      />

      <Input
        label="End Date (optional)"
        type="date"
        value={form.endDate}
        onChange={(e) => handleChange("endDate", e.target.value)}
      />

      <Input
        label="Category"
        value={form.category}
        onChange={(e) => handleChange("category", e.target.value)}
        placeholder="Entertainment, Work, etc."
      />

      <Input
        label="Description"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Optional note"
      />

      <div className="flex justify-end">
        <button
          className="add-btn add-btn-fill"
          type="button"
          onClick={handleSubmit}
        >
          Add Subscription
        </button>
      </div>
    </div>
  );
};

export default AddRecurringForm;
