import React, { useState } from 'react';
import { Search, Filter, Star, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import BriefModal from '@/components/BriefModal';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  revenue: string;
  status: 'active' | 'at-risk' | 'growing';
  lastContact: string;
  selected: boolean;
}

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [selectedClientForBrief, setSelectedClientForBrief] = useState<Meeting | null>(null);
  const { toast } = useToast();
  
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Anderson',
      company: 'ABC Corporation',
      email: 'j.anderson@abc-corp.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      revenue: '$250K',
      status: 'active',
      lastContact: '2024-12-28',
      selected: false
    },
    {
      id: '2',
      name: 'Sarah Mitchell',
      company: 'TechStart Solutions',
      email: 's.mitchell@techstart.com',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
      revenue: '$180K',
      status: 'growing',
      lastContact: '2024-12-27',
      selected: false
    },
    {
      id: '3',
      name: 'Michael Chen',
      company: 'Global Industries',
      email: 'm.chen@global-ind.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      revenue: '$420K',
      status: 'at-risk',
      lastContact: '2024-12-20',
      selected: false
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      company: 'Innovation Labs',
      email: 'e.rodriguez@innolabs.com',
      phone: '+1 (555) 321-0987',
      location: 'Austin, TX',
      revenue: '$320K',
      status: 'active',
      lastContact: '2024-12-29',
      selected: false
    }
  ]);

  const handleClientSelect = (clientId: string) => {
    setClients(clients.map(client => 
      client.id === clientId ? { ...client, selected: !client.selected } : client
    ));
  };

  const handleAddToDashboard = () => {
    const selectedClients = clients.filter(c => c.selected);
    if (selectedClients.length > 0) {
      toast({
        title: "Added to Dashboard",
        description: `${selectedClients.length} client${selectedClients.length > 1 ? 's' : ''} added to your dashboard.`,
      });
      // Clear selections after adding
      setClients(clients.map(client => ({ ...client, selected: false })));
    }
  };

  const handleClientClick = (client: Client) => {
    // Convert client data to meeting format for the brief modal
    const meetingData: Meeting = {
      id: client.id,
      title: `Client Brief - ${client.name}`,
      client: client.company,
      time: 'Current',
      type: 'meeting'
    };
    setSelectedClientForBrief(meetingData);
    setIsBriefModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'growing': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCount = clients.filter(c => c.selected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Clients</h1>
        <p className="text-gray-600">Manage your active client relationships and track engagement.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search clients..."
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
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="growing">Growing</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card 
            key={client.id} 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleClientClick(client)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={client.selected}
                    onCheckedChange={(e) => {
                      e.stopPropagation();
                      handleClientSelect(client.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <p className="text-sm text-gray-600">{client.company}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {client.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {client.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {client.location}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Annual Revenue</p>
                  <p className="font-semibold text-green-600">{client.revenue}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Contact</p>
                  <p className="text-sm font-medium">{new Date(client.lastContact).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No clients found matching your search.</p>
        </div>
      )}

      <BriefModal
        isOpen={isBriefModalOpen}
        onClose={() => {
          setIsBriefModalOpen(false);
          setSelectedClientForBrief(null);
        }}
        meeting={selectedClientForBrief}
      />
    </div>
  );
};

export default Clients;
