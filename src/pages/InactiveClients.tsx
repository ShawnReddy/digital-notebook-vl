import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Phone, Mail, MapPin, Users, MessageSquare, PhoneCall, Calendar, FileText, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import TaskModal from '@/components/TaskModal';
import { useTaskContext } from '@/contexts/TaskContext';
import { type Task } from '@/data/taskData';
import CompanyTile from '@/components/CompanyTile';
import CompanyModal from '@/components/CompanyModal';

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  lastContact: string;
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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskPreset, setTaskPreset] = useState<{account: string, contact: string} | null>(null);
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



  const handleAddTask = (contact: Contact, company: string) => {
    setTaskPreset({
      account: company,
      contact: contact.name
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
          <CompanyTile
            key={client.id}
            id={client.id}
            name={client.company}
            location={client.location}
            status="Inactive"
            statusColor="bg-gray-100 text-gray-800 border border-gray-300"
            selected={client.selected}
            onSelect={handleClientSelect}
            onClick={() => handleClientClick(client)}
          >
            <div className="flex justify-between text-sm text-gray-600">
              <span>Last Revenue: {client.lastRevenue}</span>
              <span>Inactive since: {new Date(client.inactiveDate).toLocaleDateString()}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Reason: {client.reason}
            </div>
          </CompanyTile>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No inactive clients found.</p>
        </div>
      )}

      {/* Company Modal */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        company={selectedCompany ? {
          id: selectedCompany.id,
          name: selectedCompany.company,
          location: selectedCompany.location,
          contacts: [], // Inactive clients don't have contacts in the current data structure
          type: 'inactive' as const,
          lastRevenue: selectedCompany.lastRevenue,
          inactiveDate: selectedCompany.inactiveDate,
          reason: selectedCompany.reason
        } : null}
      />

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
