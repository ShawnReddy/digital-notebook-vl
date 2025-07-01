import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Phone, Mail, MapPin, Users, MessageSquare, PhoneCall, Calendar, FileText, Loader2, Plus } from 'lucide-react';
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

interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  potentialRevenue: string;
  stage: 'cold' | 'warm' | 'hot';
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

const Prospects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Prospect | null>(null);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  const [researchData, setResearchData] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskPreset, setTaskPreset] = useState<{company: string, person: string} | null>(null);
  const { toast } = useToast();
  
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: '1',
      name: 'Lisa Thompson',
      company: 'Future Tech Inc.',
      email: 'l.thompson@futuretech.com',
      phone: '+1 (555) 234-5678',
      location: 'Seattle, WA',
      potentialRevenue: '$150K',
      stage: 'hot',
      lastContact: '2024-12-29',
      selected: false,
      contacts: [
        {
          id: '1a',
          name: 'Lisa Thompson',
          title: 'VP of Technology',
          email: 'l.thompson@futuretech.com',
          phone: '+1 (555) 234-5678',
          lastContact: '2024-12-29'
        },
        {
          id: '1b',
          name: 'David Kim',
          title: 'CTO',
          email: 'd.kim@futuretech.com',
          phone: '+1 (555) 234-5679',
          lastContact: '2024-12-26'
        }
      ]
    },
    {
      id: '2',
      name: 'Robert Kim',
      company: 'NextGen Solutions',
      email: 'r.kim@nextgen.com',
      phone: '+1 (555) 345-6789',
      location: 'Denver, CO',
      potentialRevenue: '$200K',
      stage: 'warm',
      lastContact: '2024-12-26',
      selected: false,
      contacts: [
        {
          id: '2a',
          name: 'Robert Kim',
          title: 'CEO',
          email: 'r.kim@nextgen.com',
          phone: '+1 (555) 345-6789',
          lastContact: '2024-12-26'
        }
      ]
    },
    {
      id: '3',
      name: 'Amanda Foster',
      company: 'Digital Dynamics',
      email: 'a.foster@digitaldyn.com',
      phone: '+1 (555) 456-7891',
      location: 'Miami, FL',
      potentialRevenue: '$300K',
      stage: 'cold',
      lastContact: '2024-12-15',
      selected: false,
      contacts: [
        {
          id: '3a',
          name: 'Amanda Foster',
          title: 'Operations Director',
          email: 'a.foster@digitaldyn.com',
          phone: '+1 (555) 456-7891',
          lastContact: '2024-12-15'
        },
        {
          id: '3b',
          name: 'Mark Stevens',
          title: 'Business Development',
          email: 'm.stevens@digitaldyn.com',
          phone: '+1 (555) 456-7892',
          lastContact: '2024-12-10'
        }
      ]
    },
    {
      id: '4',
      name: 'James Wilson',
      company: 'Startup Ventures',
      email: 'j.wilson@startupv.com',
      phone: '+1 (555) 567-8901',
      location: 'Boston, MA',
      potentialRevenue: '$180K',
      stage: 'hot',
      lastContact: '2024-12-28',
      selected: false,
      contacts: [
        {
          id: '4a',
          name: 'James Wilson',
          title: 'Founder',
          email: 'j.wilson@startupv.com',
          phone: '+1 (555) 567-8901',
          lastContact: '2024-12-28'
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
        date: '2024-12-29',
        time: '9:15 AM',
        subject: 'Initial Proposal Discussion',
        content: 'Sent initial proposal and pricing information. Prospect showed strong interest in our solution.',
        contact: 'Lisa Thompson'
      },
      {
        id: '2',
        type: 'call',
        date: '2024-12-26',
        time: '3:30 PM',
        subject: 'Discovery Call',
        content: 'Conducted discovery call to understand their current pain points and requirements.',
        contact: 'Lisa Thompson'
      },
      {
        id: '3',
        type: 'meeting',
        date: '2024-12-23',
        time: '1:00 PM',
        subject: 'Product Demo',
        content: 'Delivered comprehensive product demonstration. Positive feedback from technical team.',
        contact: 'Lisa Thompson'
      },
      {
        id: '4',
        type: 'note',
        date: '2024-12-22',
        time: '4:20 PM',
        subject: 'Internal Note',
        content: 'Follow-up scheduled for next week. Decision timeline is Q1 2025. High probability of conversion.',
        contact: 'Internal'
      }
    ];
    return mockHistory;
  };

  const handleProspectSelect = (prospectId: string) => {
    setProspects(prospects.map(prospect => 
      prospect.id === prospectId ? { ...prospect, selected: !prospect.selected } : prospect
    ));
  };

  const handleAddToDashboard = () => {
    const selectedProspects = prospects.filter(p => p.selected);
    if (selectedProspects.length > 0) {
      toast({
        title: "Added to Dashboard",
        description: `${selectedProspects.length} prospect${selectedProspects.length > 1 ? 's' : ''} added to your dashboard.`,
      });
      // Clear selections after adding
      setProspects(prospects.map(prospect => ({ ...prospect, selected: false })));
    }
  };

  const handleProspectClick = (prospect: Prospect) => {
    setSelectedCompany(prospect);
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
      const mockResearchData = `${selectedCompany.company} is an emerging prospect with significant potential for partnership.

Key insights:
• Growing company with expanding market presence
• Actively seeking technology solutions and partnerships
• Strong leadership team with vision for growth
• Current challenges include scaling operations and efficiency
• High potential for conversion with our value proposition

Competitive analysis shows they are evaluating multiple vendors, but our solution offers unique advantages in cost-effectiveness and implementation speed.`;
      
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
    toast({
      title: "Task Created",
      description: `Task has been created and assigned to ${taskData.assignee}`,
    });
    setIsTaskModalOpen(false);
    setTaskPreset(null);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
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

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = statusFilter === 'all' || prospect.stage === statusFilter;
    return matchesSearch && matchesStage;
  });

  const selectedCount = prospects.filter(p => p.selected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prospects</h1>
        <p className="text-gray-600">Track and nurture potential clients through the sales pipeline.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search prospects..."
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
              <label className="text-sm font-medium text-gray-700">Stage:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Prospects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProspects.map((prospect) => (
          <Card 
            key={prospect.id} 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleProspectClick(prospect)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={prospect.selected}
                    onCheckedChange={() => handleProspectSelect(prospect.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <CardTitle className="text-lg font-bold">{prospect.company}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {prospect.contacts.length} contact{prospect.contacts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStageColor(prospect.stage)}`}>
                  {prospect.stage}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {prospect.location}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Potential Revenue</p>
                  <p className="font-semibold text-blue-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {prospect.potentialRevenue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Contact</p>
                  <p className="text-sm font-medium">{new Date(prospect.lastContact).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProspects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No prospects found matching your search.</p>
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

export default Prospects;
