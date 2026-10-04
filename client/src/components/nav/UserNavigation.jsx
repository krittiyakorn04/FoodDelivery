import { NavLink } from "react-router-dom";
import { House, ClipboardList, Bike, User, Store } from "lucide-react";

const UserNavigation = () => {
  const navClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 px-4 py-2 transition ${
      isActive ? "text-orange-500" : "text-gray-500 hover:text-orange-500"
    }`;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-around">

        <NavLink to="HomeUser" end className={navClass}>
          <House className="h-6 w-6" />
          <span className="text-xs font-medium">หน้าหลัก</span>
        </NavLink>

        <NavLink to="userDelivery" className={navClass}>
          <ClipboardList className="h-6 w-6" />
          <span className="text-xs font-medium">ออเดอร์</span>
        </NavLink>


        <NavLink to="userProfile" className={navClass}>
          <User className="h-6 w-6" />
          <span className="text-xs font-medium">ฉัน</span>
        </NavLink>
      </div>
    </nav>
  );
};
export default UserNavigation;
