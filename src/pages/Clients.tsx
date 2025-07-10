import React, { useState } from 'react';
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



interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  revenue: string;
  status: 'Prime' | 'Focus' | 'Emerging';
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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskPreset, setTaskPreset] = useState<{account: string, contact: string} | null>(null);
  
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Anderson',
      company: 'ABC Corporation',
      email: 'j.anderson@abc-corp.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      revenue: '$250K',
      status: 'Focus',
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
      status: 'Emerging',
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
      status: 'Prime',
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
      status: 'Focus',
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

  const handleAddTask = (contact: Contact, company: string) => {
    setTaskPreset({
      account: company,
      contact: contact.name
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

      <div className="space-y-2">
        {filteredClients.map((client) => (
          <CompanyTile
            key={client.id}
            id={client.id}
            name={client.company}
            location={client.location}
            status={client.status}
            statusColor={getStatusColor(client.status)}
            selected={client.selected}
            onSelect={handleClientSelect}
            onClick={() => handleClientClick(client)}
          >
            <div className="flex justify-between text-sm text-gray-600">
              <span>Revenue: {client.revenue}</span>
              <span>Last Contact: {new Date(client.lastContact).toLocaleDateString()}</span>
            </div>
          </CompanyTile>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No clients found.</p>
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
          contacts: selectedCompany.contacts,
          type: 'client' as const,
          revenue: selectedCompany.revenue,
          lastContact: selectedCompany.lastContact
        } : null}
      />

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
