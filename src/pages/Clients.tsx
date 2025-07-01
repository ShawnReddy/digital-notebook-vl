import React, { useState } from 'react';
import { Search, Filter, Star, Phone, Mail, MapPin, Users, MessageSquare, PhoneCall, Calendar, FileText, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import TaskModal from '@/components/TaskModal';

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
  contacts: Contact[];
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
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Client | null>(null);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  const [researchData, setResearchData] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskPreset, setTaskPreset] = useState<{company: string, person: string} | null>(null);
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
      selected: false,
      contacts: [
        {
          id: '1a',
          name: 'John Anderson',
          title: 'CEO',
          email: 'j.anderson@abc-corp.com',
          phone: '+1 (555) 123-4567',
          lastContact: '2024-12-28'
        },
        {
          id: '1b',
          name: 'Sarah Johnson',
          title: 'CFO',
          email: 's.johnson@abc-corp.com',
          phone: '+1 (555) 123-4568',
          lastContact: '2024-12-25'
        }
      ]
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
      selected: false,
      contacts: [
        {
          id: '2a',
          name: 'Sarah Mitchell',
          title: 'Founder & CTO',
          email: 's.mitchell@techstart.com',
          phone: '+1 (555) 987-6543',
          lastContact: '2024-12-27'
        },
        {
          id: '2b',
          name: 'Mike Chen',
          title: 'VP of Engineering',
          email: 'm.chen@techstart.com',
          phone: '+1 (555) 987-6544',
          lastContact: '2024-12-20'
        }
      ]
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
      selected: false,
      contacts: [
        {
          id: '3a',
          name: 'Michael Chen',
          title: 'Director of Operations',
          email: 'm.chen@global-ind.com',
          phone: '+1 (555) 456-7890',
          lastContact: '2024-12-20'
        }
      ]
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
      selected: false,
      contacts: [
        {
          id: '4a',
          name: 'Emily Rodriguez',
          title: 'Research Director',
          email: 'e.rodriguez@innolabs.com',
          phone: '+1 (555) 321-0987',
          lastContact: '2024-12-29'
        },
        {
          id: '4b',
          name: 'James Wilson',
          title: 'Lab Manager',
          email: 'j.wilson@innolabs.com',
          phone: '+1 (555) 321-0988',
          lastContact: '2024-12-26'
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
        date: '2024-12-28',
        time: '10:30 AM',
        subject: 'Q4 Contract Renewal Discussion',
        content: 'Discussed renewal terms and pricing for Q1 2025. Client is interested in expanding scope.',
        contact: 'John Anderson'
      },
      {
        id: '2',
        type: 'call',
        date: '2024-12-25',
        time: '2:15 PM',
        subject: 'Follow-up on Implementation',
        content: 'Called to check on system implementation progress. Minor technical issues resolved.',
        contact: 'John Anderson'
      },
      {
        id: '3',
        type: 'meeting',
        date: '2024-12-22',
        time: '11:00 AM',
        subject: 'Quarterly Business Review',
        content: 'Reviewed performance metrics and discussed future roadmap. Very positive feedback.',
        contact: 'John Anderson'
      },
      {
        id: '4',
        type: 'note',
        date: '2024-12-20',
        time: '3:45 PM',
        subject: 'Internal Note',
        content: 'Client mentioned potential budget increase for next quarter. Good opportunity for upsell.',
        contact: 'Internal'
      }
    ];
    return mockHistory;
  };

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
      setClients(clients.map(client => ({ ...client, selected: false })));
    }
  };

  const handleClientClick = (client: Client) => {
    setSelectedCompany(client);
    setIsCompanyModalOpen(true);
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsInteractionModalOpen(true);
  };

  const handleDeepResearch = async () => {
    if (!selectedCompany) return;
    
    setIsResearching(true);
    setResearchData(null);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResearchData = `${selectedCompany.company} is a leading company in their industry with strong market presence and growth potential.

Key insights:
• Established company with solid financial foundation
• Currently expanding their operations
• Looking for strategic partnerships and technology solutions
• Strong leadership team with industry experience
• Recent growth in revenue and market share

Our analysis shows they are an ideal client for our services with high potential for long-term partnership and account growth.`;
      
      setResearchData(mockResearchData);
      setIsResearching(false);
    }, 2000);
  };

  const handleAddTask = (contact: Contact, company: string) => {
    setTaskPreset({
      company: company,
      person: contact.name
    });
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (taskData: any) => {
    // This would integrate with your existing task management system
    toast({
      title: "Task Created",
      description: `Task has been created and assigned to ${taskData.assignee}`,
    });
    setIsTaskModalOpen(false);
    setTaskPreset(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'growing': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.company.toLowerCase().includes(searchTerm.toLowerCase());
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
                    onCheckedChange={() => handleClientSelect(client.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <CardTitle className="text-lg font-bold">{client.company}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {client.contacts.length} contact{client.contacts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(client.status)}`}>
                  {client.status}
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

      {/* Company Details Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedCompany?.company}</DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6">
              {/* Deep Research Section */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center justify-between">
                    <span className="flex items-center">
                      <Search className="w-5 h-5 mr-2 text-blue-600" />
                      Company Intelligence
                    </span>
                    <Button
                      onClick={handleDeepResearch}
                      disabled={isResearching}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isResearching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sage AI is fetching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Deep Research
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {researchData ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-white/70 p-4 rounded-lg border border-blue-200">
                        <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
                          {researchData}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 italic">
                      Click "Deep Research" to get AI-powered insights about {selectedCompany.company}
                    </p>
                  )}
                </CardContent>
              </Card>
              
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
                  onClick={() => handleAddTask(selectedContact, selectedCompany.company)}
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
        onSave={handleTaskSave}
        task={null}
        preset={taskPreset}
      />
    </div>
  );
};

export default Clients;
