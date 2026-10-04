import axios from "axios";

export const getUserMenu = async (token, menuId) => {
  const response = await axios.get(
    `http://localhost:5000/api/user/Menu/${menuId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};