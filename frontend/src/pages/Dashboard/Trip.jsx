import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";
import AddTripForm from "../../components/Trip/AddTripForm";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, PlusCircle } from "lucide-react";

const Trip = () => {
  const [trips, setTrips] = useState([]);
  const [openAddTripModal, setOpenAddTripModal] = useState(false);

  const fetchTrips = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TRIP.GET_ALL_TRIPS);
      setTrips(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch trips");
    }
  };

  const handleAddTrip = async (trip) => {
    try {
      await axiosInstance.post(API_PATHS.TRIP.ADD_TRIP, trip);
      toast.success("Trip added successfully");
      setOpenAddTripModal(false);
      fetchTrips();
    } catch (err) {
      toast.error("Failed to add trip");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <DashboardLayout activeMenu="Trips">
      <div className="my-8 mx-auto max-w-6xl">
        {/* Card Container */}
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
              className="add-btn"
              onClick={() => setOpenAddTripModal(true)}
            >
              <PlusCircle size={18} />
              Add Trip
            </button>
          </div>

          {/* Trips List */}
          {trips.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-base font-medium">No trips yet</p>
              <p className="text-sm">
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
                  className="group  rounded-xl  p-5 transition border border-gray-200"
                >
                  <h3 className="text-base font-semibold text-gray-800  transition">
                    {trip.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mt-2 text-sm">
                    <MapPin size={14} className="text-primary" />
                    <p>{trip.destination}</p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                    <CalendarDays size={14} className="text-primary" />
                    <p>
                      {new Date(trip.startDate).toLocaleDateString()} –{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
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
