import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Home, Navigation, Check, Star, Map } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import usefoodDelivery from "../../globalState/fooddeliveryStore";

import {
  createAddress,
  getAddress,
  updateAddress,
  removeAddress,
} from "../../api/UserProfile";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationMarker = ({ setForm }) => {
  useMapEvents({
    click(e) {
      const lat = Number(e.latlng.lat.toFixed(6));
      const lng = Number(e.latlng.lng.toFixed(6));

      setForm((prev) => ({
        ...prev,
        lat,
        lng,
      }));
    },
  });

  return null;
};

const DraggableMarker = ({ form, setForm }) => {
  const position = [Number(form.lat), Number(form.lng)];

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();

          const lat = Number(position.lat.toFixed(6));

          const lng = Number(position.lng.toFixed(6));

          setForm((prev) => ({
            ...prev,
            lat,
            lng,
          }));
        },
      }}
    />
  );
};

const FormAddAddress = () => {
  const navigate = useNavigate();

  const token = usefoodDelivery((state) => state.token);

  const [form, setForm] = useState({
    label: "",
    address: "",
    lat: "",
    lng: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(true);

  const [editingId, setEditingId] = useState(null);

  // ==========================================
  // LOAD ADDRESS
  // ==========================================

  useEffect(() => {
    if (token) {
      loadAddresses();
    }
  }, [token]);

  const loadAddresses = async () => {
    try {
      setLoadingAddress(true);

      const res = await getAddress(token);

      console.log("ที่อยู่ =", res.data);

      setAddresses(res.data);
    } catch (error) {
      console.log("โหลดที่อยู่ไม่สำเร็จ =", error);
    } finally {
      setLoadingAddress(false);
    }
  };

  // ==========================================
  // GET CURRENT GPS LOCATION
  // ==========================================

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("เบราว์เซอร์นี้ไม่รองรับ GPS");
      return;
    }

    toast.info("กำลังค้นหาตำแหน่งของคุณ...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("GPS Latitude =", latitude);
        console.log("GPS Longitude =", longitude);

        setForm((prev) => ({
          ...prev,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        }));

        toast.success("ดึงตำแหน่ง GPS สำเร็จ");
      },
      (error) => {
        console.log("GPS error =", error);

        if (error.code === 1) {
          toast.error("กรุณาอนุญาตการเข้าถึงตำแหน่งของคุณ");
        } else if (error.code === 2) {
          toast.error("ไม่สามารถระบุตำแหน่งของคุณได้");
        } else if (error.code === 3) {
          toast.error("ค้นหาตำแหน่งหมดเวลา กรุณาลองใหม่");
        } else {
          toast.error("ไม่สามารถดึงตำแหน่ง GPS ได้");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // ==========================================
  // DELETE ADDRESS
  // ==========================================

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "ลบที่อยู่?",
      text: `คุณต้องการลบ "${item.label}" ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await removeAddress(token, item.id);

      toast.success("ลบที่อยู่สำเร็จ");

      if (editingId === item.id) {
        handleCancelEdit();
      }

      await loadAddresses();
    } catch (error) {
      console.log("ลบที่อยู่ไม่สำเร็จ =", error);

      console.log("status =", error.response?.status);

      console.log("data =", error.response?.data);

      toast.error(error.response?.data?.message || "ลบที่อยู่ไม่สำเร็จ");
    }
  };

  // ==========================================
  // CHANGE FORM
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // EDIT ADDRESS
  // ==========================================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      label: item.label || "",
      address: item.address || "",
      lat: item.lat ?? "",
      lng: item.lng ?? "",
      isDefault: item.isDefault || false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.label.trim()) {
      toast.error("กรุณาระบุชื่อที่อยู่");
      return;
    }

    if (!form.address.trim()) {
      toast.error("กรุณากรอกที่อยู่");
      return;
    }

    try {
      setLoading(true);

      const data = {
        label: form.label.trim(),
        address: form.address.trim(),

        lat: form.lat === "" ? null : Number(form.lat),

        lng: form.lng === "" ? null : Number(form.lng),

        isDefault: form.isDefault,
      };

      console.log("ข้อมูลที่จะส่ง =", data);

      if (editingId) {
        // =========================
        // UPDATE
        // =========================

        const res = await updateAddress(token, editingId, data);

        console.log("แก้ไขสำเร็จ =", res.data);

        toast.success("แก้ไขที่อยู่สำเร็จ");
      } else {
        // =========================
        // CREATE
        // =========================

        const res = await createAddress(token, data);

        console.log("สร้างที่อยู่สำเร็จ =", res.data);

        toast.success("เพิ่มที่อยู่สำเร็จ");
      }

      // ==================================
      // RESET FORM
      // ==================================

      setForm({
        label: "",
        address: "",
        lat: "",
        lng: "",
        isDefault: false,
      });

      setEditingId(null);

      await loadAddresses();
    } catch (error) {
      console.log("บันทึกที่อยู่ไม่สำเร็จ =", error);

      console.log("status =", error.response?.status);

      console.log("data =", error.response?.data);

      toast.error(error.response?.data?.message || "บันทึกที่อยู่ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setForm({
      label: "",
      address: "",
      lat: "",
      lng: "",
      isDefault: false,
    });
  };

  // ==========================================
  // MAP URL
  // ==========================================

  const hasLocation =
    form.lat !== "" &&
    form.lng !== "" &&
    !Number.isNaN(Number(form.lat)) &&
    !Number.isNaN(Number(form.lng));

  const mapUrl = hasLocation
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        Number(form.lng) - 0.005
      },${Number(form.lat) - 0.005},${Number(form.lng) + 0.005},${
        Number(form.lat) + 0.005
      }&layer=mapnik&marker=${Number(form.lat)},${Number(form.lng)}`
    : null;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#FFF8F0] px-4 py-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-500 mb-4"
          >
            ← กลับ
          </button>

          <div className="flex items-center gap-3">
            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-orange-100
                flex
                items-center
                justify-center
              "
            >
              <MapPin size={25} className="text-orange-500" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#2A1B12]">
                {editingId ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่"}
              </h1>

              <p className="text-sm text-gray-500">
                เพิ่มที่อยู่สำหรับจัดส่งอาหาร
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <form onSubmit={handleSubmit}>
          <div
            className="
              bg-white
              rounded-3xl
              border
              border-orange-100
              shadow-sm
              p-5
              space-y-6
            "
          >
            {/* =========================
                LABEL
            ========================= */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                ชื่อที่อยู่
              </label>

              <p className="text-xs text-gray-400 mb-3">
                ตั้งชื่อเพื่อให้เลือกที่อยู่ได้ง่าย
              </p>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {["บ้าน", "หอพัก", "ที่ทำงาน"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        label: item,
                      }))
                    }
                    className={`
                      py-2.5
                      rounded-xl
                      border
                      text-sm
                      font-medium
                      transition

                      ${
                        form.label === item
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <input
                type="text"
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="เช่น หอพัก A"
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  bg-gray-50
                  focus:bg-white
                  focus:ring-2
                  focus:ring-orange-300
                "
              />
            </div>

            {/* =========================
                ADDRESS
            ========================= */}

            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                <Home size={17} className="text-orange-500" />
                รายละเอียดที่อยู่
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="เช่น หอพัก A ห้อง 205 ถนนขามเรียง ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม"
                rows={5}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  resize-none
                  bg-gray-50
                  focus:bg-white
                  focus:ring-2
                  focus:ring-orange-300
                "
              />
            </div>

            {/* =========================
                LOCATION
            ========================= */}

            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                <Navigation size={17} className="text-orange-500" />
                ตำแหน่ง GPS
              </label>

              <p className="text-xs text-gray-400 mb-3">
                กดปุ่มเพื่อใช้ตำแหน่งปัจจุบัน หรือกรอกพิกัดเอง
              </p>

              {/* =========================
                  GPS BUTTON
              ========================= */}

              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  rounded-xl
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  font-semibold
                  transition
                  mb-3
                "
              >
                <Navigation size={18} />
                ใช้ตำแหน่งปัจจุบัน
              </button>

              {/* =========================
                  LAT LNG
              ========================= */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Latitude</label>

                  <input
                    type="number"
                    step="any"
                    name="lat"
                    value={form.lat}
                    onChange={handleChange}
                    placeholder="เช่น 16.245"
                    className="
                      mt-1
                      w-full
                      border
                      border-gray-200
                      rounded-xl
                      px-3
                      py-3
                      bg-gray-50
                      outline-none
                      focus:ring-2
                      focus:ring-orange-300
                    "
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">Longitude</label>

                  <input
                    type="number"
                    step="any"
                    name="lng"
                    value={form.lng}
                    onChange={handleChange}
                    placeholder="เช่น 103.25"
                    className="
                      mt-1
                      w-full
                      border
                      border-gray-200
                      rounded-xl
                      px-3
                      py-3
                      bg-gray-50
                      outline-none
                      focus:ring-2
                      focus:ring-orange-300
                    "
                  />
                </div>
              </div>

              {/* =========================
                  MAP
              ========================= */}

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Map size={17} className="text-orange-500" />

                  <p className="font-semibold text-gray-700">
                    แผนที่ตำแหน่งจัดส่ง
                  </p>
                </div>

                {hasLocation ? (
                  <div className="overflow-hidden rounded-2xl border border-orange-100 shadow-sm">
                    <MapContainer
                      center={[Number(form.lat), Number(form.lng)]}
                      zoom={16}
                      scrollWheelZoom={true}
                      className="h-[300px] w-full"
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <LocationMarker setForm={setForm} />

                      <DraggableMarker form={form} setForm={setForm} />
                    </MapContainer>
                  </div>
                ) : (
                  <div
                    className="
      h-[250px]
      rounded-2xl
      border
      border-dashed
      border-gray-300
      bg-gray-50
      flex
      flex-col
      items-center
      justify-center
      text-center
      px-5
    "
                  >
                    <MapPin size={40} className="text-gray-300 mb-3" />

                    <p className="font-semibold text-gray-500">
                      ยังไม่มีตำแหน่ง
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      กด "ใช้ตำแหน่งปัจจุบัน" เพื่อแสดงตำแหน่งบนแผนที่
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* =========================
                DEFAULT
            ========================= */}

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  isDefault: !prev.isDefault,
                }))
              }
              className={`
                w-full
                flex
                items-center
                justify-between
                p-4
                rounded-2xl
                border
                transition

                ${
                  form.isDefault
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 bg-gray-50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-10
                    h-10
                    rounded-xl
                    flex
                    items-center
                    justify-center

                    ${
                      form.isDefault
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-400"
                    }
                  `}
                >
                  <Check size={20} />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-gray-700">
                    ตั้งเป็นที่อยู่เริ่มต้น
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    ใช้ที่อยู่นี้เป็นค่าเริ่มต้นในการสั่งอาหาร
                  </p>
                </div>
              </div>

              <div
                className={`
                  w-11
                  h-6
                  rounded-full
                  p-1
                  transition

                  ${form.isDefault ? "bg-orange-500" : "bg-gray-300"}
                `}
              >
                <div
                  className={`
                    w-4
                    h-4
                    bg-white
                    rounded-full
                    transition

                    ${form.isDefault ? "translate-x-5" : "translate-x-0"}
                  `}
                />
              </div>
            </button>

            {/* =========================
                SUBMIT
            ========================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-orange-500
                hover:bg-orange-600
                disabled:bg-gray-300
                text-white
                py-3.5
                rounded-xl
                font-bold
                transition
              "
            >
              {loading
                ? "กำลังบันทึก..."
                : editingId
                  ? "บันทึกการแก้ไข"
                  : "บันทึกที่อยู่"}
            </button>

            {/* =========================
                CANCEL EDIT
            ========================= */}

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="
                  w-full
                  border
                  border-gray-200
                  text-gray-600
                  py-3
                  rounded-xl
                  font-semibold
                  hover:bg-gray-50
                "
              >
                ยกเลิกการแก้ไข
              </button>
            )}
          </div>
        </form>

        {/* =========================
            SAVED ADDRESSES
        ========================= */}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-[#2A1B12]">
                ที่อยู่ของฉัน
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                ที่อยู่ที่บันทึกไว้สำหรับจัดส่งอาหาร
              </p>
            </div>

            <span className="text-sm text-gray-400">
              {addresses.length} รายการ
            </span>
          </div>

          {loadingAddress ? (
            <div className="bg-white rounded-3xl border border-orange-100 p-5 text-center">
              <p className="text-gray-400">กำลังโหลดที่อยู่...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="bg-white rounded-3xl border border-orange-100 p-6 text-center">
              <MapPin size={35} className="mx-auto text-gray-300 mb-3" />

              <p className="font-semibold text-gray-500">
                ยังไม่มีที่อยู่ที่บันทึกไว้
              </p>

              <p className="text-sm text-gray-400 mt-1">
                เพิ่มที่อยู่ด้านบนเพื่อใช้สำหรับจัดส่งอาหาร
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((item) => (
                <div
                  key={item.id}
                  className={`
                    bg-white
                    rounded-2xl
                    border
                    p-4
                    shadow-sm

                    ${
                      item.isDefault
                        ? "border-orange-400 bg-orange-50/30"
                        : "border-orange-100"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* ICON */}

                    <div
                      className={`
                        w-11
                        h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shrink-0

                        ${
                          item.isDefault
                            ? "bg-orange-500 text-white"
                            : "bg-orange-100 text-orange-500"
                        }
                      `}
                    >
                      {item.isDefault ? (
                        <Star size={20} fill="currentColor" />
                      ) : (
                        <MapPin size={20} />
                      )}
                    </div>

                    {/* ADDRESS */}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[#2A1B12]">
                          {item.label}
                        </h3>

                        {item.isDefault && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                            ที่อยู่เริ่มต้น
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {item.address}
                      </p>

                      {/* GPS */}

                      {item.lat !== null &&
                        item.lat !== undefined &&
                        item.lng !== null &&
                        item.lng !== undefined && (
                          <div className="mt-3">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Navigation size={13} />

                              <span>
                                {item.lat}, {item.lng}
                              </span>
                            </div>

                            {/* MAP SAVED ADDRESS */}

                            <div
                              className="
                              mt-3
                              overflow-hidden
                              rounded-xl
                              border
                              border-gray-100
                            "
                            >
                              <iframe
                                title={`แผนที่ ${item.label}`}
                                src={`
                                https://www.openstreetmap.org/export/embed.html?bbox=${
                                  Number(item.lng) - 0.005
                                },${Number(item.lat) - 0.005},${
                                  Number(item.lng) + 0.005
                                },${
                                  Number(item.lat) + 0.005
                                }&layer=mapnik&marker=${Number(
                                  item.lat,
                                )},${Number(item.lng)}
                              `}
                                className="w-full h-[180px] border-0"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}

                      {/* BUTTONS */}

                      <div className="flex gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="
                            flex-1
                            py-2
                            rounded-xl
                            border
                            border-orange-300
                            text-orange-500
                            text-sm
                            font-semibold
                            hover:bg-orange-50
                            transition
                          "
                        >
                          แก้ไข
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="
                            flex-1
                            py-2
                            rounded-xl
                            border
                            border-red-200
                            text-red-500
                            text-sm
                            font-semibold
                            hover:bg-red-50
                            transition
                          "
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormAddAddress;
