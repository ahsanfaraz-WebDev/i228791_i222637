import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/ui/PageHeader';
import EventList from '@/components/events/EventList';
import { PlusCircle, CalendarDays } from 'lucide-react';
import { Event } from '@/types/event';

type DashboardTab = 'hosting' | 'attending' | 'past';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('hosting');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let endpoint = '';
        switch (activeTab) {
          case 'hosting':
            endpoint = '/api/events/created';
            break;
          case 'attending':
            endpoint = '/api/events/attending';
            break;
          case 'past':
            endpoint = '/api/events/past';
            break;
        }

        const response = await axios.get(endpoint);
        setEvents(response.data);
      } catch (err) {
        console.error(`Error fetching ${activeTab} events:`, err);
        setError(`Failed to load your ${activeTab} events.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [activeTab]);

  const tabs = [
    { id: 'hosting', label: 'Events You\'re Hosting' },
    { id: 'attending', label: 'Events You\'re Attending' },
    { id: 'past', label: 'Past Events' },
  ];

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'hosting':
        return "You aren't hosting any events yet. Create your first event!";
      case 'attending':
        return "You haven't joined any upcoming events yet. Explore events to join!";
      case 'past':
        return "You don't have any past events.";
    }
  };

  const getDashboardStats = () => {
    // In a real app, you'd fetch this data from the API
    return {
      upcomingEventsCount: 3,
      pastEventsCount: 5,
      createdEventsCount: 2,
      totalAttendees: 24,
    };
  };

  const stats = getDashboardStats();

  return (
    <>
      <PageHeader 
        title={`Welcome, ${user?.name || 'User'}!`} 
        subtitle="Manage your events and see what's coming up"
        backgroundImage="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <section className="py-12">
        <div className="container-custom">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                label: 'Upcoming Events', 
                value: stats.upcomingEventsCount,
                icon: <CalendarDays className="h-6 w-6 text-primary-500" />,
                bgColor: 'bg-primary-50'
              },
              { 
                label: 'Created Events', 
                value: stats.createdEventsCount,
                icon: <PlusCircle className="h-6 w-6 text-accent-500" />,
                bgColor: 'bg-accent-50'
              },
              { 
                label: 'Past Events', 
                value: stats.pastEventsCount,
                icon: <CalendarDays className="h-6 w-6 text-gray-500" />,
                bgColor: 'bg-gray-50'
              },
              { 
                label: 'Total Attendees', 
                value: stats.totalAttendees,
                icon: <CalendarDays className="h-6 w-6 text-warning-500" />,
                bgColor: 'bg-warning-50'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-lg p-6 shadow-sm`}
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Create Event Button */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Your Events</h2>
            <Link to="/events/create" className="btn-primary flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Event
            </Link>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex overflow-x-auto space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`py-4 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Event List */}
          <EventList 
            events={events} 
            isLoading={isLoading} 
            error={error}
            emptyMessage={getEmptyMessage()}
          />
        </div>
      </section>
    </>
  );
};

export default DashboardPage;