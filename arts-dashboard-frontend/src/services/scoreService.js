import api from "./api";

export const submitScore = async (data) => {
  const res = await api.post("/scores/submit", data);
  return res.data;
};
