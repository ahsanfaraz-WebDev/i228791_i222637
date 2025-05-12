import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Search, MapPin, ArrowRight, Users } from "lucide-react";
import axios from "axios";
import { Event } from "../types/event";
import EventList from "../components/events/EventList";

const featuredCategories = [
  {
    name: "Workshops",
    image:
      "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/events?category=workshop",
  },
  {
    name: "Charity Events",
    image:
      "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/events?category=charity",
  },
  {
    name: "Social Gatherings",
    image:
      "https://images.pexels.com/photos/5082976/pexels-photo-5082976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/events?category=social",
  },
  {
    name: "Networking",
    image:
      "https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "/events?category=networking",
  },
];

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setIsLoading(true);
        // Only fetch a few upcoming events for the homepage
        const response = await axios.get("/api/events?limit=3");
        // Ensure data is always an array
        const eventsData = Array.isArray(response.data) ? response.data : [];
        setUpcomingEvents(eventsData);
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setError("Failed to load upcoming events.");
        // Initialize with empty array on error
        setUpcomingEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>

        <div className="container-custom relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Discover and Create Memorable Community Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Connect with like-minded people, join events that matter to you,
              and create unforgettable experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events" className="btn-primary text-lg px-8 py-3">
                Browse Events
              </Link>
              <Link
                to="/register"
                className="btn-secondary text-lg px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-transparent"
              >
                Sign Up Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-lg p-6 -mt-24 relative z-20">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Find Events Near You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="input pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="input pl-10"
                />
              </div>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="date" className="input pl-10" />
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link to="/events" className="btn-primary px-8">
                Search Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover events based on your interests and passions. From
              workshops to charity events, find what matters to you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(featuredCategories) &&
              featuredCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative rounded-lg overflow-hidden shadow-md group h-64"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-semibold mb-2">
                      {category.name}
                    </h3>
                    <Link
                      to={category.url}
                      className="inline-flex items-center text-white hover:text-primary-300 transition-colors"
                    >
                      <span>View events</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-gray-600">
                Don't miss out on these exciting upcoming events
              </p>
            </div>
            <Link to="/events" className="btn-secondary flex items-center">
              <span>View all</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <EventList
            events={upcomingEvents}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-gradient-to-br from-primary-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              GatherSpace makes it easy to discover, join, and create community
              events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray([
              {
                icon: <Search className="h-10 w-10 text-primary-600" />,
                title: "Discover Events",
                description:
                  "Browse and filter events based on your interests, location, and availability.",
              },
              {
                icon: <CalendarDays className="h-10 w-10 text-primary-600" />,
                title: "Create Events",
                description:
                  "Easily create and manage your own events, invite others, and grow your community.",
              },
              {
                icon: <Users className="h-10 w-10 text-primary-600" />,
                title: "Join & Connect",
                description:
                  "Join events with just a click, engage with other attendees, and expand your network.",
              },
            ]) &&
              [
                {
                  icon: <Search className="h-10 w-10 text-primary-600" />,
                  title: "Discover Events",
                  description:
                    "Browse and filter events based on your interests, location, and availability.",
                },
                {
                  icon: <CalendarDays className="h-10 w-10 text-primary-600" />,
                  title: "Create Events",
                  description:
                    "Easily create and manage your own events, invite others, and grow your community.",
                },
                {
                  icon: <Users className="h-10 w-10 text-primary-600" />,
                  title: "Join & Connect",
                  description:
                    "Join events with just a click, engage with other attendees, and expand your network.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-sm text-center"
                >
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Host Your Own Event?
              </h2>
              <p className="text-xl opacity-90 mb-6">
                Create memorable experiences for your community. Get started in
                minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3"
                >
                  Create an Account
                </Link>
                <Link
                  to="/events"
                  className="btn border border-white text-white hover:bg-white/10 px-8 py-3"
                >
                  Browse Events
                </Link>
              </div>
            </div>
            <div className="lg:w-1/3 flex justify-center">
              <CalendarDays className="h-48 w-48 text-white opacity-20" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
