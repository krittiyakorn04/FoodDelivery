import { useState, useEffect } from "react";
import { createCatagory,removeCatagory,updateCatagory } from "../../api/StoreMenuCategory";
import usefoodDelivery from "../../globalState/fooddeliveryStore";
import axios from "axios";
import { toast } from "react-toastify";


const FormMenuCategory = () => {
  const token = usefoodDelivery((state) => state.token);
  const categories = usefoodDelivery((state) => state.catagories)
  const getCategory = usefoodDelivery((state) => state.getCategory)
  
  const [nameCate, setname] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(()=>{
    getCategory(token)
  },[])


  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!nameCate){
      return toast.warning('เพิ่มชื่อหมวดหมู่')
    }

    try {
      const res = await createCatagory(token, { nameCate });
      console.log(res.data.nameCate);
      toast.success(`เพิ่ม ${res.data.nameCate} สำเร็จ`)
      getCategory(token)
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async(id)=>{
    console.log(id)
    try {
      const res = await removeCatagory(token,id)
      console.log(res)
      toast.success(`ลบ${res.data.name}สำเร็จ`)
      getCategory(token)
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = (item)=>{
  setEditId(item.id);
  setEditName(item.nameCate);
}


const handleUpdate = async(id)=>{
  try {

    const res = await updateCatagory(token,id,{
      nameCate: editName
    });

    toast.success("แก้ไขสำเร็จ");

    setEditId(null);
    setEditName("");

    getCategory(token);

  } catch(error){
    console.log(error);
  }
}

  return (
  <div className="min-h-screen bg-gray-100 p-5 pb-24">

    {/* เพิ่มหมวดหมู่ */}
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <h2 className="text-xl font-bold mb-4">
        เพิ่มหมวดหมู่
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={nameCate}
          onChange={(e) => setname(e.target.value)}
          className="flex-1 border rounded-xl p-3"
          placeholder="เช่น เครื่องดื่ม"
        />

        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-xl">
          เพิ่ม
        </button>
      </form>
    </div>

    {/* รายการหมวดหมู่ */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {categories.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border shadow-sm p-5"
        >
          {editId === item.id ? (
            <input
              className="border rounded-lg w-full p-2 mb-4"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          ) : (
            <>
              <h3 className="font-bold text-lg">
                {item.nameCate}
              </h3>

              <p className="text-gray-400 text-sm mb-4">
                หมวดหมู่เมนูอาหาร
              </p>
            </>
          )}

          <div className="flex gap-2">
            {editId === item.id ? (
              <>
                <button
                  type="button"
                  onClick={() => handleUpdate(item.id)}
                  className="flex-1 bg-green-500 text-white rounded-xl py-2"
                >
                  บันทึก
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setEditName("");
                  }}
                  className="flex-1 bg-gray-200 rounded-xl py-2"
                >
                  ยกเลิก
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-yellow-400 rounded-xl py-2"
                >
                  แก้ไข
                </button>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="flex-1 bg-red-500 text-white rounded-xl py-2"
                >
                  ลบ
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>

  </div>
);
};

export default FormMenuCategory;
