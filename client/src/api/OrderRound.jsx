import axios from "axios";

export const getOrderRound = async (token) => {
  return axios.get("http://localhost:5000/api/store/order-round", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("API", res.data);
};

export const createOrderRound = async (token, value) => {
  return axios.post("http://localhost:5000/api/store/order-round", value, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOrderRound = async (token, roundId, data) => {
  return axios.put(
    `http://localhost:5000/api/store/order-round/${roundId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeOrderRound = async (token, id) => {
  return axios.delete("http://localhost:5000/api/store/order-round/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeAllOrderRound = async (token) => {
  return axios.delete("http://localhost:5000/api/store/order-round", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
