import React from "react";
import { Layers, IndianRupee, CalendarDays } from "lucide-react";

const SubscriptionOverview = ({ data }) => {
  if (!data) return null;

  const stats = [
    {
      label: "Active Payments",
      value: data.totalActive || 0,
      bg: "bg-white",
      text: "text-purple-700",
      border: "border-gray-200",
      icon: Layers,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
    },
    {
      label: "Total Amount",
      value: `₹${data.totalAmount || 0}`,
      bg: "bg-white",
      text: "text-blue-700",
      border: "border-gray-200",
      icon: IndianRupee,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      label: "Upcoming (3 days)",
      value: data.upcoming?.length || 0,
      bg: "bg-white",
      text: "text-green-700",
      border: "border-gray-200",
      icon: CalendarDays,
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`flex gap-6 bg-white p-6 rounded-2xl shadow-gray-100 border border-gray-200/50  ${stat.border} ${stat.bg} `}
        >
          {/* Icon badge top-left */}
          <div
            className={`absolute -top-4 -left-4 w-12 h-12 rounded-full ${stat.iconBg} border flex items-center justify-center shadow`}
          >
            <stat.icon size={20} className={stat.iconColor} />
          </div>

          <h3 className={`text-3xl font-bold ${stat.text}`}>{stat.value}</h3>
          <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionOverview;
