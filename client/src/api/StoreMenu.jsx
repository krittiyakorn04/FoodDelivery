import axios from "axios";

export const createMenu = async (token, form) => {
  return axios.post("http://localhost:5000/api/store/addmenu", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listMenu = async (token) => {
  return axios.get("http://localhost:5000/api/store/menu", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const readMenu = async (token, id) => {
  return axios.get("http://localhost:5000/api/store/menu/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateMenu = async (token, id, form) => {
  return axios.put("http://localhost:5000/api/store/menu/" + id, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const uploadFilesMenu = async (token, image, menuId) => {
  return axios.post(
    "http://localhost:5000/api/store/imageMenu",
    {
      image,
      menuId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const removeFiles = async (token, public_id) => {
  return axios.delete("http://localhost:5000/api/store/removeImageMenu", {
    data: {
      public_id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteMenu = async (token, id) => {
  return axios.delete(`http://localhost:5000/api/store/deleteMenu/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeMenuAvailability = async (token, menuId) => {
  return axios.patch(
    `http://localhost:5000/api/store/availability/${menuId}/status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// =========================
// OPTION FORMAT
// =========================

export const getOptionFormats = async (token) => {
  return axios.get("http://localhost:5000/api/store/option-formats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createOptionFormat = async (token, data) => {
  return axios.post("http://localhost:5000/api/store/option-formats", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOptionFormat = async (token, id, data) => {
  return axios.put(
    `http://localhost:5000/api/store/option-formats/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const deleteOptionFormat = async (token, id) => {
  return axios.delete(`http://localhost:5000/api/store/option-formats/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
