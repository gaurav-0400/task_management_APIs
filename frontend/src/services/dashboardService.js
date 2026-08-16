import api from "./api";

export const getDashboard = async (userId) => {
  const response = await api.get("/dashboard", {
    params: {
      user_id: userId,
    },
  });

  return response.data;
};