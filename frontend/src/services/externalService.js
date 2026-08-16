import api from "./api";

export const getExternalUsers = async () => {
  const response = await api.get("/external/users");

  return response.data;
};