import api from "./api";

export const getTeams = async () => {
  const res = await api.get("/teams");
  return res.data;
};

export const createTeam = async (teamData) => {
  const res = await api.post("/teams", teamData);
  return res.data;
};
