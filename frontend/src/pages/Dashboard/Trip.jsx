import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";
import AddTripForm from "../../components/Trip/AddTripForm";
import { getMyTrips, createTrip } from "../../services/tripService"; // ✅ use service layer
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, PlusCircle } from "lucide-react";

const Trip = () => {
  const [trips, setTrips] = useState([]);
  const [openAddTripModal, setOpenAddTripModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch trips
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await getMyTrips(); // ✅ already returns []
      setTrips(Array.isArray(data) ? data : []); // safeguard
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      toast.error("Failed to fetch trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new trip
  const handleAddTrip = async (trip) => {
    try {
      await createTrip(trip);
      toast.success("Trip added successfully");
      setOpenAddTripModal(false);
      fetchTrips();
    } catch (err) {
      console.error("Failed to add trip:", err);
      toast.error("Failed to add trip");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const formatDates = (start, end) => {
    const s = new Date(start).toLocaleDateString();
    const e = new Date(end).toLocaleDateString();
    return s === e ? s : `${s} – ${e}`;
  };

  return (
    <DashboardLayout activeMenu="Trips">
      <div className="my-8 mx-auto max-w-6xl">
        <div className="bg-white rounded-2xl shadow p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Trip Overview
              </h2>
              <p className="text-sm text-gray-500">
                Manage and track your travel plans easily.
              </p>
            </div>
            <button
              className="add-btn flex items-center gap-1"
              onClick={() => setOpenAddTripModal(true)}
            >
              <PlusCircle size={18} />
              Add Trip
            </button>
          </div>

          {/* Loading state */}
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading trips...</p>
          ) : trips.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-base font-medium">No trips yet</p>
              <p className="text-sm mb-4">
                Click on <span className="font-semibold">"Add Trip"</span> to
                start planning.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <Link
                  key={trip._id}
                  to={`/dashboard/trips/${trip._id}`}
                  className="group rounded-xl p-5 transition border border-gray-200 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-primary">
                    {trip.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mt-2 text-sm">
                    <MapPin size={14} className="text-primary" />
                    <p>{trip.destination}</p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                    <CalendarDays size={14} className="text-primary" />
                    <p>{formatDates(trip.startDate, trip.endDate)}</p>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    {trip.visibility === "group" ? "🌍 Group" : "🔒 Private"} •{" "}
                    {trip.participants?.length || 0} people
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Modal for Add Trip */}
        <Modal
          isOpen={openAddTripModal}
          onClose={() => setOpenAddTripModal(false)}
          title="Add Trip"
        >
          <AddTripForm onAddTrip={handleAddTrip} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Trip;
