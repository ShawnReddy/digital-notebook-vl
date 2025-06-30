import React, { useState } from 'react';
import { Search, Filter, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface InactiveClient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  lastRevenue: string;
  inactiveSince: string;
  reason: 'contract-ended' | 'non-payment' | 'merger' | 'budget-cuts';
  selected: boolean;
}

const InactiveClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const [inactiveClients, setInactiveClients] = useState<InactiveClient[]>([
    {
      id: '1',
      name: 'David Park',
      company: 'Legacy Systems Corp',
      email: 'd.park@legacysys.com',
      phone: '+1 (555) 678-9012',
      location: 'Portland, OR',
      lastRevenue: '$120K',
      inactiveSince: '2024-10-15',
      reason: 'contract-ended',
      selected: false
    },
    {
      id: '2',
      name: 'Jennifer Lee',
      company: 'Sunset Industries',
      email: 'j.lee@sunset-ind.com',
      phone: '+1 (555) 789-0123',
      location: 'Phoenix, AZ',
      lastRevenue: '$85K',
      inactiveSince: '2024-09-30',
      reason: 'budget-cuts',
      selected: false
    },
    {
      id: '3',
      name: 'Mark Johnson',
      company: 'Consolidated Group',
      email: 'm.johnson@consolidated.com',
      phone: '+1 (555) 890-1234',
      location: 'Detroit, MI',
      lastRevenue: '$200K',
      inactiveSince: '2024-08-22',
      reason: 'merger',
      selected: false
    },
    {
      id: '4',
      name: 'Patricia White',
      company: 'Downtown Ventures',
      email: 'p.white@downtown-v.com',
      phone: '+1 (555) 901-2345',
      location: 'Nashville, TN',
      lastRevenue: '$95K',
      inactiveSince: '2024-11-10',
      reason: 'non-payment',
      selected: false
    }
  ]);

  const handleClientSelect = (clientId: string) => {
    setInactiveClients(inactiveClients.map(client => 
      client.id === clientId ? { ...client, selected: !client.selected } : client
    ));
  };

  const handleReactivate = () => {
    const selectedClients = inactiveClients.filter(c => c.selected);
    if (selectedClients.length > 0) {
      toast({
        title: "Reactivation Started",
        description: `${selectedClients.length} client${selectedClients.length > 1 ? 's' : ''} marked for reactivation.`,
      });
      // Clear selections after reactivating
      setInactiveClients(inactiveClients.map(client => ({ ...client, selected: false })));
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'contract-ended': return 'bg-blue-100 text-blue-800';
      case 'non-payment': return 'bg-red-100 text-red-800';
      case 'merger': return 'bg-purple-100 text-purple-800';
      case 'budget-cuts': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'contract-ended': return 'Contract Ended';
      case 'non-payment': return 'Non-Payment';
      case 'merger': return 'Merger/Acquisition';
      case 'budget-cuts': return 'Budget Cuts';
      default: return reason;
    }
  };

  const filteredClients = inactiveClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason = reasonFilter === 'all' || client.reason === reasonFilter;
    return matchesSearch && matchesReason;
  });

  const selectedCount = inactiveClients.filter(c => c.selected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inactive Clients</h1>
        <p className="text-gray-600">Review past client relationships and identify re-engagement opportunities.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search inactive clients..."
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
              onClick={handleReactivate}
            >
              Reactivate {selectedCount} Client{selectedCount > 1 ? 's' : ''}
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Reason:</label>
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="contract-ended">Contract Ended</SelectItem>
                  <SelectItem value="non-payment">Non-Payment</SelectItem>
                  <SelectItem value="merger">Merger/Acquisition</SelectItem>
                  <SelectItem value="budget-cuts">Budget Cuts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Inactive Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow duration-200 border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={client.selected}
                    onCheckedChange={() => handleClientSelect(client.id)}
                  />
                  <div>
                    <CardTitle className="text-lg text-gray-700">{client.name}</CardTitle>
                    <p className="text-sm text-gray-500">{client.company}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getReasonColor(client.reason)}`}>
                  {getReasonText(client.reason)}
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
                  <p className="text-sm text-gray-500">Last Revenue</p>
                  <p className="font-semibold text-gray-600">{client.lastRevenue}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Inactive Since
                  </p>
                  <p className="text-sm font-medium">{new Date(client.inactiveSince).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No inactive clients found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default InactiveClients;
