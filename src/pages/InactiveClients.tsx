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
  company: string;
  email: string;
  phone: string;
  location: string;
  lastRevenue: string;
  inactiveDate: string;
  reason: string;
  selected: boolean;
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
      name: 'John Smith',
      company: 'Old Tech Corp',
      email: 'j.smith@oldtech.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      lastRevenue: '$50K',
      inactiveDate: '2024-06-15',
      reason: 'Contract ended',
      selected: false
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'Legacy Systems',
      email: 's.johnson@legacy.com',
      phone: '+1 (555) 234-5678',
      location: 'Chicago, IL',
      lastRevenue: '$75K',
      inactiveDate: '2024-08-20',
      reason: 'Budget cuts',
      selected: false
    },
    {
      id: '3',
      name: 'Mike Davis',
      company: 'Outdated Solutions',
      email: 'm.davis@outdated.com',
      phone: '+1 (555) 345-6789',
      location: 'Los Angeles, CA',
      lastRevenue: '$100K',
      inactiveDate: '2024-09-10',
      reason: 'Company acquired',
      selected: false
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
    setInactiveClients(clients => 
      clients.map(client => 
        client.id === clientId 
          ? { ...client, selected: !client.selected }
          : client
      )
    );
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
    const matchesSearch = client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.reason === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCount = inactiveClients.filter(c => c.selected).length;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Inactive Clients</h1>
        <p className="text-sm text-gray-600">Manage former client relationships.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search inactive clients..."
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
              onClick={handleReactivateClients}
            >
              Mark {selectedCount} for Reactivation
            </button>
          )}
        </div>

        {showFilters && (
          <div className="p-3 bg-gray-100 border border-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm">Reason Inactive:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 border border-gray-300"
              >
                <option value="all">All Reasons</option>
                <option value="Budget cuts">Budget cuts</option>
                <option value="Switched to competitor">Switched to competitor</option>
                <option value="Project completed">Project completed</option>
                <option value="Reorganization">Reorganization</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Inactive Clients List */}
      <div className="space-y-2">
        {filteredClients.map((client) => (
          <div 
            key={client.id} 
            className="border border-gray-300 p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => handleClientClick(client)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={client.selected}
                  onChange={() => handleClientSelect(client.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{client.company}</h3>
                  <p className="text-sm text-gray-600">{client.location}</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 border border-gray-300">
                Inactive
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Last Revenue: {client.lastRevenue}</span>
              <span>Inactive since: {new Date(client.inactiveDate).toLocaleDateString()}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Reason: {client.reason}
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No inactive clients found.</p>
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
              <div>
                <h3 className="font-semibold mb-2">Company Contacts</h3>
                <p className="text-sm text-gray-500 mb-2">
                  * Contact information would be populated from Compass
                </p>
                <div className="space-y-2">
                  {/* Add contact information display here */}
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

export default InactiveClients;
