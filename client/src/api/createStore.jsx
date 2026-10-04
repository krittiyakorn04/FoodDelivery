import axios from "axios";

export const getStoreProfile = async (token) => {
  return axios.get("http://localhost:5000/api/store/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateStoreProfile = async (token, data) => {
  return axios.put("http://localhost:5000/api/store/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFiles = async (token, form) => {
  return axios.post(
    "http://localhost:5000/api/store/image",
    {
      image: form,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeFiles = async (token, public_id) => {
  return axios.delete("http://localhost:5000/api/store/removeImage", {
    data: {
      public_id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFilesBanner = async (token, form) => {
  return axios.post(
    "http://localhost:5000/api/store/banner",
    {
      image: form,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeFilesBanner = async (token, public_id) => {
  return axios.delete("http://localhost:5000/api/store/removeImage", {
    data: {
      public_id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFilesQR = async (token, form) => {
  return axios.post(
    "http://localhost:5000/api/store/storesQR",
    {
      image: form,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeFilesQR = async (token, public_id) => {
  return axios.delete("http://localhost:5000/api/store/removeQR", {
    data: {
      public_id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFilesVerify = async (token, data) => {
  return axios.post(
    "http://localhost:5000/api/store/storesVerify",
    {
      image: data,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeFilesVerify = async (token, public_id) => {
  return axios.delete("http://localhost:5000/api/store/removeVerify", {
    data: {
      public_id,
    },

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCategoryStore = async () => {
  return axios.get("http://localhost:5000/api/store/categories");
};

export const changeOrderMode = async (token, value) => {
  return axios.patch("http://localhost:5000/api/store/storeOrderMode", value, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleStoreStatus = (token, status) => {
  return axios.patch(
    "http://localhost:5000/api/store/storeStatus",
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// api/store.js
export const getAllStore = async () => {
  return axios.get("http://localhost:5000/api/store");
};

export const getStoreStaff = async (token) => {
  return axios.get("http://localhost:5000/api/store/staff", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const createStoreStaff = async (token, data) => {
  return axios.post("http://localhost:5000/api/store/staff", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const updateStoreStaff = async (token, id, data) => {
  return axios.patch(`http://localhost:5000/api/store/staff/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const changeStoreStaffStatus = async (token, id) => {
  return axios.patch(
    `http://localhost:5000/api/store/staff/${id}/status`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export const getDeliveryJobs = async (token) => {
  return axios.get("http://localhost:5000/api/store/deliveryStaff-list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const assignDeliveryStaff = async (token, deliveryId, staffId) => {
  return axios.patch(
    `http://localhost:5000/api/store/delivery/${deliveryId}/assign`,
    {
      staffId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const assignDeliveryStaffBulk = async (token, deliveryIds, staffId) => {
  return axios.patch(
    `http://localhost:5000/api/store/delivery/assign-bulk`,
    {
      deliveryIds,
      staffId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const startDelivery = async (token, deliveryId) => {
  return axios.patch(
    "http://localhost:5000/api/store/deliveryStaff/start",
    { deliveryId },
    { headers: { Authorization: `Bearer ${token}` } },
  );
};
export const markDelivered = async (token, deliveryId) => {
  return axios.patch(
    "http://localhost:5000/api/store/deliveryStaff/delivered",
    { deliveryId },
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export const getDeliveryDetailStaff = (token, id) => {
  return axios.get(`http://localhost:5000/api/staff/delivery/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
