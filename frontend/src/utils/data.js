import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
} from "react-icons/lu";
import { FaCalculator, FaSuitcaseRolling } from "react-icons/fa";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "08",
    label: "Trips",
    icon: FaSuitcaseRolling,
    path: "/dashboard/trips",
  },
  {
    id: "05",
    label: "Calculator",
    icon: FaCalculator,
    path: '/calculator',
    isCalculator: true, 
  }
  ,
  {
    id: "06",
    label: "Logout",
    icon: LuLogOut,
    path: null,
    isLogout: true, 
  },

];
