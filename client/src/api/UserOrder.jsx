import axios from "axios";

export const getAllUserCarts = (token) => {
  return axios.get("http://localhost:5000/api/user/carts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserCart = (token) => {
  return axios.get("http://localhost:5000/api/user/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addToCart = async (token, value) => {
  return axios.post("http://localhost:5000/api/user/cart", value, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCart = async (token, storeId) => {
  return axios.get(`http://localhost:5000/api/user/cart/${storeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCart = async (token, id, data) => {
  return axios.patch(`http://localhost:5000/api/user/cart/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeCart = async (token, id) => {
  return axios.delete(`http://localhost:5000/api/user/cart/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createOrder = async (token, value) => {
  return axios.post("http://localhost:5000/api/user/order", value, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const cancelOrder = (token, orderId) => {
  return axios.post(
    `http://localhost:5000/api/user/order/${orderId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const getOrder = async (token) => {
  return axios.get("http://localhost:5000/api/user/order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrderDetail = async (token, id) => {
  return axios.get(`http://localhost:5000/api/user/order/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadSlip = (token, orderId, image) => {
  return axios.post(
    `http://localhost:5000/api/user/order/${orderId}/slip`,
    {
      image,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeSlip = async (token, id, public_id) => {
  return axios.delete(`http://localhost:5000/api/user/payment/${id}`, {
    data: {
      public_id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const confirmReceived = async (token, orderId) => {
  return axios.patch(
    `http://localhost:5000/api/user/order/${orderId}/confirm-received`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

const API_URL = "http://localhost:5000/api";

// ===============================
// GET REVIEW
// ===============================

export const getReview = (token, orderId) => {
  return axios.get(`${API_URL}/user/review/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===============================
// CREATE REVIEW
// ===============================

export const createReview = (token, orderId, data) => {
  return axios.post(
    `http://localhost:5000/api/user/review/${Number(orderId)}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
};

// ===============================
// UPDATE REVIEW
// ===============================

export const updateReview = (token, reviewId, data) => {
  return axios.put(`${API_URL}/user/review/${reviewId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===============================
// DELETE REVIEW
// ===============================

export const removeReview = (token, reviewId) => {
  return axios.delete(`${API_URL}/user/review/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStoreReviews = (token, storeId) => {
  return axios.get(
    `http://localhost:5000/api/user/store/${Number(storeId)}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const createOrderReport = (token, orderId, type, detail = "") => {
  return axios.post(
    `${API_URL}/order-report`,
    {
      orderId,
      type,
      detail,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// =========================
// ดูเรื่องร้องเรียนของตัวเอง
// =========================
export const getMyOrderReports = (token) => {
  return axios.get(`${API_URL}/order-report/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
