import axios from "axios";

export const getUserProfile = async (token) => {
  return axios.get("http://localhost:5000/api/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStoreClient = async (token, id) => {
  return axios.get("http://localhost:5000/api/store/profile/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStoreClientPublic = async (id) => {
  return axios.get(
    "http://localhost:5000/api/store/profile-public/" + id,
  );
}

export const updateUserProfile = async (token, data) => {
  return axios.put("http://localhost:5000/api/user/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createAddress = async (token, data) => {
  return axios.post("http://localhost:5000/api/user/address", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAddress = async (token) => {
  return axios.get("http://localhost:5000/api/user/address", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateAddress = async (token, id, data) => {
  return axios.put("http://localhost:5000/api/user/address/" + id, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeAddress = async (token, id) => {
  return axios.delete("http://localhost:5000/api/user/address/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


