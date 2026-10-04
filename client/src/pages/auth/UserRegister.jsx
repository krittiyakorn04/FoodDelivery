import { useState } from "react";
import { toast } from "react-toastify";
import usefoodDelivery from "../../globalState/fooddeliveryStore";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();

  const actionRegisterUser = usefoodDelivery(
    (state) => state.actionRegisterUser
  );

  const user = usefoodDelivery((state) => state.user);
  console.log("user from zustand", user);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    username: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const roleRedirect = (role) => {
    if (role === "CUSTOMER") {
      navigate("/user/homeUser");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("รหัสผ่านไม่ตรงกัน");
    }

    try {
      const res = await actionRegisterUser(form);

      toast.success("สมัครใช้งานสำเร็จ");

      const role = res.data.payload.role;

      roleRedirect(role);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ";

      toast.error(errMsg);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4 py-10">
      {/* Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-orange-100 shadow-[0_20px_50px_-20px_rgba(42,27,18,0.25)] overflow-hidden">
          
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-7 sm:px-8 sm:py-8">

              {/* Header */}
              <div className="text-center mb-7">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  สร้างบัญชีสมาชิก
                </h1>

                <p className="text-sm text-gray-500 mt-2">
                  สมัครสมาชิกเพื่อเริ่มสั่งอาหาร
                </p>
              </div>

              {/* Username */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleOnChange}
                  placeholder="username"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleOnChange}
                  placeholder="example@gmail.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  โทรศัพท์
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleOnChange}
                  placeholder="089xxxxxxx"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  รหัสผ่าน
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleOnChange}
                  placeholder="********"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  ยืนยันรหัสผ่าน
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleOnChange}
                  placeholder="********"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>

              {/* Register */}
              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 py-3 text-white font-semibold hover:bg-orange-600 active:scale-[0.99] transition"
              >
                Register
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-gray-200 flex-1" />

                <span className="text-gray-400 text-xs">
                  หรือสมัครด้วย
                </span>

                <div className="h-px bg-gray-200 flex-1" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />

                <span className="text-sm font-medium text-gray-700">
                  Continue with Google
                </span>
              </button>

              {/* Login */}
              <p className="text-center mt-6 text-sm text-gray-500">
                มีบัญชีอยู่แล้ว?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-orange-500 font-semibold hover:text-orange-600"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-gray-400 mt-5">
          © 2026 RobMorFood
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
