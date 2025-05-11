import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import EventList from "@/components/events/EventList";
import { Tag, MapPin, CalendarDays, X } from "lucide-react";
import { Event } from "@/types/event";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "workshop", label: "Workshops" },
  { value: "charity", label: "Charity" },
  { value: "social", label: "Social" },
  { value: "networking", label: "Networking" },
  { value: "conference", label: "Conference" },
  { value: "other", label: "Other" },
];

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [location, setLocation] = useState<string>(
    searchParams.get("location") || ""
  );
  const [date, setDate] = useState<string>(searchParams.get("date") || "");
  const [search, setSearch] = useState<string>(
    searchParams.get("search") || ""
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    if (search) params.set("search", search);

    setSearchParams(params);
  }, [category, location, date, search, setSearchParams]);

  // Fetch events based on filters
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Construct query params
        const params = new URLSearchParams();
        if (category && category !== "all") params.append("category", category);
        if (location) params.append("location", location);
        if (date) params.append("date", date);
        if (search) params.append("search", search);

        const response = await axios.get(`/api/events?${params.toString()}`);
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [category, location, date, search]);

  const clearFilters = () => {
    setCategory("all");
    setLocation("");
    setDate("");
    setSearch("");
    setSearchParams({});
  };

  const activeFiltersCount = [
    category !== "all" ? 1 : 0,
    location ? 1 : 0,
    date ? 1 : 0,
    search ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <>
      <PageHeader
        title="Explore Events"
        subtitle="Discover and join events in your community"
      />

      <section className="py-12">
        <div className="container-custom">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or location"
                  className="input"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events..."
                  className="input"
                />
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-600 mr-2">
                  Active filters:
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    Clear all filters
                    <X className="h-3 w-3 ml-1" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results count */}
          {!isLoading && !error && (
            <div className="mb-6">
              <p className="text-gray-600">
                {events.length === 0
                  ? "No events found"
                  : `Showing ${events.length} ${
                      events.length === 1 ? "event" : "events"
                    }`}
              </p>
            </div>
          )}

          {/* Events list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EventList
              events={events}
              isLoading={isLoading}
              error={error}
              emptyMessage={
                activeFiltersCount > 0
                  ? "No events match your filters. Try adjusting your search criteria."
                  : "No events found. Check back later or create your own event!"
              }
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default EventsPage;
