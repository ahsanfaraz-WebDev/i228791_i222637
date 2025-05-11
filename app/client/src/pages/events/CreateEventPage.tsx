import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import PageHeader from "@/components/ui/PageHeader";
import EventForm from "@/components/events/EventForm";
import { EventFormData } from "@/types/event";

const CreateEventPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/events", data);
      toast.success("Event created successfully!");
      navigate(`/events/${response.data._id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Create a New Event" 
        subtitle="Share your ideas with the community and bring people together."
        backgroundImage="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <section className="py-12">
        <div className="container-custom max-w-3xl">
          <Link
            to="/events"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CreateEventPage;
