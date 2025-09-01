import React, { useState } from "react";
import Input from "../Inputs/Input";

const AddTripForm = ({ onAddTrip }) => {
  const [trip, setTrip] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (key, value) => {
    setTrip((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <Input
        label="Trip Name"
        value={trip.name}
        onChange={({ target }) => handleChange("name", target.value)}
        placeholder="Enter trip name"
        type="text"
      />
      <Input
        label="Destination"
        value={trip.destination}
        onChange={({ target }) => handleChange("destination", target.value)}
        placeholder="Enter destination"
        type="text"
      />
      <Input
        label="Start Date"
        value={trip.startDate}
        onChange={({ target }) => handleChange("startDate", target.value)}
        type="date"
      />
      <Input
        label="End Date"
        value={trip.endDate}
        onChange={({ target }) => handleChange("endDate", target.value)}
        type="date"
      />
      <Input
        label="Description (optional)"
        value={trip.description}
        onChange={({ target }) => handleChange("description", target.value)}
        placeholder="Enter description"
        type="text"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddTrip(trip)}
        >
          Add Trip
        </button>
      </div>
    </div>
  );
};

export default AddTripForm;
