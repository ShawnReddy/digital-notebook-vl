import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { type Task } from '@/data/taskData';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'conference' | 'meeting' | 'webinar' | 'workshop';
  attendees: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  selected: boolean;
}

const Events = () => {
  const { handleTaskSave } = useTaskContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Annual Client Conference',
      date: '2025-02-15',
      time: '9:00 AM - 5:00 PM',
      location: 'Convention Center, New York',
      type: 'conference',
      attendees: 150,
      status: 'upcoming',
      selected: false
    },
    {
      id: '2',
      title: 'Q1 Strategy Meeting',
      date: '2025-01-20',
      time: '2:00 PM - 4:00 PM',
      location: 'Main Office',
      type: 'meeting',
      attendees: 25,
      status: 'upcoming',
      selected: false
    },
    {
      id: '3',
      title: 'Product Demo Webinar',
      date: '2025-01-10',
      time: '1:00 PM - 2:30 PM',
      location: 'Virtual',
      type: 'webinar',
      attendees: 75,
      status: 'upcoming',
      selected: false
    },
    {
      id: '4',
      title: 'Team Training Workshop',
      date: '2024-12-15',
      time: '10:00 AM - 3:00 PM',
      location: 'Training Room A',
      type: 'workshop',
      attendees: 30,
      status: 'completed',
      selected: false
    }
  ]);

  const handleEventSelect = (eventId: string) => {
    setEvents(events => 
      events.map(event => 
        event.id === eventId 
          ? { ...event, selected: !event.selected }
          : event
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conference': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'webinar': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'workshop': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Events</h1>
        <p className="text-sm text-gray-600">Manage company events and meetings.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300"
          />
          <button 
            className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="p-3 bg-gray-100 border border-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm">Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 border border-gray-300"
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-2">
        {filteredEvents.map((event) => (
          <div 
            key={event.id} 
            className="border border-gray-300 p-3"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={event.selected}
                  onChange={() => handleEventSelect(event.id)}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <span className={`px-2 py-1 text-xs ${getTypeColor(event.type)}`}>
                  {event.type}
                </span>
                <span className={`px-2 py-1 text-xs ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Date: {new Date(event.date).toLocaleDateString()}</span>
              <span>Time: {event.time}</span>
              <span>Attendees: {event.attendees}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
