import { useEffect, useState } from "react";
import { getMyTrips } from "../../services/tripService";
import { Card, CardContent } from "@/components/ui/card";

export default function TripList({ onSelect }) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const trips = await getMyTrips(); // ✅ already an array
      setTrips(trips);
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  return (
    <div className="grid gap-4">
      {trips.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No trips found.</p>
      ) : (
        trips.map((t) => (
          <Card
            key={t._id}
            className="p-4 hover:shadow cursor-pointer"
            onClick={() => onSelect(t)}
          >
            <CardContent>
              <h2 className="font-semibold">{t.name}</h2>
              <p className="text-sm text-gray-600">{t.destination}</p>
              <p className="text-xs text-gray-400">
                {new Date(t.startDate).toLocaleDateString()} →{" "}
                {new Date(t.endDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
