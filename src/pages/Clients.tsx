import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const { handleTaskSave: saveTaskToManager } = useTaskContext();
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
      alert(`${selectedClients.length} client${selectedClients.length > 1 ? 's' : ''} added to your dashboard.`);
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

  const handleTaskSave = (taskData: Omit<Task, 'id'>) => {
    // Save to the global task management system
    saveTaskToManager(taskData);
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
      case 'email': return '📧';
      case 'call': return '📞';
      case 'meeting': return '📅';
      case 'note': return '📝';
      default: return '💬';
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
    <div>
      <h1 className="text-xl font-bold mb-4">Active Clients</h1>

      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300"
          />
          <button 
            className="px-2 py-1 border border-gray-300"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </button>
          {selectedCount > 0 && (
            <button 
              className="px-2 py-1 bg-blue-600 text-white"
              onClick={handleAddToDashboard}
            >
              Add {selectedCount} to Dashboard
            </button>
          )}
        </div>

        {showFilters && (
          <div className="p-2 bg-gray-100 border border-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm">Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 border border-gray-300"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="growing">Growing</option>
                <option value="at-risk">At Risk</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {filteredClients.map((client) => (
          <div 
            key={client.id} 
            className="border border-gray-300 p-2 cursor-pointer"
            onClick={() => handleClientClick(client)}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={client.selected}
                  onChange={() => handleClientSelect(client.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <div className="font-semibold text-sm">{client.company}</div>
                  <div className="text-xs text-gray-600">{client.location}</div>
                </div>
              </div>
              <span className="text-xs">{client.status}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Revenue: {client.revenue}</span>
              <span>Last Contact: {new Date(client.lastContact).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No clients found.</p>
        </div>
      )}

      {/* Company Details Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{selectedCompany?.company}</DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-3">
              <div className="border border-gray-300 p-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm">Company Intelligence</h3>
                  <button
                    onClick={handleDeepResearch}
                    disabled={isResearching}
                    className="px-2 py-1 bg-blue-600 text-white text-xs"
                  >
                    {isResearching ? 'Loading...' : 'Deep Research'}
                  </button>
                </div>
                <div>
                  {researchData ? (
                    <div className="bg-gray-100 p-2 border border-gray-300">
                      <pre className="whitespace-pre-wrap text-xs">
                        {researchData}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600">
                      Click "Deep Research" to get insights about {selectedCompany.company}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-sm mb-2">Company Contacts</h3>
                <div className="space-y-1">
                  {selectedCompany.contacts.map((contact) => (
                    <div 
                      key={contact.id}
                      className="border border-gray-300 p-2 cursor-pointer"
                      onClick={() => handleContactClick(contact)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{contact.name}</div>
                          <div className="text-xs text-gray-600">{contact.title}</div>
                          <div className="text-xs text-gray-500">{contact.email}</div>
                          <div className="text-xs text-gray-500">{contact.phone}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Last Contact</div>
                          <div className="text-xs">{new Date(contact.lastContact).toLocaleDateString()}</div>
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
            <DialogTitle className="text-lg font-bold">
              Interaction History - {selectedContact?.name}
              {selectedContact && selectedCompany && (
                <button
                  onClick={() => handleAddTask(selectedContact, selectedCompany.company)}
                  className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs"
                >
                  Add Task
                </button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-2">
              <div className="bg-gray-100 p-2 border border-gray-300">
                <div className="font-semibold text-sm">{selectedContact.name}</div>
                <div className="text-xs text-gray-600">{selectedContact.title}</div>
                <div className="text-xs text-gray-500">{selectedContact.email}</div>
              </div>
              
              <div>
                <h3 className="font-bold text-sm mb-2">Recent Interactions</h3>
                <div className="space-y-1">
                  {getInteractionHistory(selectedContact.id).map((interaction) => (
                    <div key={interaction.id} className="border border-gray-300 p-2">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="text-xs">{interaction.type}</span>
                          <span className="text-xs font-medium ml-2">{interaction.subject}</span>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <div>{new Date(interaction.date).toLocaleDateString()}</div>
                          <div>{interaction.time}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-700">{interaction.content}</div>
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
        onSave={handleTaskSave}
        task={null}
        preset={taskPreset}
      />
    </div>
  );
};

export default Clients;
