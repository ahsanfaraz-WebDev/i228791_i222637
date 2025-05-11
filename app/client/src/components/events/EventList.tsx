import { motion } from "framer-motion";
import EventCard from "./EventCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Event } from "@/types/event";

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

const EventList = ({
  events,
  isLoading = false,
  error = null,
  emptyMessage = "No events found.",
}: EventListProps) => {
  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 p-4 rounded-lg text-red-700 my-4"
      >
        <p className="font-medium">Error loading events:</p>
        <p>{error}</p>
      </motion.div>
    );
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-gray-500"
      >
        <p>{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <EventCard key={event._id} event={event} index={index} />
      ))}
    </div>
  );
};

export default EventList;
