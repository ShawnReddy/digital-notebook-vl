import React, { useState } from 'react';
import { Search, Filter, Clock, Phone, Mail, MapPin, Users, MessageSquare, PhoneCall, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import BriefModal from '@/components/BriefModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  lastContact: string;
}

interface InteractionHistory {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  date: string;
  time: string;
  subject: string;
  content: string;
  contact: string;
}

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
  contacts: Contact[];
}

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

const InactiveClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [selectedClientForBrief, setSelectedClientForBrief] = useState<Meeting | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<InactiveClient | null>(null);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
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
      selected: false,
      contacts: [
        {
          id: '1a',
          name: 'David Park',
          title: 'Former IT Director',
          email: 'd.park@legacysys.com',
          phone: '+1 (555) 678-9012',
          lastContact: '2024-10-15'
        }
      ]
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
      selected: false,
      contacts: [
        {
          id: '2a',
          name: 'Jennifer Lee',
          title: 'Former Operations Manager',
          email: 'j.lee@sunset-ind.com',
          phone: '+1 (555) 789-0123',
          lastContact: '2024-09-30'
        },
        {
          id: '2b',
          name: 'Tom Wilson',
          title: 'Finance Director',
          email: 't.wilson@sunset-ind.com',
          phone: '+1 (555) 789-0124',
          lastContact: '2024-09-25'
        }
      ]
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
      selected: false,
      contacts: [
        {
          id: '3a',
          name: 'Mark Johnson',
          title: 'Former Director of Operations',
          email: 'm.johnson@consolidated.com',
          phone: '+1 (555) 890-1234',
          lastContact: '2024-08-22'
        }
      ]
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
      selected: false,
      contacts: [
        {
          id: '4a',
          name: 'Patricia White',
          title: 'Former Account Manager',
          email: 'p.white@downtown-v.com',
          phone: '+1 (555) 901-2345',
          lastContact: '2024-11-10'
        }
      ]
    }
  ]);

  // Mock interaction history data - Note: In production, this would come from Compass
  const getInteractionHistory = (contactId: string): InteractionHistory[] => {
    const mockHistory: InteractionHistory[] = [
      {
        id: '1',
        type: 'email',
        date: '2024-10-15',
        time: '2:30 PM',
        subject: 'Contract Non-Renewal Notice',
        content: 'Received formal notice of contract non-renewal. Client cited budget constraints and internal restructuring.',
        contact: 'David Park'
      },
      {
        id: '2',
        type: 'call',
        date: '2024-10-10',
        time: '11:45 AM',
        subject: 'Final Status Call',
        content: 'Attempted to discuss renewal options. Client confirmed decision to discontinue services.',
        contact: 'David Park'
      },
      {
        id: '3',
        type: 'meeting',
        date: '2024-09-28',
        time: '3:00 PM',
        subject: 'Contract Review Meeting',
        content: 'Discussed contract terms and potential modifications. Client expressed concerns about ROI.',
        contact: 'David Park'
      },
      {
        id: '4',
        type: 'note',
        date: '2024-09-25',
        time: '4:15 PM',
        subject: 'Account Status',
        content: 'Client relationship showing signs of strain. Budget pressures evident. Consider retention strategies.',
        contact: 'Internal'
      }
    ];
    return mockHistory;
  };

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
      setInactiveClients(inactiveClients.map(client => ({ ...client, selected: false })));
    }
  };

  const handleClientClick = (client: InactiveClient) => {
    setSelectedCompany(client);
    setIsCompanyModalOpen(true);
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsInteractionModalOpen(true);
  };

  const handleDeepResearch = () => {
    if (selectedCompany) {
      const meetingData: Meeting = {
        id: selectedCompany.id,
        title: `Inactive Client Brief - ${selectedCompany.company}`,
        client: selectedCompany.company,
        time: 'Current',
        type: 'meeting'
      };
      setSelectedClientForBrief(meetingData);
      setIsBriefModalOpen(true);
      setIsCompanyModalOpen(false);
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

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <PhoneCall className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'call': return 'bg-green-50 text-green-700 border-green-200';
      case 'meeting': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'note': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredClients = inactiveClients.filter(client => {
    const matchesSearch = client.company.toLowerCase().includes(searchTerm.toLowerCase());
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
          <Card 
            key={client.id} 
            className="hover:shadow-lg transition-shadow duration-200 border-gray-200 cursor-pointer"
            onClick={() => handleClientClick(client)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={client.selected}
                    onCheckedChange={() => handleClientSelect(client.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-700">{client.company}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {client.contacts.length} contact{client.contacts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getReasonColor(client.reason)}`}>
                  {getReasonText(client.reason)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
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

      {/* Company Details Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedCompany?.company}</DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6">
              <Button onClick={handleDeepResearch} className="w-full bg-blue-600 hover:bg-blue-700">
                Deep Research
              </Button>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company Contacts</h3>
                <p className="text-sm text-gray-500 mb-4">
                  * Contact information displayed here would be populated from Compass based on user selection
                </p>
                <div className="space-y-3">
                  {selectedCompany.contacts.map((contact) => (
                    <Card 
                      key={contact.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleContactClick(contact)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{contact.name}</h4>
                            <p className="text-sm text-gray-600">{contact.title}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {contact.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {contact.phone}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Last Contact</p>
                            <p className="text-sm font-medium">{new Date(contact.lastContact).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Interaction History Modal */}
      <Dialog open={isInteractionModalOpen} onOpenChange={setIsInteractionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Interaction History - {selectedContact?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">{selectedContact.name}</h4>
                <p className="text-sm text-gray-600">{selectedContact.title}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Mail className="w-3 h-3 mr-1" />
                  {selectedContact.email}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Recent Interactions</h3>
                {getInteractionHistory(selectedContact.id).map((interaction) => (
                  <Card key={interaction.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={`px-2 py-1 text-xs ${getInteractionColor(interaction.type)}`}>
                            <div className="flex items-center space-x-1">
                              {getInteractionIcon(interaction.type)}
                              <span className="capitalize">{interaction.type}</span>
                            </div>
                          </Badge>
                          <span className="text-sm font-medium">{interaction.subject}</span>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(interaction.date).toLocaleDateString()}</p>
                          <p>{interaction.time}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{interaction.content}</p>
                      <p className="text-xs text-gray-500 mt-2">Contact: {interaction.contact}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

export default InactiveClients;
