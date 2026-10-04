import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  Store,
  Tags,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const adminData = JSON.parse(
    localStorage.getItem("admin") || "null",
  );

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "ออกจากระบบ",
      text: "คุณต้องการออกจากระบบ Admin หรือไม่?",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#f97316",
    });

    if (!result.isConfirmed) {
      return;
    }

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    setMobileOpen(false);

    navigate("/admin/login", {
      replace: true,
    });
  };

  const menuItems = [
    {
      label: "จัดการร้านอาหาร",
      path: "/admin/AdminStoreStatus",
      icon: Store,
    },
    {
      label: "จัดการสมาชิก",
      path: "/admin/AdminCustomerStatus",
      icon: Store,
    },
    {
      label: "เพิ่มประเภทร้าน",
      path: "/admin/adminstore",
      icon: Tags,
    },
    {
      label: "แจ้งปัญหาออเดอร์",
      path: "/admin/order-reports",
      icon: Tags,
    },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <button
            type="button"
            onClick={() => navigate("/admin/AdminStoreStatus")}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>

            <div className="text-left">
              <p className="font-bold text-gray-800 leading-none">
                RobMorFood
              </p>

              <p className="text-xs text-orange-500 mt-1">
                Admin
              </p>
            </div>
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-xl
                    text-sm
                    font-medium
                    transition
                    ${
                      active
                        ? "bg-orange-100 text-orange-600"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                    }
                  `}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}

            {/* ADMIN NAME */}
            <div className="h-8 w-px bg-gray-200 mx-2" />

            <div className="flex items-center gap-2 px-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-gray-700">
                  {adminData?.name || "Admin"}
                </p>

                <p className="text-[11px] text-gray-400">
                  ผู้ดูแลระบบ
                </p>
              </div>
            </div>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                text-sm
                font-medium
                text-red-500
                hover:bg-red-50
                transition
              "
            >
              <LogOut size={17} />
              ออกจากระบบ
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="
              md:hidden
              w-10
              h-10
              rounded-xl
              bg-orange-50
              text-orange-500
              flex
              items-center
              justify-center
            "
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">

            <div className="px-3 py-3 mb-2 bg-orange-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-700">
                {adminData?.name || "Admin"}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {adminData?.email || "ผู้ดูแลระบบ"}
              </p>
            </div>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                const active =
                  location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={`
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      font-medium
                      text-left
                      transition
                      ${
                        active
                          ? "bg-orange-100 text-orange-600"
                          : "text-gray-600 hover:bg-orange-50"
                      }
                    `}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  text-red-500
                  hover:bg-red-50
                  text-left
                  transition
                "
              >
                <LogOut size={18} />
                ออกจากระบบ
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;