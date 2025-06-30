import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  type: 'conference' | 'webinar' | 'meeting' | 'workshop';
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  selected: boolean;
}

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Q1 Sales Strategy Conference',
      type: 'conference',
      date: '2025-01-15',
      time: '09:00 AM',
      location: 'New York Convention Center',
      attendees: 150,
      description: 'Annual sales strategy planning and team alignment.',
      status: 'upcoming',
      selected: false
    },
    {
      id: '2',
      title: 'Product Demo Webinar',
      type: 'webinar',
      date: '2025-01-05',
      time: '02:00 PM',
      location: 'Virtual - Zoom',
      attendees: 45,
      description: 'Interactive product demonstration for prospects.',
      status: 'upcoming',
      selected: false
    },
    {
      id: '3',
      title: 'Client Success Workshop',
      type: 'workshop',
      date: '2024-12-28',
      time: '10:30 AM',
      location: 'Company HQ - Conference Room A',
      attendees: 25,
      description: 'Best practices for client relationship management.',
      status: 'completed',
      selected: false
    },
    {
      id: '4',
      title: 'Healthcare Industry Summit',
      type: 'conference',
      date: '2025-02-20',
      time: '08:00 AM',
      location: 'Chicago Medical Center',
      attendees: 200,
      description: 'Annual healthcare industry networking event.',
      status: 'upcoming',
      selected: false
    }
  ]);

  const handleEventSelect = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, selected: !event.selected } : event
    ));
  };

  const handleAddToDashboard = () => {
    const selectedEvents = events.filter(e => e.selected);
    if (selectedEvents.length > 0) {
      toast({
        title: "Added to Dashboard",
        description: `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''} added to your dashboard.`,
      });
      // Clear selections after adding
      setEvents(events.map(event => ({ ...event, selected: false })));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conference': return '🏢';
      case 'webinar': return '💻';
      case 'meeting': return '🤝';
      case 'workshop': return '📚';
      default: return '📅';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const selectedCount = events.filter(e => e.selected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
        <p className="text-gray-600">Track conferences, meetings, and networking events.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          {selectedCount > 0 && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddToDashboard}
            >
              Add {selectedCount} to Dashboard
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={event.selected}
                    onCheckedChange={() => handleEventSelect(event.id)}
                  />
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <span className="text-xl mr-2">{getTypeIcon(event.type)}</span>
                      {event.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 capitalize">{event.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                  {event.status.replace('-', ' ')}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {event.attendees} attendees
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
