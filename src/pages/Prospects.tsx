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
  const { handleTaskSave } = useTaskContext();
  
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

  const onTaskSave = (taskData: Omit<Task, 'id'>) => {
    handleTaskSave(taskData);
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
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Prospects</h1>
        <p className="text-sm text-gray-600">Track potential clients and manage your sales pipeline.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search prospects..."
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
          {selectedCount > 0 && (
            <button 
              className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleAddToDashboard}
            >
              Add {selectedCount} to Dashboard
            </button>
          )}
        </div>

        {showFilters && (
          <div className="p-3 bg-gray-100 border border-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm">Stage:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 border border-gray-300"
              >
                <option value="all">All</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Prospects List */}
      <div className="space-y-2">
        {filteredProspects.map((prospect) => (
          <div 
            key={prospect.id} 
            className="border border-gray-300 p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => handleProspectClick(prospect)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={prospect.selected}
                  onChange={() => handleProspectSelect(prospect.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{prospect.company}</h3>
                  <p className="text-sm text-gray-600">{prospect.location}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs ${getStageColor(prospect.stage)}`}>
                {prospect.stage}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Potential Revenue: {prospect.potentialRevenue}</span>
              <span>Last Contact: {new Date(prospect.lastContact).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredProspects.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No prospects found matching your search.</p>
        </div>
      )}

      {/* Company Details Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{selectedCompany?.company}</DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-4">
              {/* Deep Research Section */}
              <div className="border border-gray-300 p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Company Intelligence</h3>
                  <button
                    onClick={handleDeepResearch}
                    disabled={isResearching}
                    className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isResearching ? 'Loading...' : 'Deep Research'}
                  </button>
                </div>
                <div>
                  {researchData ? (
                    <div className="bg-gray-100 p-3 border border-gray-300">
                      <pre className="whitespace-pre-wrap text-sm">
                        {researchData}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Click "Deep Research" to get insights about {selectedCompany.company}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Company Contacts</h3>
                <p className="text-sm text-gray-500 mb-2">
                  * Contact information would be populated from Compass
                </p>
                <div className="space-y-2">
                  {selectedCompany.contacts.map((contact) => (
                    <div 
                      key={contact.id}
                      className="border border-gray-300 p-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleContactClick(contact)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.title}</p>
                          <p className="text-sm text-gray-500">{contact.email}</p>
                          <p className="text-sm text-gray-500">{contact.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Last Contact</p>
                          <p className="text-sm">{new Date(contact.lastContact).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Interaction History Modal */}
      <Dialog open={isInteractionModalOpen} onOpenChange={setIsInteractionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex justify-between items-center">
              <span>Interaction History - {selectedContact?.name}</span>
              {selectedContact && selectedCompany && (
                <button
                  onClick={() => handleAddTask(selectedContact, selectedCompany.company)}
                  className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Task
                </button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-3">
              <div className="bg-gray-100 p-3 border border-gray-300">
                <h4 className="font-semibold">{selectedContact.name}</h4>
                <p className="text-sm text-gray-600">{selectedContact.title}</p>
                <p className="text-sm text-gray-500">{selectedContact.email}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Recent Interactions</h3>
                <div className="space-y-2">
                  {getInteractionHistory(selectedContact.id).map((interaction) => (
                    <div key={interaction.id} className="border border-gray-300 p-2">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className={`px-2 py-1 text-xs ${getInteractionColor(interaction.type)}`}>
                            {interaction.type}
                          </span>
                          <span className="text-sm font-medium ml-2">{interaction.subject}</span>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(interaction.date).toLocaleDateString()}</p>
                          <p>{interaction.time}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{interaction.content}</p>
                    </div>
                  ))}
                </div>
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

export default Prospects;
