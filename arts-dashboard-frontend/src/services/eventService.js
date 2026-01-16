import api from "./api";

export const getEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

export const activateEvent = async (eventId) => {
  const res = await api.post(`/events/activate/${eventId}`);
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await api.post("/events", eventData);
  return res.data;
};
