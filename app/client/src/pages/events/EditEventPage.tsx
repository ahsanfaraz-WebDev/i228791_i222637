import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/ui/PageHeader";
import EventForm from "@/components/events/EventForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Event, EventFormData } from "@/types/event";

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);

        // Add debug logs
        console.log("Edit page - User ID:", user?._id);
        console.log(
          "Edit page - Event creator ID:",
          response.data.creator?._id
        );

        // Check if user is the creator using string comparison
        const userIsCreator =
          user &&
          response.data.creator &&
          (user._id === response.data.creator._id ||
            user._id.toString() === response.data.creator._id.toString());

        if (!userIsCreator) {
          setError("You do not have permission to edit this event.");
        }
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
  }, [id, user]);

  const handleSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      await axios.put(`/api/events/${id}`, data);
      toast.success("Event updated successfully!");
      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event. Please try again.");
      setIsSubmitting(false);
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

  return (
    <>
      <PageHeader
        title="Edit Event"
        subtitle="Update your event details and keep your attendees informed."
        backgroundImage="https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />

      <section className="py-12">
        <div className="container-custom max-w-3xl">
          <Link
            to={`/events/${id}`}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Link>

          <EventForm
            initialData={event}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </section>
    </>
  );
};

export default EditEventPage;
