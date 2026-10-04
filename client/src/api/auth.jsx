import axios from "axios"


export const currentUser = async (token) =>
  await axios.post(
    "http://localhost:5000/api/user/current-user",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const currentRestau = async (token) =>
  await axios.post(
    "http://localhost:5000/api/store/current-restau",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );