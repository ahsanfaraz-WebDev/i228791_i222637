import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CategoryBadge from "@/components/ui/CategoryBadge";
import {
  MapPin,
  Calendar,
  User,
  Edit,
  Trash2,
  ArrowLeft,
  Bookmark,
  Check,
} from "lucide-react";
import { Event } from "@/types/event";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleJoinEvent = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }

    try {
      setIsJoining(true);
      await axios.post(`/api/events/${id}/join`);

      // Update local state
      setEvent((prev) => {
        if (!prev) return null;

        const isAlreadyJoined = prev.attendees?.some(
          (attendee) => attendee._id === user._id
        );

        if (isAlreadyJoined) {
          toast.error("You have already joined this event.");
          return prev;
        }

        const newAttendees = [
          ...(prev.attendees || []),
          { _id: user._id, name: user.name },
        ];

        toast.success("You have successfully joined this event!");
        return { ...prev, attendees: newAttendees };
      });
    } catch (err) {
      console.error("Error joining event:", err);
      toast.error("Failed to join event. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(`/api/events/${id}`);
      toast.success("Event deleted successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Failed to delete event. Please try again.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
          <p className="font-medium">Error:</p>
          <p>{error || "Event not found"}</p>
        </div>
        <Link to="/events" className="btn-secondary inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </div>
    );
  }

  const formattedDate = format(new Date(event.date), "EEEE, MMMM d, yyyy");

  // Add console logs to debug the user and creator IDs
  console.log("Current user ID:", user?._id);
  console.log("Event creator ID:", event.creator?._id);
  console.log("Event creator (full):", event.creator);

  // Fix the isCreator logic by comparing string representations of IDs
  const isCreator =
    user &&
    event.creator &&
    (user._id === event.creator._id ||
      user._id.toString() === event.creator._id.toString());
  const hasJoined =
    user && event.attendees?.some((attendee) => attendee._id === user._id);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero image */}
      <div
        className="h-80 md:h-96 relative bg-gray-900"
        style={{
          backgroundImage: `url(${
            event.image ||
            "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="container-custom">
            <Link
              to="/events"
              className="inline-flex items-center text-white hover:text-primary-300 transition-colors mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
            <CategoryBadge category={event.category} />
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-2 text-white">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-200">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-1" />
                <span>Hosted by {event.creator?.name || "Anonymous"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-8 relative">
          {/* Event details */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-4">About the Event</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {event.description}
              </p>

              {isCreator && (
                <div className="mt-8 flex gap-4">
                  <Link
                    to={`/events/${event._id}/edit`}
                    className="btn-primary inline-flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
                  </Link>
                  <button
                    onClick={handleDeleteEvent}
                    disabled={isDeleting}
                    className="btn-secondary bg-red-50 text-red-600 border-red-200 hover:bg-red-100 inline-flex items-center"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-t-2 border-b-2 border-red-600 rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Event
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Event actions and attendees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-gray-600">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Organizer</p>
                      <p className="text-gray-600">
                        {event.creator?.name || "Anonymous"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!isCreator && (
                <button
                  onClick={handleJoinEvent}
                  disabled={!!(isJoining || hasJoined)}
                  className={`w-full font-medium ${
                    hasJoined
                      ? "bg-green-100 text-green-700 flex items-center justify-center p-2 rounded-lg"
                      : "btn-primary"
                  }`}
                >
                  {isJoining ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      Joining...
                    </div>
                  ) : hasJoined ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      You're attending this event
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-5 w-5" />
                      Join this event
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Attendees</h3>
                <span className="bg-gray-100 text-gray-700 py-1 px-2 rounded-full text-sm">
                  {event.attendees?.length || 0} people
                </span>
              </div>

              {event.attendees && event.attendees.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {event.attendees.map((attendee) => (
                    <li key={attendee._id} className="py-3 flex items-center">
                      <div className="bg-primary-100 rounded-full h-10 w-10 flex items-center justify-center text-primary-600 font-semibold mr-3">
                        {attendee.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{attendee.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-3">
                  No one has joined this event yet. Be the first!
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
