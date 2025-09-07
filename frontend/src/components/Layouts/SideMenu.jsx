import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import CharAvatar from "../Cards/CharAvatar";
import {
  Home,
  DollarSign,
  CreditCard,
  BarChart3,
  Layers,
  PiggyBank,
  Wallet,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  IndianRupee,
  Briefcase,
  Calculator,
} from "lucide-react";

const SideMenu = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const menuSections = [
    {
      title: "GENERAL",
      items: [
        { label: "Dashboard", icon: Home, path: "/dashboard" },
        { label: "Income", icon: IndianRupee, path: "/income" },
        { label: "Expense", icon: CreditCard, path: "/expense" },
        { label: "Trips", icon: Briefcase, path: "/dashboard/trips" },
        { label: "Calculator", icon: Calculator, path: "/calculator" },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { label: "Capital", icon: PiggyBank, path: "/" },
        { label: "Vaults", icon: Wallet, path: "/" },
        { label: "Reports", icon: FileText, path: "/" },
        { label: "Earnings", icon: CreditCard, path: "/", extra: "RS 120" },
      ],
    },
    {
      title: "",
      items: [
        { label: "Settings", icon: Settings, path: "/" },
        { label: "Help", icon: HelpCircle, path: "/" },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-60 h-[calc(100vh-61px)] scroll-smooth bg-white border-r border-gray-200/50 flex flex-col justify-between sticky top-[61px] z-20">
      {/* Menu */}
      <div className="p-4 overflow-y-auto">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {section.title && (
              <p className="text-xs font-semibold text-gray-400 px-3 mb-2">
                {section.title}
              </p>
            )}
            {section.items.map((item, index) => (
              <button
                key={`menu_${idx}_${index}`}
                className={`relative w-full flex items-center cursor-pointer justify-between text-sm px-3 py-2 rounded-lg mb-1 
                  transition-all duration-200 ease-in-out
                  ${
                    isActive(item.path)
                      ? "bg-gray-200 text-black font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                onClick={() => navigate(item.path)}
              >
                {/* Active indicator line INSIDE the button */}
                {isActive(item.path) && (
                  <span className="absolute right-1 top-1 bottom-1 w-1 bg-black rounded-full transition-all duration-300 ease-in-out"></span>
                )}

                <div className="flex items-center gap-3">
                  <item.icon
                    size={18}
                    className={`transition-colors duration-200 ${
                      isActive(item.path) ? "text-black" : "text-gray-500"
                    }`}
                  />
                  {item.label}
                </div>

                {item.extra && (
                  <span className="text-emerald-500 text-xs font-semibold">
                    {item.extra}
                  </span>
                )}
              </button>

            ))}
          </div>
        ))}
      </div>

      <div>
        <div className="pl-4 pr-4">
          <button
            className="w-full flex items-center cursor-pointer gap-3 text-sm px-3 py-2 rounded-lg mb-4 transition text-gray-600 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut size={18} className="text-gray-500" />
            Log Out
          </button>
        </div>
        {/* Bottom Section (Logout + Account) */}
      <div className="p-4 border-t border-gray-200/50">
        {/* Logout Button */}

        {/* Account Card */}
        <div className="w-full  flex items-center gap-3 text-sm px-2 py-1 rounded-lg mb transition text-gray-600 hover:bg-gray-100 ">
          <div className="flex cursor-pointer items-center gap-2">
            {user && user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
              <CharAvatar
                fullName={user?.fullName}
                width="w-8"
                height="h-8"
                fontSize="text-xs"
              />
            )}
            <div className="flex flex-col leading-tight">
              <p className="text-xs font-medium text-gray-900 truncate max-w-[120px]">
                {user?.fullName}
              </p>
              <p className="text-[11px] text-gray-500 truncate max-w-[120px]">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Dropdown Arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SideMenu;
