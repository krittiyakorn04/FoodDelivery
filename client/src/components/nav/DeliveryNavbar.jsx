import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bike, Bell, LogOut, X } from "lucide-react";
import Swal from "sweetalert2";

import usefoodDelivery from "../../globalState/fooddeliveryStore";
import {
  getDeliveryNotifications,
  markDeliveryNotificationRead,
  markAllDeliveryNotificationsRead,
} from "../../api/StoreOrder";

export default function DeliveryNavbar() {
  const navigate = useNavigate();

  const token = usefoodDelivery((state) => state.token);
  const user = usefoodDelivery((state) => state.user);
  const logout = usefoodDelivery((state) => state.logout);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const loadNotifications = async () => {
    if (!token) return;

    try {
      const res = await getDeliveryNotifications(token);

      setNotifications(
        Array.isArray(res.data?.notifications)
          ? res.data.notifications
          : [],
      );
    } catch (error) {
      console.error("loadDeliveryNotifications Error =", error);
    }
  };

  const handleReadAll = async () => {
    if (unreadCount === 0) return;

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      })),
    );

    try {
      await markAllDeliveryNotificationsRead(token);
    } catch (error) {
      console.error("markAllDeliveryNotificationsRead Error =", error);

      await loadNotifications();
    }
  };

  useEffect(() => {
    if (!token) return;

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  const handleNotificationClick = async (notification) => {
    if (!notification?.id) return;

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id
          ? { ...item, isRead: true }
          : item,
      ),
    );

    setShowNotifications(false);

    if (!notification.isRead) {
      try {
        await markDeliveryNotificationRead(token, notification.id);
      } catch (error) {
        console.error(
          "markDeliveryNotificationRead Error =",
          error,
        );
      }
    }

    if (
      notification.type === "CHAT_MESSAGE" &&
      notification.deliveryId
    ) {
      navigate(
        `/store/DeliveryStaffChat/${notification.deliveryId}`,
      );
      return;
    }

    if (
      notification.type === "DELIVERY_ASSIGNED" &&
      notification.deliveryId
    ) {
      navigate(
        `/store/DeliveryRiderDetail/${notification.deliveryId}`,
      );
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "ออกจากระบบ?",
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    logout();

    navigate("/ChooseLoing", {
      replace: true,
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link
            to="/store/DeliveryJobs"
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-orange-100 p-2.5">
              <Bike className="h-6 w-6 text-orange-600" />
            </div>

            <div>
              <p className="font-bold text-gray-800">
                RobMorFood
              </p>

              <p className="text-xs text-gray-500">
                ระบบจัดส่งอาหาร
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setShowNotifications((prev) => !prev)
              }
              className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-orange-50 hover:text-orange-500"
            >
              <Bell className="h-5 w-5" />

              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-700">
                {user?.name || user?.username || "พนักงานส่ง"}
              </p>

              <p className="text-xs text-gray-400">
                พนักงานจัดส่ง
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">
                ออกจากระบบ
              </span>
            </button>
          </div>
        </div>
      </nav>

      {showNotifications && (
        <div className="fixed right-4 top-[72px] z-[60] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h3 className="font-bold text-gray-800">
                การแจ้งเตือน
              </h3>

              <p className="text-xs text-gray-400">
                แจ้งเตือนงานจัดส่งของคุณ
              </p>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleReadAll}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-orange-500 transition hover:bg-orange-50"
                >
                  อ่านทั้งหมด
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />

                <p className="text-sm text-gray-500">
                  ยังไม่มีการแจ้งเตือน
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`relative z-[70] block w-full cursor-pointer border-b border-gray-50 px-4 py-3 text-left transition hover:bg-orange-50 ${
                    !notification.isRead
                      ? "bg-orange-50/50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 shrink-0 rounded-xl bg-orange-100 p-2">
                      <Bike className="h-4 w-4 text-orange-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {notification.title}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {notification.createdAt
                          ? new Date(
                              notification.createdAt,
                            ).toLocaleString("th-TH")
                          : ""}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
