import { useForm, SubmitHandler } from "react-hook-form";
import { Calendar, MapPin, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Event, EventFormData } from "@/types/event";

interface EventFormProps {
  initialData?: Partial<Event>;
  onSubmit: SubmitHandler<EventFormData>;
  isSubmitting: boolean;
}

const categories = [
  { value: "workshop", label: "Workshop" },
  { value: "charity", label: "Charity" },
  { value: "social", label: "Social" },
  { value: "networking", label: "Networking" },
  { value: "conference", label: "Conference" },
  { value: "other", label: "Other" },
];

const EventForm = ({
  initialData = {},
  onSubmit,
  isSubmitting,
}: EventFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      date: initialData.date
        ? new Date(initialData.date).toISOString().split("T")[0]
        : "",
      location: initialData.location || "",
      category: initialData.category || "social",
      image: initialData.image || "",
    },
  });

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Event Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title", { required: "Title is required" })}
          className="input"
          placeholder="Enter event title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description", { required: "Description is required" })}
          className="input"
          placeholder="Describe your event"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="date"
            className="text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Date
          </label>
          <input
            id="date"
            type="date"
            {...register("date", { required: "Date is required" })}
            className="input"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="location"
            className="text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register("location", { required: "Location is required" })}
            className="input"
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            <Tag className="h-4 w-4 mr-1" />
            Category
          </label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
            className="input"
          >
            {Array.isArray(categories) &&
              categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image URL (Optional)
          </label>
          <input
            id="image"
            type="text"
            {...register("image")}
            className="input"
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
              {initialData._id ? "Updating Event..." : "Creating Event..."}
            </div>
          ) : (
            <>{initialData._id ? "Update Event" : "Create Event"}</>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default EventForm;
