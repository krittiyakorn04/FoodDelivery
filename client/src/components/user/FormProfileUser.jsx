import { useEffect, useState } from "react";
import usefoodDelivery from "../../globalState/fooddeliveryStore";
import {
  Store,
  User,
  Phone,
  MapPin,
  Mail,
  Settings,
  ShoppingBag,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAddress } from "../../api/UserProfile";

const FormProfileUser = () => {
  const navigate = useNavigate();
  const token = usefoodDelivery((state) => state.token);
  const getUser = usefoodDelivery((state) => state.getUser);
  const users = usefoodDelivery((state) => state.users);
  console.log(users);

  const [addresses, setAddresses] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    if (token) {
      getUser(token);
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

  return (
    <div className="min-h-screen bg-gray-50 p-5 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}

        <div className="relative rounded-3xl shadow-lg overflow-visible mb-8">
          {/* Cover gradient */}
          <div className="relative h-28 rounded-t-3xl bg-gradient-to-br from-orange-400 to-[#E8491D] overflow-hidden">
            <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-14 -left-10 w-32 h-32 rounded-full bg-white/10" />

            {/* ปุ่มแก้ไขโปรไฟล์ */}
            <button
              className="absolute top-4 right-4 bg-white/90 backdrop-blur text-orange-500 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition"
              title="editProfile"
              onClick={() => navigate("/user/UserSetting")}
            >
              <Settings size={17} />
            </button>
          </div>

          {/* ส่วนข้อมูล พื้นขาว */}
          <div className="bg-white rounded-b-3xl px-6 pb-6 pt-0">
            {/* รูปร้าน ซ้อนขอบ cover */}
            <div className="relative w-28 h-28 -mt-14 mx-auto">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-lg border-4 border-white">
                <Store size={50} className="text-orange-500" />
              </div>
            </div>

            {/* ชื่อลูกค้า */}
            <h1 className="text-2xl font-bold text-center text-[#2A1B12] mt-3">
              {users?.username}
            </h1>

            {/* แถบสถิติ มีเส้นคั่น */}
            <div className="flex items-center justify-center mt-5 rounded-2xl bg-[#FFF8F0] border border-orange-100 py-3.5 px-4">
              <div className="w-px h-8 bg-orange-100" />

              <div className="flex-1 flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1 text-[#2A1B12] font-bold text-base">
                  <ShoppingBag size={15} className="text-orange-500" />
                  120
                </div>
                <span className="text-[11px] text-[#B7A390]">ออเดอร์</span>
              </div>

              <div className="w-px h-8 bg-orange-100" />
            </div>
          </div>
        </div>

        {/* ข้อมูลร้าน */}

        <div
          className="
bg-white
rounded-3xl
shadow-sm
p-6
"
        >
          <div className="flex justify-between items-center mb-5">
            <h2
              className="
text-xl
font-bold
flex
items-center
gap-2
"
            >
              <Store size={24} className="text-orange-500" />
              ข้อมูลร้าน
            </h2>
          </div>

          <div
            className="
space-y-5
"
          >
            {/* เจ้าของร้าน */}

            <div
              className="
flex
items-center
gap-4
"
            >
              <div
                className="
w-10
h-10
rounded-xl
bg-blue-100
flex
items-center
justify-center
"
              >
                <User size={20} className="text-blue-500" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">ชื่อผู้ใช้</p>

                <p className="font-semibold">{users?.username}</p>
              </div>
            </div>

            {/* อีเมล */}

            <div
              className="
flex
items-center
gap-4
"
            >
              <div
                className="
w-10
h-10
rounded-xl
bg-blue-100
flex
items-center
justify-center
"
              >
                <Mail size={20} className="text-blue-500" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">อีเมล</p>

                <p className="font-semibold">{users?.email}</p>
              </div>
            </div>

            {/* เบอร์โทร */}

            <div
              className="
flex
items-center
gap-4
"
            >
              <div
                className="
w-10
h-10
rounded-xl
bg-green-100
flex
items-center
justify-center
"
              >
                <Phone size={20} className="text-green-500" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">เบอร์โทร</p>

                <p className="font-semibold">{users?.phone}</p>
              </div>
            </div>

            {/* ที่อยู่ */}

            <div className="flex items-start gap-4 ml-1">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mt-1">
                <MapPin size={20} className="text-red-500" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-gray-400 text-sm">ที่อยู่จัดส่ง</p>
                </div>

                {loadingAddress ? (
                  <p className="text-sm text-gray-400 mt-2">
                    กำลังโหลดที่อยู่...
                  </p>
                ) : addresses.length === 0 ? (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">
                      ยังไม่มีที่อยู่จัดส่ง
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/user/AddressSetting")}
                      className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold"
                    >
                      + เพิ่มที่อยู่
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    {addresses.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border ${
                          item.isDefault
                            ? "border-orange-300 bg-orange-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#2A1B12]">
                            {item.label}
                          </p>

                          {item.isDefault && (
                            <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                              เริ่มต้น
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {item.address}
                        </p>

                        {(item.lat !== null || item.lng !== null) && (
                          <p className="text-xs text-gray-400 mt-2">
                            <Navigation size={12} className="inline mr-1" />
                            {item.lat}, {item.lng}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormProfileUser;
