import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

const UploadFile = ({ form, setform }) => {
  const [preview, setPreview] = useState(form.imagePreview || null);

  useEffect(() => {
    setPreview(form.imagePreview || null);
  }, [form.imagePreview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกรูปภาพ");
      event.target.value = "";
      return;
    }

    // ล้าง preview URL เก่าที่เป็น blob
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

    setform((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: previewUrl,
      removeImage: false,
    }));

    event.target.value = "";
  };

  const handleRemove = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);

    setform((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: null,
      removeImage: true,
    }));
  };

  return (
    <div>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview เมนู"
            className="w-full max-h-[400px] object-contain rounded-2xl border bg-gray-50"
          />

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="menu-image"
          className="min-h-[220px] border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition"
        >
          <Upload size={38} className="text-gray-400" />

          <p className="mt-3 font-semibold text-gray-600">
            เลือกรูปเมนู
          </p>

          <p className="text-xs text-gray-400 mt-1">
            รูปภาพอาหาร
          </p>

          <input
            id="menu-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      )}
    </div>
  );
};

export default UploadFile;