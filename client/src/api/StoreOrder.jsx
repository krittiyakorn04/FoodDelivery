import axios from "axios";

export const getStoreOrders = async (token) => {
  return axios.get("http://localhost:5000/api/store/order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const readOrder = async (token, id) => {
  return axios.get(`http://localhost:5000/api/store/order/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStoreDelivery = async (token) => {
  return axios.get("http://localhost:5000/api/store/delivery", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDeliveryDetail = (token, id) => {
  return axios.get(`http://localhost:5000/api/store/delivery/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeStatusOrder = async (token, id, status) => {
  return axios.patch(
    `http://localhost:5000/api/store/order/${id}`,
    {
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
};

export const cancelStoreOrder = (token, orderId) => {
  return axios.post(
    `http://localhost:5000/api/store/order/${orderId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const changeStatusDelivery = async (token, id, status) => {
  return axios.patch(
    `http://localhost:5000/api/store/delivery/${id}`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
};

export const confirmOrderCompleted = (token, orderId) => {
  return axios.patch(
    `http://localhost:5000/api/store/order/${orderId}/confirm-completed`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const changeStatusPayment = async (
  token,
  id,
  status,
  rejectedReason = null,
) => {
  return axios.patch(
    `http://localhost:5000/api/store/payment/${id}/status`,
    {
      status,
      rejectedReason,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
};

const API = "http://localhost:5000/api";

export const getMyStoreReviews = (token) => {
  return axios.get(`${API}/store/reviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadDeliveryProof = (token, deliveryId, image, proofType) => {
  return axios.post(
    `http://localhost:5000/api/store/delivery/${deliveryId}/proof`,
    {
      image,
      proofType,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const uploadRiderProof = (token, deliveryId, image, proofType) => {
  return axios.post(
    `http://localhost:5000/api/store/deliverystaff/${deliveryId}/proof`,
    {
      image,
      proofType,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeDeliveryProof = (token, deliveryId, proofType) => {
  return axios.delete(
    `http://localhost:5000/api/store/delivery/${deliveryId}/proof`,
    {
      data: {
        proofType,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const deleteRiderProof = (token, deliveryId, imageId) => {
  return axios.delete(
    `http://localhost:5000/api/store/staff/delivery/${deliveryId}/proof/${imageId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};


export const getDeliveryNotifications = (token) => {
  return axios.get("http://localhost:5000/api/store/staff/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const markDeliveryNotificationRead = (token, notificationId) => {
  return axios.patch(
    `http://localhost:5000/api/store/staff/notification/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const markAllDeliveryNotificationsRead = (token) => {
  return axios.patch(
    "http://localhost:5000/api/store/staff/notification/read-all",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
