import React from "react";
import moment from "moment";

const TripList = ({ trips }) => {
  if (!trips?.length) {
    return <p className="text-gray-500 mt-4">No trips found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {trips.map((trip) => (
        <div key={trip._id} className="card p-4 shadow-sm">
          <h4 className="text-lg font-semibold">{trip.name}</h4>
          <p className="text-sm text-gray-600">{trip.destination}</p>
          <p className="text-xs text-gray-400 mt-1">
            {moment(trip.startDate).format("DD MMM YYYY")} -{" "}
            {moment(trip.endDate).format("DD MMM YYYY")}
          </p>
          {trip.description && (
            <p className="text-sm text-gray-500 mt-2">{trip.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TripList;
