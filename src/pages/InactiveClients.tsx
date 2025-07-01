import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Phone, Mail, MapPin, Users, MessageSquare, PhoneCall, Calendar, FileText, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import TaskModal from '@/components/TaskModal';
import { useTaskContext } from '@/contexts/TaskContext';
import { type Task } from '@/data/taskData';

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
  industry: string;
  email: string;
  phone: string;
  location: string;
  lastEngagement: string;
  reasonInactive: string;
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
  const { handleTaskSave } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<InactiveClient | null>(null);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  const [researchData, setResearchData] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskPreset, setTaskPreset] = useState<{company: string, person: string} | null>(null);
  const { toast } = useToast();
  
  const [inactiveClients, setInactiveClients] = useState<InactiveClient[]>([
    {
      id: '1',
      name: 'Acme Corp',
      industry: 'Manufacturing',
      email: 'info@acme.com',
      phone: '+1 (555) 111-2222',
      location: 'Los Angeles, CA',
      lastEngagement: '2023-05-15',
      reasonInactive: 'Budget cuts',
      selected: false,
      contacts: [
        {
          id: '1a',
          name: 'John Doe',
          title: 'CEO',
          email: 'john.doe@acme.com',
          phone: '+1 (555) 111-2222',
          lastContact: '2023-05-15'
        },
        {
          id: '1b',
          name: 'Jane Smith',
          title: 'CFO',
          email: 'jane.smith@acme.com',
          phone: '+1 (555) 111-2223',
          lastContact: '2023-05-10'
        }
      ]
    },
    {
      id: '2',
      name: 'Beta Industries',
      industry: 'Technology',
      email: 'contact@beta.com',
      phone: '+1 (555) 333-4444',
      location: 'San Francisco, CA',
      lastEngagement: '2023-08-20',
      reasonInactive: 'Switched to competitor',
      selected: false,
      contacts: [
        {
          id: '2a',
          name: 'Alice Johnson',
          title: 'CTO',
          email: 'alice.johnson@beta.com',
          phone: '+1 (555) 333-4444',
          lastContact: '2023-08-20'
        }
      ]
    },
    {
      id: '3',
      name: 'Gamma Solutions',
      industry: 'Consulting',
      email: 'info@gamma.com',
      phone: '+1 (555) 555-6666',
      location: 'New York, NY',
      lastEngagement: '2023-11-01',
      reasonInactive: 'Project completed',
      selected: false,
      contacts: [
        {
          id: '3a',
          name: 'Bob Williams',
          title: 'Project Manager',
          email: 'bob.williams@gamma.com',
          phone: '+1 (555) 555-6666',
          lastContact: '2023-11-01'
        },
        {
          id: '3b',
          name: 'Charlie Brown',
          title: 'Consultant',
          email: 'charlie.brown@gamma.com',
          phone: '+1 (555) 555-6667',
          lastContact: '2023-10-25'
        }
      ]
    },
    {
      id: '4',
      name: 'Delta Corp',
      industry: 'Finance',
      email: 'info@delta.com',
      phone: '+1 (555) 777-8888',
      location: 'Chicago, IL',
      lastEngagement: '2024-01-10',
      reasonInactive: 'Reorganization',
      selected: false,
      contacts: [
        {
          id: '4a',
          name: 'Eve Davis',
          title: 'Finance Director',
          email: 'eve.davis@delta.com',
          phone: '+1 (555) 777-8888',
          lastContact: '2024-01-10'
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
        date: '2023-05-15',
        time: '9:00 AM',
        subject: 'Initial Contact',
        content: 'Initial email sent to introduce our services.',
        contact: 'John Doe'
      },
      {
        id: '2',
        type: 'call',
        date: '2023-05-10',
        time: '2:00 PM',
        subject: 'Follow-up Call',
        content: 'Follow-up call to discuss potential partnership.',
        contact: 'Jane Smith'
      },
      {
        id: '3',
        type: 'note',
        date: '2023-05-01',
        time: '4:00 PM',
        subject: 'Internal Note',
        content: 'Client expressed interest but cited budget constraints.',
        contact: 'Internal'
      }
    ];
    return mockHistory;
  };

  const handleAddTask = (contact: Contact, company: string) => {
    setTaskPreset({
      company: company,
      person: contact.name
    });
    setIsTaskModalOpen(true);
  };

  const onTaskSave = (taskData: Omit<Task, 'id'>) => {
    handleTaskSave(taskData);
    toast({
      title: "Task Created",
      description: `Task has been created and assigned to ${taskData.assignee}`,
    });
    setIsTaskModalOpen(false);
    setTaskPreset(null);
  };

  const handleClientSelect = (clientId: string) => {
    setInactiveClients(inactiveClients.map(client => 
      client.id === clientId ? { ...client, selected: !client.selected } : client
    ));
  };

  const handleReactivateClients = () => {
    const selectedClients = inactiveClients.filter(c => c.selected);
    if (selectedClients.length > 0) {
      toast({
        title: "Clients Reactivated",
        description: `${selectedClients.length} client${selectedClients.length > 1 ? 's' : ''} have been marked for reactivation.`,
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
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.reasonInactive === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCount = inactiveClients.filter(c => c.selected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inactive Clients</h1>
        <p className="text-gray-600">Re-engage with clients who have previously been inactive.</p>
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
              onClick={handleReactivateClients}
            >
              Mark {selectedCount} for Reactivation
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Reason Inactive:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Reasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="Budget cuts">Budget cuts</SelectItem>
                  <SelectItem value="Switched to competitor">Switched to competitor</SelectItem>
                  <SelectItem value="Project completed">Project completed</SelectItem>
                  <SelectItem value="Reorganization">Reorganization</SelectItem>
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
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
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
                    <CardTitle className="text-lg font-bold">{client.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {client.contacts.length} contact{client.contacts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Inactive
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {client.location}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-semibold">{client.industry}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Engagement</p>
                  <p className="text-sm font-medium">{new Date(client.lastEngagement).toLocaleDateString()}</p>
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
            <DialogTitle className="text-2xl font-bold">{selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6">
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
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>Interaction History - {selectedContact?.name}</span>
              {selectedContact && selectedCompany && (
                <Button
                  onClick={() => handleAddTask(selectedContact, selectedCompany.name)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
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

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskPreset(null);
        }}
        onSave={onTaskSave}
        task={null}
        preset={taskPreset}
      />
    </div>
  );
};

export default InactiveClients;
