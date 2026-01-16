import api from "./api";

export const getScoreboard = async () => {
  const res = await api.get("/scoreboard");
  return res.data;
};
