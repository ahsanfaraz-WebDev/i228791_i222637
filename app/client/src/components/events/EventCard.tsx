import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, User } from "lucide-react";
import CategoryBadge from "../ui/CategoryBadge";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  index?: number;
}

const EventCard = ({ event, index = 0 }: EventCardProps) => {
  const formattedDate = format(new Date(event.date), "MMM d, yyyy");

  return (
    <Link to={`/events/${event._id}`} className="block h-full">
      <motion.div
        className="event-card h-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              event.image ||
              `https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`
            }
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <CategoryBadge category={event.category} />
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2 flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-primary-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-600 line-clamp-2 mb-4">{event.description}</p>
          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <User className="h-4 w-4 mr-1" />
              <span>{event.attendees?.length || 0} attending</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default EventCard;
