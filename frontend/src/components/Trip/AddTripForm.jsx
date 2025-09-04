import React, { useState } from "react";
import toast from "react-hot-toast";

/**
 * AddTripForm Component
 *
 * Props:
 * - onAddTrip(tripPayload)
 *
 * The payload matches backend controller:
 * {
 *  name, destination, startDate, endDate, description,
 *  plannedBudget, visibility: "group" | "private",
 *  emails: [ "a@example.com", ... ]
 * }
 */
export default function AddTripForm({ onAddTrip }) {
  const [form, setForm] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    plannedBudget: "",
    visibility: "group", // "group" | "private"
    emailsCsv: "", // UI-only
  });

  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.destination.trim()) return "Destination is required";
    if (!form.startDate) return "Start date is required";
    if (!form.endDate) return "End date is required";
    if (new Date(form.endDate) < new Date(form.startDate))
      return "End date cannot be before start date";
    if (form.plannedBudget !== "" && Number(form.plannedBudget) < 0)
      return "Planned budget must be 0 or more";
    if (!["group", "private"].includes(form.visibility))
      return "Visibility must be group or private";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSubmitting(true);
    try {
      const emails = form.emailsCsv
        .split(/[,\s]+/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        name: form.name.trim(),
        destination: form.destination.trim(),
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        description: form.description.trim(),
        plannedBudget:
          form.plannedBudget === "" ? 0 : Number(form.plannedBudget),
        visibility: form.visibility,
        emails, // ✅ array of emails instead of userIds
      };

      await onAddTrip(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Trip Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Goa Getaway"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Destination *
          </label>
          <input
            name="destination"
            value={form.destination}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Goa, India"
            required
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            End Date *
          </label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Friends trip, beach, cafés, nightlife..."
          rows={3}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Planned Budget
          </label>
          <input
            name="plannedBudget"
            value={form.plannedBudget}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="50000"
            inputMode="numeric"
          />
          <p className="text-xs text-gray-400 mt-1">
            Currency defaults to INR.
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Visibility *
          </label>
          <select
            name="visibility"
            value={form.visibility}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="group">Group 🌍</option>
            <option value="private">Private 🔒</option>
          </select>
        </div>
      </div>

      {/* Participants */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Participants (comma-separated emails)
        </label>
        <input
          name="emailsCsv"
          value={form.emailsCsv}
          onChange={onChange}
          className="w-full border rounded-md px-3 py-2"
          placeholder="alice@mail.com, bob@mail.com"
        />
        <p className="text-xs text-gray-400 mt-1">
          Only the creator can add participants (backend enforced).
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          className="add-btn add-btn-fill disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Create Trip"}
        </button>
      </div>
    </form>
  );
}
