import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../../components/nav/AdminNavbar";
import {
  FileWarning,
  Search,
  Eye,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

import { getAllOrderReports } from "../../api/AdminStore";

const reportTypeText = {
  ORDER_NOT_DELIVERED: "ร้านยังไม่จัดส่ง",
  WRONG_ORDER: "ได้รับอาหารไม่ตรงกับที่สั่ง",
  MISSING_ITEM: "ได้รับอาหารไม่ครบ",
  OTHER: "อื่น ๆ",
};

const statusText = {
  PENDING: "รอตรวจสอบ",
  REVIEWING: "กำลังตรวจสอบ",
  RESOLVED: "ดำเนินการแล้ว",
  REJECTED: "ไม่รับเรื่อง",
};

const statusClass = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  REVIEWING: "bg-blue-50 text-blue-700 border-blue-200",
  RESOLVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const AdminOrderReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const token = localStorage.getItem("adminToken");

  const loadReports = async () => {
    try {
      setLoading(true);

      const res = await getAllOrderReports(token);

      setReports(res.data?.reports || []);
    } catch (error) {
      console.error(
        "GET ORDER REPORTS ERROR =",
        error?.response?.data || error,
      );

      Swal.fire({
        icon: "error",
        title: "โหลดข้อมูลไม่สำเร็จ",
        text:
          error?.response?.data?.message ||
          "ไม่สามารถโหลดเรื่องร้องเรียนได้",
        confirmButtonColor: "#E8491D",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return reports;
    }

    return reports.filter((report) => {
      const orderId = String(report.order?.id || "");
      const customer = report.customer?.username || "";
      const store = report.store?.storeName || "";
      const type = reportTypeText[report.type] || "";

      return (
        orderId.toLowerCase().includes(keyword) ||
        customer.toLowerCase().includes(keyword) ||
        store.toLowerCase().includes(keyword) ||
        type.toLowerCase().includes(keyword)
      );
    });
  }, [reports, searchText]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <FileWarning
                size={25}
                className="text-red-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                เรื่องร้องเรียน
              </h1>

              <p className="text-sm text-gray-500">
                ตรวจสอบรายละเอียดปัญหาจากลูกค้า
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl p-4 mb-5 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาเลขออเดอร์ ลูกค้า หรือร้าน..."
              className="w-full rounded-2xl border border-gray-200 pl-11 pr-4 py-3 outline-none focus:border-[#FF6B35]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-500">
              กำลังโหลดข้อมูล...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="py-16 text-center">
              <FileWarning
                size={45}
                className="mx-auto text-gray-300 mb-3"
              />

              <p className="text-gray-500">
                ไม่พบเรื่องร้องเรียน
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-5 py-4">
                      ออเดอร์
                    </th>

                    <th className="text-left px-5 py-4">
                      ลูกค้า
                    </th>

                    <th className="text-left px-5 py-4">
                      ร้าน
                    </th>

                    <th className="text-left px-5 py-4">
                      ปัญหา
                    </th>

                    <th className="text-left px-5 py-4">
                      วันที่แจ้ง
                    </th>

                    <th className="text-left px-5 py-4">
                      สถานะ
                    </th>

                    <th className="text-center px-5 py-4">
                      ดูรายละเอียด
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-semibold">
                        #ORD
                        {String(
                          report.order?.id || "",
                        ).padStart(4, "0")}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {report.customer?.username || "-"}
                        </div>

                        <div className="text-xs text-gray-400">
                          {report.customer?.phone || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {report.store?.storeName || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {reportTypeText[report.type] || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {formatDate(report.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                            statusClass[report.status] ||
                            "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {statusText[report.status] ||
                            report.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReport(report)
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                        >
                          <Eye size={16} />
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  เรื่องร้องเรียน #{selectedReport.id}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  ออเดอร์ #ORD
                  {String(
                    selectedReport.order?.id || "",
                  ).padStart(4, "0")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={21} />
              </button>
            </div>

            {/* Detail */}
            <div className="p-5 space-y-5">
              {/* Customer / Store */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400 mb-1">
                    ลูกค้า
                  </p>

                  <p className="font-semibold">
                    {selectedReport.customer?.username || "-"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {selectedReport.customer?.phone || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400 mb-1">
                    ร้าน
                  </p>

                  <p className="font-semibold">
                    {selectedReport.store?.storeName || "-"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {selectedReport.store?.phone || "-"}
                  </p>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-700">
                    รายละเอียดออเดอร์
                  </p>

                  <span className="text-sm text-gray-500">
                    #ORD
                    {String(
                      selectedReport.order?.id || "",
                    ).padStart(4, "0")}
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  {selectedReport.order?.menu?.length > 0 ? (
                    <div className="divide-y">
                      {selectedReport.order.menu.map((item) => (
                        <div
                          key={item.id}
                          className="p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {item.menu?.menuItem ||
                                  "ไม่พบชื่อเมนู"}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                จำนวน {item.count || 0} รายการ
                              </p>

                              {item.optionDetails?.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm font-medium text-gray-600">
                                    ตัวเลือก:
                                  </p>

                                  {item.optionDetails.map(
                                    (option, index) => (
                                      <p
                                        key={`${option.label}-${option.name}-${index}`}
                                        className="text-sm text-gray-500"
                                      >
                                        {option.label}:{" "}
                                        {option.name}

                                        {option.extraPrice > 0 && (
                                          <span className="text-orange-500 ml-1">
                                            (+
                                            {option.extraPrice.toLocaleString(
                                              "th-TH",
                                            )}{" "}
                                            บาท)
                                          </span>
                                        )}
                                      </p>
                                    ),
                                  )}
                                </div>
                              )}

                              {item.note && (
                                <p className="text-sm text-gray-500 mt-1">
                                  หมายเหตุ: {item.note}
                                </p>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <p className="font-semibold text-gray-800">
                                {(item.price || 0).toLocaleString(
                                  "th-TH",
                                )}{" "}
                                บาท
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                    </div>
                  ) : (
                    <div className="p-5 text-center text-gray-400">
                      ไม่พบรายการอาหาร
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl bg-orange-50 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ยอดออเดอร์
                  </span>

                  <span className="font-semibold">
                    {(selectedReport.order?.totalPrice || 0).toLocaleString(
                      "th-TH",
                    )}{" "}
                    บาท
                  </span>
                </div>

                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>สถานะออเดอร์</span>

                  <span>
                    {selectedReport.order?.status || "-"}
                  </span>
                </div>

                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>สถานะการชำระเงิน</span>

                  <span>
                    {selectedReport.order?.payment?.status || "-"}
                  </span>
                </div>
              </div>

              {/* Report Type */}
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-xs text-red-500 mb-1">
                  ประเภทปัญหา
                </p>

                <p className="font-semibold text-red-700">
                  {reportTypeText[selectedReport.type] || "-"}
                </p>
              </div>

              {/* Customer Detail */}
              <div>
                <p className="font-semibold text-gray-700 mb-2">
                  รายละเอียดจากลูกค้า
                </p>

                <div className="rounded-2xl bg-gray-50 p-4 min-h-[90px] text-gray-700 whitespace-pre-wrap">
                  {selectedReport.detail ||
                    "ไม่มีรายละเอียดเพิ่มเติม"}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="font-semibold text-gray-700 mb-2">
                  สถานะปัจจุบัน
                </p>

                <span
                  className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border ${
                    statusClass[selectedReport.status] ||
                    "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {statusText[selectedReport.status] ||
                    selectedReport.status}
                </span>
              </div>

              {/* Admin Note */}
              {selectedReport.adminNote && (
                <div>
                  <p className="font-semibold text-gray-700 mb-2">
                    หมายเหตุ
                  </p>

                  <div className="rounded-2xl bg-blue-50 p-4 text-gray-700 whitespace-pre-wrap">
                    {selectedReport.adminNote}
                  </div>
                </div>
              )}

              {/* Read Only */}
              <div className="pt-4 border-t">
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Admin
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    หน้านี้ใช้สำหรับตรวจสอบรายละเอียดเรื่องร้องเรียนเท่านั้น
                    ร้านค้าเป็นผู้ดำเนินการอัปเดตสถานะ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderReports;