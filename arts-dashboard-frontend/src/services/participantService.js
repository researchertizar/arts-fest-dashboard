import api from "./api";

export const getActiveEventParticipants = async () => {
  const eventsRes = await api.get("/events");
  const activeEvent = eventsRes.data.find(e => e.is_active);

  if (!activeEvent) return { event: null, participants: [] };

  const participantsRes = await api.get(
    `/participants?eventId=${activeEvent.id}`
  );

  return {
    event: activeEvent,
    participants: participantsRes.data,
  };
};

export const addParticipant = async (participantData) => {
  const res = await api.post("/participants", participantData);
  return res.data;
};
