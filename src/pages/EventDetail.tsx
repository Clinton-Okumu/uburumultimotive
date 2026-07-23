import { useParams } from "react-router-dom";
import EventDetailView from "../components/UburuVillageComponents/EventDetailView";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  return <EventDetailView eventId={eventId || "therapeutic-trip"} />;
};

export default EventDetail;
