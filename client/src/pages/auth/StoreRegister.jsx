import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
ArrowLeft,
ArrowRight,
MapPin,
Navigation,
Store,
Check,
} from "lucide-react";

import {
MapContainer,
TileLayer,
Marker,
useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import usefoodDelivery from "../../globalState/fooddeliveryStore";

// =============================================================
// FIX LEAFLET MARKER ICON
// =============================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
iconRetinaUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
iconUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
shadowUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// =============================================================
// DEFAULT LOCATION
// มหาสารคาม เป็นค่าเริ่มต้นของแผนที่
// แต่ยังไม่ถือว่าเป็นพิกัดร้าน
// =============================================================

const DEFAULT_LAT = 16.2465;
const DEFAULT_LNG = 103.2505;

// =============================================================
// MAP CONTROLLER
// ใช้เลื่อนแผนที่ไปยังหมุด
// =============================================================

const MapController = ({ position }) => {
const map = useMap();

useEffect(() => {
if (!position) return;


map.setView(
  [position.lat, position.lng],
  17,
  {
    animate: true,
  }
);


}, [position, map]);

return null;
};

// =============================================================
// STORE REGISTER
// =============================================================

const StoreRegister = () => {
const navigate = useNavigate();

// ===========================================================
// ZUSTAND
// ===========================================================

const storeCategory = usefoodDelivery(
(state) => state.storeCategory
);

const getStoreCategory = usefoodDelivery(
(state) => state.getStoreCategory
);

const actionRegisterStore = usefoodDelivery(
(state) => state.actionRegisterStore
);

// ===========================================================
// PAGE
// 1 = ACCOUNT
// 2 = STORE
// ===========================================================

const [page, setPage] = useState(1);

// ===========================================================
// FORM
// ===========================================================

const [form, setForm] = useState({
// ACCOUNT
email: "",
password: "",
confirmPassword: "",
username: "",


// STORE
phone: "",
storeName: "",
address: "",

storeCategoryIds: [],

dayOpen: "",
timeOpen: "",
timeClose: "",

openAuto: false,

Notice: "",

promptpayNumber: "",
bankName: "",
bankAccount: "",
bankAccountName: "",

// LOCATION
lat: null,
lng: null,


});

// ===========================================================
// CATEGORY
// ===========================================================

const [showAllCategories, setShowAllCategories] =
useState(false);

const INITIAL_CATEGORY_LIMIT = 6;
const MAX_CATEGORY = 3;

// ===========================================================
// LOCATION
// ===========================================================

const [locationFound, setLocationFound] =
useState(false);

const [locationLoading, setLocationLoading] =
useState(false);

const [markerPosition, setMarkerPosition] =
useState(null);

// ===========================================================
// LOAD CATEGORY
// ===========================================================

useEffect(() => {
getStoreCategory();
}, [getStoreCategory]);

// ===========================================================
// HANDLE INPUT
// ===========================================================

const handleOnChange = (e) => {
const {
name,
value,
type,
checked,
} = e.target;


setForm((prev) => ({
  ...prev,
  [name]:
    type === "checkbox"
      ? checked
      : value,
}));


};

// ===========================================================
// CATEGORY
// ===========================================================

const handleCategoryChange = (categoryId) => {
const id = Number(categoryId);


setForm((prev) => {
  const exists =
    prev.storeCategoryIds.includes(id);

  // ยกเลิก
  if (exists) {
    return {
      ...prev,
      storeCategoryIds:
        prev.storeCategoryIds.filter(
          (item) => item !== id
        ),
    };
  }

  // จำกัด 3
  if (
    prev.storeCategoryIds.length >=
    MAX_CATEGORY
  ) {
    toast.warning(
      `เลือกประเภทร้านอาหารได้สูงสุด ${MAX_CATEGORY} ประเภท`
    );

    return prev;
  }

  return {
    ...prev,
    storeCategoryIds: [
      ...prev.storeCategoryIds,
      id,
    ],
  };
});


};

// ===========================================================
// CATEGORY LIST
// ===========================================================

const visibleCategories = useMemo(() => {
if (showAllCategories) {
return storeCategory || [];
}


return (storeCategory || []).slice(
  0,
  INITIAL_CATEGORY_LIMIT
);


}, [
storeCategory,
showAllCategories,
]);

const hasMoreCategories =
(storeCategory || []).length >
INITIAL_CATEGORY_LIMIT;

// ===========================================================
// NEXT PAGE
// ===========================================================

const handleNext = (e) => {
e.preventDefault();


// USERNAME
if (!form.username.trim()) {
  toast.error(
    "กรุณากรอกชื่อผู้ใช้งาน"
  );
  return;
}

// EMAIL
if (!form.email.trim()) {
  toast.error(
    "กรุณากรอกอีเมล"
  );
  return;
}

// PASSWORD
if (!form.password) {
  toast.error(
    "กรุณากรอกรหัสผ่าน"
  );
  return;
}

// CONFIRM PASSWORD
if (!form.confirmPassword) {
  toast.error(
    "กรุณายืนยันรหัสผ่าน"
  );
  return;
}

// PASSWORD MATCH
if (
  form.password !==
  form.confirmPassword
) {
  toast.error(
    "รหัสผ่านไม่ตรงกัน"
  );
  return;
}

setPage(2);

window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

// ===========================================================
// BACK
// ===========================================================

const handleBack = () => {
setPage(1);


window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

// ===========================================================
// FIND LOCATION
// ต้องกดปุ่มนี้ก่อนจึงจะลากหมุดได้
// ===========================================================

const handleFindLocation = () => {
if (!navigator.geolocation) {
toast.error(
"เบราว์เซอร์นี้ไม่รองรับการค้นหาตำแหน่ง"
);
return;
}


setLocationLoading(true);

navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat =
      position.coords.latitude;

    const lng =
      position.coords.longitude;

    const newPosition = {
      lat,
      lng,
    };

    // ตั้งหมุด
    setMarkerPosition(
      newPosition
    );

    // เก็บพิกัด
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    // เปิดให้ลาก
    setLocationFound(true);

    setLocationLoading(false);

    toast.success(
      "ค้นหาพิกัดสำเร็จ สามารถลากหมุดเพื่อปรับตำแหน่งได้"
    );
  },

  (error) => {
    console.log(
      "LOCATION ERROR:",
      error
    );

    setLocationLoading(false);

    if (
      error.code ===
      error.PERMISSION_DENIED
    ) {
      toast.error(
        "กรุณาอนุญาตให้เว็บไซต์เข้าถึงตำแหน่งของคุณ"
      );
    } else if (
      error.code ===
      error.POSITION_UNAVAILABLE
    ) {
      toast.error(
        "ไม่สามารถระบุตำแหน่งได้"
      );
    } else if (
      error.code ===
      error.TIMEOUT
    ) {
      toast.error(
        "ค้นหาพิกัดหมดเวลา กรุณาลองใหม่"
      );
    } else {
      toast.error(
        "ค้นหาพิกัดไม่สำเร็จ"
      );
    }
  },
  {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  }
);


};

// ===========================================================
// DRAG MARKER
// ===========================================================

const handleMarkerDragEnd = (
event
) => {
if (!locationFound) return;


const marker =
  event.target;

const position =
  marker.getLatLng();

const lat = position.lat;
const lng = position.lng;

setMarkerPosition({
  lat,
  lng,
});

setForm((prev) => ({
  ...prev,
  latitude: lat,
  longitude: lng,
}));

toast.success(
  "เปลี่ยนตำแหน่งร้านแล้ว"
);


};

// ===========================================================
// SUBMIT
// ===========================================================

const handleSubmit = async (e) => {
e.preventDefault();


// STORE NAME
if (!form.storeName.trim()) {
  toast.error(
    "กรุณากรอกชื่อร้านอาหาร"
  );
  return;
}

// CATEGORY
if (
  form.storeCategoryIds.length ===
  0
) {
  toast.error(
    "กรุณาเลือกประเภทร้านอย่างน้อย 1 ประเภท"
  );
  return;
}

// CATEGORY MAX
if (
  form.storeCategoryIds.length >
  MAX_CATEGORY
) {
  toast.error(
    `เลือกประเภทร้านอาหารได้สูงสุด ${MAX_CATEGORY} ประเภท`
  );
  return;
}

// PHONE
if (!form.phone.trim()) {
  toast.error(
    "กรุณากรอกเบอร์โทรศัพท์"
  );
  return;
}

// ADDRESS / LOCATION
if (
  !form.latitude ||
  !form.longitude
) {
  toast.error(
    "กรุณากดค้นหาพิกัดร้านก่อนสมัคร"
  );
  return;
}

try {
  const data = {
    // ACCOUNT
    email: form.email,
    password: form.password,
    username: form.username,

    // STORE
    phone: form.phone,
    storeName: form.storeName,
    address: form.address,

    storeCategoryIds:
      form.storeCategoryIds,

    dayOpen: form.dayOpen,
    timeOpen: form.timeOpen,
    timeClose: form.timeClose,

    openAuto: form.openAuto,

    Notice: form.Notice,

    promptpayNumber:
      form.promptpayNumber,

    bankName:
      form.bankName,

    bankAccount:
      form.bankAccount,

    bankAccountName:
      form.bankAccountName,

    // LOCATION
    lat: form.latitude,
    lng: form.longitude,
  };

  console.log(
    "REGISTER STORE DATA:",
    data
  );

  const res =
    await actionRegisterStore(
      data
    );

  toast.success(
    "สมัครร้านอาหารสำเร็จ"
  );

  const role =
    res?.data?.payload?.role;

  if (role === "MERCHANT") {
    navigate("/store/store");
  } else {
    navigate("/");
  }
} catch (error) {
  console.log(
    "REGISTER STORE ERROR:",
    error
  );

  const message =
    error.response?.data?.message ||
    "สมัครร้านไม่สำเร็จ";

  toast.error(message);
}


};

// ===========================================================
// RENDER
// ===========================================================

return ( <div
   className="
     min-h-screen
     bg-gradient-to-b
     from-orange-50
     to-white
     py-10
     px-4
   "
 > <div className="max-w-2xl mx-auto">


    {/* ================================================= */}
    {/* PROGRESS */}
    {/* ================================================= */}

    <div className="mb-6">

      <div className="flex items-center justify-center gap-3">

        <div
          className={`
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            font-bold
            ${
              page >= 1
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-500"
            }
          `}
        >
          {page > 1 ? (
            <Check size={18} />
          ) : (
            "1"
          )}
        </div>

        <div
          className={`
            w-16
            h-1
            rounded-full
            ${
              page >= 2
                ? "bg-orange-500"
                : "bg-gray-200"
            }
          `}
        />

        <div
          className={`
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            font-bold
            ${
              page >= 2
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-500"
            }
          `}
        >
          2
        </div>

      </div>

      <div className="flex justify-center gap-16 mt-2">

        <span className="text-xs text-gray-500">
          บัญชีผู้ใช้
        </span>

        <span className="text-xs text-gray-500">
          ข้อมูลร้าน
        </span>

      </div>

    </div>

    {/* ================================================= */}
    {/* CARD */}
    {/* ================================================= */}

    <div
      className="
        bg-white
        rounded-3xl
        border
        border-orange-100
        shadow-[0_20px_50px_-20px_rgba(42,27,18,0.25)]
        p-6
        md:p-8
      "
    >

      {/* ================================================= */}
      {/* PAGE 1 */}
      {/* ================================================= */}

      {page === 1 && (

        <form onSubmit={handleNext}>

          <div className="mb-8">

            <div className="flex items-center gap-3 mb-3">

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
                <Store
                  className="text-orange-500"
                />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-gray-800">
                  สร้างบัญชีร้านอาหาร
                </h1>

                <p className="text-gray-500 mt-1">
                  ขั้นตอนที่ 1 จาก 2
                </p>

              </div>

            </div>

            <p className="text-gray-500 mt-4">
              สร้างบัญชีสำหรับเข้าสู่ระบบจัดการร้าน
            </p>

          </div>

          {/* USERNAME */}

          <div className="mb-5">

            <label className="text-sm text-gray-600 mb-2 block">
              ชื่อผู้ใช้งาน
            </label>

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleOnChange}
              placeholder="username"
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
              "
            />

          </div>

          {/* EMAIL */}

          <div className="mb-5">

            <label className="text-sm text-gray-600 mb-2 block">
              อีเมล
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleOnChange}
              placeholder="example@email.com"
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
              "
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-5">

            <label className="text-sm text-gray-600 mb-2 block">
              รหัสผ่าน
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleOnChange}
              placeholder="********"
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
              "
            />

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="mb-8">

            <label className="text-sm text-gray-600 mb-2 block">
              ยืนยันรหัสผ่าน
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleOnChange}
              placeholder="********"
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
              "
            />

          </div>

          <button
            type="submit"
            className="
              w-full
              rounded-xl
              bg-orange-500
              py-3
              text-white
              font-semibold
              hover:bg-orange-600
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >
            ถัดไป
            <ArrowRight size={18} />
          </button>

          <p className="text-center mt-6 text-gray-500">

            มีบัญชีร้านอยู่แล้ว?{" "}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/store/login"
                )
              }
              className="
                text-orange-500
                font-semibold
                hover:text-orange-600
              "
            >
              เข้าสู่ระบบ
            </button>

          </p>

        </form>
      )}

      {/* ================================================= */}
      {/* PAGE 2 */}
      {/* ================================================= */}

      {page === 2 && (

        <form onSubmit={handleSubmit}>

          <div className="mb-8">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={handleBack}
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  hover:bg-orange-100
                  transition
                "
              >
                <ArrowLeft size={18} />
              </button>

              <div>

                <h1 className="text-3xl font-bold text-gray-800">
                  ข้อมูลร้านอาหาร
                </h1>

                <p className="text-gray-500 mt-1">
                  ขั้นตอนที่ 2 จาก 2
                </p>

              </div>

            </div>

          </div>

          {/* STORE NAME */}

          <div className="mb-5">

            <label className="text-sm text-gray-600 mb-2 block">
              ชื่อร้านอาหาร
            </label>

            <input
              type="text"
              name="storeName"
              value={form.storeName}
              onChange={handleOnChange}
              placeholder="เช่น ครัวอิ่มสุข"
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
              "
            />

          </div>

          {/* CATEGORY */}

          <div className="mb-6">

            <div className="flex items-center justify-between mb-2">

              <label className="text-sm text-gray-600">
                ประเภทร้านอาหาร
              </label>

              <span className="text-xs text-gray-400">
                เลือกได้สูงสุด {MAX_CATEGORY} ประเภท
              </span>

            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
              "
            >

              {(storeCategory || []).length ===
              0 ? (

                <div
                  className="
                    col-span-full
                    text-center
                    text-sm
                    text-gray-400
                    py-5
                    border
                    rounded-xl
                    bg-gray-50
                  "
                >
                  กำลังโหลดประเภทอาหาร...
                </div>

              ) : (

                visibleCategories.map(
                  (category) => {

                    const id =
                      Number(
                        category.id
                      );

                    const checked =
                      form.storeCategoryIds.includes(
                        id
                      );

                    const disabled =
                      form.storeCategoryIds.length >=
                        MAX_CATEGORY &&
                      !checked;

                    return (

                      <label
                        key={
                          category.id
                        }
                        className={`
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          px-4
                          py-3
                          transition

                          ${
                            disabled
                              ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }

                          ${
                            checked
                              ? "border-orange-400 bg-orange-50"
                              : !disabled
                              ? "border-gray-200 bg-gray-50 hover:border-orange-300"
                              : ""
                          }
                        `}
                      >

                        <input
                          type="checkbox"
                          checked={
                            checked
                          }
                          disabled={
                            disabled
                          }
                          onChange={() =>
                            handleCategoryChange(
                              category.id
                            )
                          }
                          className="
                            w-4
                            h-4
                            accent-orange-500
                          "
                        />

                        <span
                          className={
                            checked
                              ? "text-orange-600 font-semibold"
                              : "text-gray-700"
                          }
                        >
                          {
                            category.name
                          }
                        </span>

                      </label>
                    );
                  }
                )

              )}

            </div>

            {hasMoreCategories && (

              <button
                type="button"
                onClick={() =>
                  setShowAllCategories(
                    (prev) => !prev
                  )
                }
                className="
                  w-full
                  mt-3
                  py-2.5
                  rounded-xl
                  border
                  border-orange-200
                  bg-orange-50
                  text-orange-600
                  text-sm
                  font-semibold
                  hover:bg-orange-100
                  transition
                "
              >
                {showAllCategories
                  ? "แสดงน้อยลง"
                  : `แสดงเพิ่มเติม (${
                      storeCategory.length -
                      INITIAL_CATEGORY_LIMIT
                    } ประเภท)`}
              </button>

            )}

            {form.storeCategoryIds.length >
              0 && (

              <div className="mt-4">

                <p className="text-xs text-gray-500 mb-2">
                  เลือกแล้ว{" "}
                  <span className="font-semibold text-orange-500">
                    {
                      form.storeCategoryIds.length
                    }
                  </span>
                  {" / "}
                  {MAX_CATEGORY} ประเภท
                </p>

                <div className="flex flex-wrap gap-2">

                  {form.storeCategoryIds.map(
                    (id) => {

                      const category =
                        storeCategory.find(
                          (item) =>
                            Number(
                              item.id
                            ) ===
                            Number(id)
                        );

                      return (

                        <span
                          key={id}
                          className="
                            px-3
                            py-1.5
                            rounded-full
                            bg-orange-50
                            border
                            border-orange-200
                            text-orange-600
                            text-xs
                            font-medium
                          "
                        >
                          {
                            category?.name
                          }
                        </span>

                      );
                    }
                  )}

                </div>

              </div>

            )}

          </div>

          {/* PHONE */}

          <div className="mb-5">

            <label className="text-sm text-gray-600 mb-2 block">
              เบอร์โทรศัพท์
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleOnChange}
              placeholder="089xxxxxxx"
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
              "
            />

          </div>

          {/* ================================================= */}
          {/* LOCATION */}
          {/* ================================================= */}

          <div className="mb-6">

            <div className="flex items-center justify-between mb-2">

              <label className="text-sm text-gray-600 font-medium">
                ตำแหน่งร้าน
              </label>

              {locationFound && (

                <span
                  className="
                    text-xs
                    text-green-600
                    font-semibold
                    flex
                    items-center
                    gap-1
                  "
                >
                  <Check size={14} />
                  พบพิกัดแล้ว
                </span>

              )}

            </div>

            {/* FIND LOCATION */}

            <button
              type="button"
              onClick={
                handleFindLocation
              }
              disabled={
                locationLoading
              }
              className="
                w-full
                mb-3
                rounded-xl
                bg-orange-500
                hover:bg-orange-600
                disabled:bg-gray-300
                text-white
                py-3
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
            >

              {locationLoading ? (
                <>
                  <span
                    className="
                      w-4
                      h-4
                      border-2
                      border-white
                      border-t-transparent
                      rounded-full
                      animate-spin
                    "
                  />

                  กำลังค้นหาพิกัด...

                </>
              ) : (
                <>
                  <Navigation size={18} />

                  {locationFound
                    ? "ค้นหาพิกัดใหม่"
                    : "ค้นหาพิกัดของฉัน"}
                </>
              )}

            </button>

            {/* MAP */}

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-orange-100
                h-[350px]
              "
            >

              <MapContainer
                center={[
                  DEFAULT_LAT,
                  DEFAULT_LNG,
                ]}
                zoom={13}
                scrollWheelZoom={
                  true
                }
                className="w-full h-full"
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markerPosition && (

                  <>

                    <MapController
                      position={
                        markerPosition
                      }
                    />

                    <Marker
                      position={[
                        markerPosition.lat,
                        markerPosition.lng,
                      ]}
                      draggable={
                        locationFound
                      }
                      eventHandlers={{
                        dragend:
                          handleMarkerDragEnd,
                      }}
                    />

                  </>

                )}

              </MapContainer>

              {/* LOCK OVERLAY */}

              {!locationFound && (

                <div
                  className="
                    absolute
                    inset-0
                    z-[500]
                    bg-white/60
                    backdrop-blur-[1px]
                    flex
                    items-center
                    justify-center
                    pointer-events-none
                  "
                >

                  <div
                    className="
                      bg-white
                      rounded-2xl
                      shadow-lg
                      border
                      border-orange-100
                      px-5
                      py-4
                      text-center
                    "
                  >

                    <MapPin
                      className="
                        mx-auto
                        text-orange-500
                        mb-2
                      "
                      size={28}
                    />

                    <p className="font-semibold text-gray-800">
                      กรุณาค้นหาพิกัดก่อน
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      เมื่อพบพิกัดแล้ว
                      สามารถลากหมุดเพื่อปรับตำแหน่งได้
                    </p>

                  </div>

                </div>

              )}

            </div>

            {/* LOCATION INFO */}

            {locationFound &&
              form.latitude &&
              form.longitude && (

              <div
                className="
                  mt-3
                  rounded-xl
                  bg-green-50
                  border
                  border-green-200
                  p-3
                "
              >

                <div className="flex items-start gap-2">

                  <MapPin
                    size={18}
                    className="
                      text-green-600
                      mt-0.5
                      shrink-0
                    "
                  />

                  <div>

                    <p className="text-sm font-semibold text-green-700">
                      ตำแหน่งร้าน
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      ละติจูด:{" "}
                      {Number(
                        form.latitude
                      ).toFixed(6)}
                    </p>

                    <p className="text-xs text-gray-600">
                      ลองจิจูด:{" "}
                      {Number(
                        form.longitude
                      ).toFixed(6)}
                    </p>

                    <p className="text-xs text-green-600 mt-1">
                      สามารถลากหมุดบนแผนที่เพื่อปรับตำแหน่งได้
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>

          {/* ADDRESS DETAIL */}

          <div className="mb-6">

            <label className="text-sm text-gray-600 mb-2 block">
              รายละเอียดที่อยู่ร้าน
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleOnChange}
              placeholder="เช่น บ้านเลขที่ อาคาร ถนน หรือจุดสังเกตใกล้ร้าน"
              rows={3}
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
                resize-none
              "
            />

            <p className="text-xs text-gray-400 mt-2">
              ใช้แผนที่ระบุตำแหน่งร้าน และกรอกรายละเอียดเพิ่มเติมได้ที่ช่องนี้
            </p>

          </div>

          {/* ================================================= */}
          {/* SUBMIT */}
          {/* ================================================= */}

          <button
            type="submit"
            disabled={
              !locationFound
            }
            className="
              w-full
              rounded-xl
              bg-orange-500
              py-3
              text-white
              font-semibold
              hover:bg-orange-600
              disabled:bg-gray-300
              disabled:cursor-not-allowed
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <Check size={18} />

            สมัครร้านอาหาร

          </button>

          {!locationFound && (

            <p className="text-center text-xs text-red-500 mt-3">
              กรุณากด “ค้นหาพิกัดของฉัน” ก่อนสมัครร้าน
            </p>

          )}

        </form>
      )}

    </div>

  </div>
</div>

);
};

export default StoreRegister;
