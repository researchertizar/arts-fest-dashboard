import api from "./api";

export const login = async (role, password) => {
  const response = await api.post("/auth/login", {
    role,
    password,
  });
  return response.data;
};
