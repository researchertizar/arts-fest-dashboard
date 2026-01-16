import api from "./api";

export const getActiveEventParticipants = async () => {
  const eventsRes = await api.get("/events");
  const activeEvent = eventsRes.data.find(e => e.is_active);

  if (!activeEvent) return { event: null, participants: [] };

  const participantsRes = await api.get(
    `/participants/event/${activeEvent.id}`
  );

  return {
    event: activeEvent,
    participants: participantsRes.data,
  };
};
