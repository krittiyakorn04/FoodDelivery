import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
Search,
Users,
UserCheck,
UserX,
ShieldCheck,
ShieldBan,
RefreshCw,
} from "lucide-react";

import AdminNavbar from "../../components/nav/AdminNavbar";

import {
getAllCustomer,
changeCustomerStatus,
} from "../../api/AdminStore";

const AdminCustomerStatus = () => {
const [customers, setCustomers] = useState([]);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");
const [loading, setLoading] = useState(true);
const [changingId, setChangingId] = useState(null);

const adminToken = localStorage.getItem("adminToken");

// ===============================
// ดึงสมาชิกทั้งหมด
// ===============================
const getCustomers = async () => {
try {
setLoading(true);

  const token = localStorage.getItem("adminToken");

  if (!token) {
    await Swal.fire({
      icon: "warning",
      title: "กรุณาเข้าสู่ระบบ",
      text: "ไม่พบ Admin Token",
      confirmButtonText: "เข้าสู่ระบบ",
      confirmButtonColor: "#FF6B35",
    });

    window.location.href = "/admin/login";
    return;
  }

  const res = await getAllCustomer(token);

  setCustomers(res.data.customers || []);
} catch (error) {
  console.error("Get Customers Error =", error);

  if (error.response?.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    await Swal.fire({
      icon: "warning",
      title: "Session หมดอายุ",
      text: "กรุณาเข้าสู่ระบบ Admin ใหม่",
      confirmButtonText: "เข้าสู่ระบบ",
      confirmButtonColor: "#FF6B35",
    });

    window.location.href = "/admin/login";
    return;
  }

  if (error.response?.status === 403) {
    await Swal.fire({
      icon: "error",
      title: "ไม่มีสิทธิ์เข้าถึง",
      text:
        error.response?.data?.message ||
        "บัญชีนี้ไม่มีสิทธิ์เข้าถึงข้อมูลสมาชิก",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#FF6B35",
    });

    return;
  }

  await Swal.fire({
    icon: "error",
    title: "ไม่สามารถโหลดข้อมูลสมาชิก",
    text:
      error.response?.data?.message ||
      "เกิดข้อผิดพลาดในการโหลดข้อมูล",
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#FF6B35",
  });
} finally {
  setLoading(false);
}

};

useEffect(() => {
getCustomers();
}, []);

// ===============================
// เปลี่ยนสถานะสมาชิก
// ===============================
const handleChangeStatus = async (customer) => {
const isBanned = customer.status === "BANNED";
const newStatus = isBanned ? "ACTIVE" : "BANNED";

const result = await Swal.fire({
  icon: isBanned ? "question" : "warning",
  title: isBanned
    ? "เปิดใช้งานสมาชิก?"
    : "ระงับสมาชิก?",
  html: `
    <div style="font-size: 16px;">
      สมาชิก <strong>${customer.username}</strong>
      <br />
      สถานะจะเปลี่ยนเป็น
      <strong>
        ${isBanned ? "ACTIVE" : "BANNED"}
      </strong>
    </div>
  `,
  showCancelButton: true,
  confirmButtonText: isBanned
    ? "เปิดใช้งาน"
    : "ระงับสมาชิก",
  cancelButtonText: "ยกเลิก",
  reverseButtons: true,

  confirmButtonColor: isBanned
    ? "#16a34a"
    : "#dc2626",
  cancelButtonColor: "#9ca3af",
});

if (!result.isConfirmed) {
  return;
}

try {
  setChangingId(customer.id);

  const token = localStorage.getItem("adminToken");

  if (!token) {
    await Swal.fire({
      icon: "warning",
      title: "กรุณาเข้าสู่ระบบ",
      text: "ไม่พบ Admin Token",
      confirmButtonText: "เข้าสู่ระบบ",
      confirmButtonColor: "#FF6B35",
    });

    window.location.href = "/admin/login";
    return;
  }

  const res = await changeCustomerStatus(
    token,
    customer.id,
    newStatus
  );

  setCustomers((prev) =>
    prev.map((item) =>
      item.id === customer.id
        ? {
            ...item,
            status: res.data.customer.status,
          }
        : item
    )
  );

  await Swal.fire({
    icon: "success",
    title: "สำเร็จ",
    text:
      res.data.message ||
      "เปลี่ยนสถานะสมาชิกสำเร็จ",
    timer: 1500,
    showConfirmButton: false,
  });
} catch (error) {
  console.error(
    "Change Customer Status Error =",
    error
  );

  if (error.response?.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    await Swal.fire({
      icon: "warning",
      title: "Session หมดอายุ",
      text: "กรุณาเข้าสู่ระบบ Admin ใหม่",
      confirmButtonText: "เข้าสู่ระบบ",
      confirmButtonColor: "#FF6B35",
    });

    window.location.href = "/admin/login";
    return;
  }

  await Swal.fire({
    icon: "error",
    title: "ไม่สามารถเปลี่ยนสถานะได้",
    text:
      error.response?.data?.message ||
      "เกิดข้อผิดพลาด",
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#FF6B35",
  });
} finally {
  setChangingId(null);
}

};

// ===============================
// Filter
// ===============================
const filteredCustomers = useMemo(() => {
const keyword = search.trim().toLowerCase();

return customers.filter((customer) => {
  const matchSearch =
    !keyword ||
    customer.username
      ?.toLowerCase()
      .includes(keyword) ||
    customer.email
      ?.toLowerCase()
      .includes(keyword) ||
    customer.phone
      ?.toLowerCase()
      .includes(keyword);

  const matchStatus =
    statusFilter === "ALL" ||
    customer.status === statusFilter;

  return matchSearch && matchStatus;
});

}, [customers, search, statusFilter]);

// ===============================
// จำนวนสมาชิก
// ===============================
const activeCount = customers.filter(
(customer) => customer.status === "ACTIVE"
).length;

const bannedCount = customers.filter(
(customer) => customer.status === "BANNED"
).length;

// ===============================
// วันที่
// ===============================
const formatDate = (date) => {
if (!date) return "-";

return new Date(date).toLocaleDateString(
  "th-TH",
  {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
);

};

return ( <div className="min-h-screen bg-[#FFF8F0]"> <AdminNavbar />

  <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="mb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B35] text-white shadow-md">
              <Users size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                จัดการสมาชิก
              </h1>

              <p className="text-sm text-gray-500">
                จัดการข้อมูลและสถานะสมาชิกของระบบ
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={getCustomers}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-700 shadow-sm transition hover:border-[#FF6B35] hover:text-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={
              loading ? "animate-spin" : ""
            }
          />

          รีเฟรช
        </button>

      </div>
    </div>

    {/* Summary */}
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

      {/* Total */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              สมาชิกทั้งหมด
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-800">
              {customers.length}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-[#FF6B35]">
            <Users size={22} />
          </div>

        </div>
      </div>

      {/* Active */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              สมาชิกที่ใช้งาน
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              {activeCount}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <UserCheck size={22} />
          </div>

        </div>
      </div>

      {/* Banned */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              สมาชิกที่ถูกระงับ
            </p>

            <p className="mt-1 text-2xl font-bold text-red-600">
              {bannedCount}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <UserX size={22} />
          </div>

        </div>
      </div>

    </div>

    {/* Search / Filter */}
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

      <div className="flex flex-col gap-3 md:flex-row">

        <div className="relative flex-1">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="ค้นหาชื่อผู้ใช้ อีเมล หรือเบอร์โทร..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-[#FF6B35] focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#FF6B35] focus:bg-white focus:ring-2 focus:ring-orange-100"
        >
          <option value="ALL">
            สมาชิกทั้งหมด
          </option>

          <option value="ACTIVE">
            ใช้งานอยู่
          </option>

          <option value="BANNED">
            ถูกระงับ
          </option>
        </select>

      </div>
    </div>

    {/* Table */}
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[900px]">

          <thead className="bg-[#FFF3E8]">
            <tr>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                สมาชิก
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                อีเมล
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                เบอร์โทร
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                วันที่สมัคร
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                สถานะ
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                จัดการ
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3 text-gray-500">

                    <RefreshCw
                      size={28}
                      className="animate-spin text-[#FF6B35]"
                    />

                    <span>
                      กำลังโหลดข้อมูลสมาชิก...
                    </span>

                  </div>
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3 text-gray-400">

                    <Users size={42} />

                    <p>
                      ไม่พบข้อมูลสมาชิก
                    </p>

                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => {

                const isBanned =
                  customer.status === "BANNED";

                const isChanging =
                  changingId === customer.id;

                return (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-[#FFF9F4]"
                  >

                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-[#FF6B35]">
                          {customer.username
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {customer.username}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {customer.id}
                          </p>

                        </div>

                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {customer.email}
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {customer.phone}
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(customer.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">

                      {isBanned ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">

                          <ShieldBan size={14} />

                          BANNED

                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">

                          <ShieldCheck size={14} />

                          ACTIVE

                        </span>
                      )}

                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-center">

                      <button
                        onClick={() =>
                          handleChangeStatus(customer)
                        }
                        disabled={isChanging}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          isBanned
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >

                        {isChanging ? (
                          <>
                            <RefreshCw
                              size={16}
                              className="animate-spin"
                            />

                            กำลังดำเนินการ
                          </>
                        ) : isBanned ? (
                          <>
                            <UserCheck size={16} />

                            เปิดใช้งาน
                          </>
                        ) : (
                          <>
                            <UserX size={16} />

                            ระงับสมาชิก
                          </>
                        )}

                      </button>

                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>

      </div>

      {!loading &&
        filteredCustomers.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-sm text-gray-500">
            แสดง {filteredCustomers.length} จาก{" "}
            {customers.length} สมาชิก
          </div>
        )}

    </div>

  </main>
</div>

);
};

export default AdminCustomerStatus;
