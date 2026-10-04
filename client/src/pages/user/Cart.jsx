import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const cart = {
    storeName: "ครัวอิ่มสุข",
    round: "รอบกลางวัน (11:00 - 13:00)",
    items: [
      {
        id: 1,
        name: "ข้าวกะเพราไก่",
        option: "เผ็ดกลาง + ไข่ดาว",
        qty: 2,
        price: 60,
        image: "https://picsum.photos/120?1",
      },
      {
        id: 2,
        name: "ชาเย็น",
        option: "หวานน้อย",
        qty: 1,
        price: 35,
        image: "https://picsum.photos/120?2",
      },
    ],
  };

  const total = cart.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );

  return (
    <div className="max-w-3xl mx-auto p-6 pb-28">
      <h1 className="text-3xl font-bold mb-6">ตะกร้าสินค้า</h1>

      {/* ร้าน */}
      <div className="bg-white rounded-2xl shadow p-5 mb-6">
        <h2 className="text-xl font-bold">{cart.storeName}</h2>

        <p className="text-gray-500 mt-1">🕒 {cart.round}</p>
      </div>

      {/* รายการอาหาร */}
      <div className="space-y-5">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow p-4 flex gap-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-28 rounded-xl object-cover"
            />

            <div className="flex-1">
              <h3 className="font-bold text-lg">{item.name}</h3>

              <p className="text-gray-500 text-sm mt-1">{item.option}</p>

              <p className="text-orange-500 font-bold mt-3">฿{item.price}</p>
            </div>

            <div className="flex flex-col justify-between items-end">
              <button className="text-red-500 hover:text-red-600">
                <Trash2 size={20} />
              </button>

              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Minus size={16} />
                </button>

                <span className="font-bold">{item.qty}</span>

                <button className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* สรุปยอด */}
      <div className="mt-8 bg-white rounded-2xl shadow p-5">
        <div className="flex justify-between mb-3">
          <span>ค่าอาหาร</span>

          <span>฿{total}</span>
        </div>

        <div className="flex justify-between mb-3">
          <span>ค่าจัดส่ง</span>

          <span>฿20</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between text-xl font-bold">
          <span>ยอดรวม</span>

          <span>฿{total + 20}</span>
        </div>
      </div>

      {/* ปุ่มสั่งซื้อ */}
      <div className="mt-8 mb-24 bg-white border-t pt-4">
        <button
          onClick={() => navigate("/user/orderUser")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-lg font-bold"
        >
          ดำเนินการสั่งซื้อ
        </button>
      </div>
    </div>
  );
}
