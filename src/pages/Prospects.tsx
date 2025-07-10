import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Phone, Mail, MapPin, Users, MessageSquare, PhoneCall, Calendar, FileText, Loader2, Plus } from 'lucide-react';
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



interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  potentialRevenue: string;
  stage: 'Prime' | 'Focus' | 'Emerging';
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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskPreset, setTaskPreset] = useState<{account: string, contact: string} | null>(null);
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
      stage: 'Prime',
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
      stage: 'Focus',
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
      stage: 'Focus',
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
      stage: 'Emerging',
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <CompanyTile
            key={prospect.id}
            id={prospect.id}
            name={prospect.company}
            location={prospect.location}
            status={prospect.stage}
            statusColor={getStageColor(prospect.stage)}
            selected={prospect.selected}
            onSelect={handleProspectSelect}
            onClick={() => handleProspectClick(prospect)}
          >
            <div className="flex justify-between text-sm text-gray-600">
              <span>Potential Revenue: {prospect.potentialRevenue}</span>
              <span>Last Contact: {new Date(prospect.lastContact).toLocaleDateString()}</span>
            </div>
          </CompanyTile>
        ))}
      </div>

      {filteredProspects.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No prospects found matching your search.</p>
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
          type: 'prospect' as const,
          potentialRevenue: selectedCompany.potentialRevenue,
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
        onSave={onTaskSave}
        task={null}
        preset={taskPreset}
      />
    </div>
  );
};

export default Prospects;
