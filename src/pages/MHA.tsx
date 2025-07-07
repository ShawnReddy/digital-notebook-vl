import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { type Task } from '@/data/taskData';

interface MHAOffice {
  id: string;
  name: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'completed';
  lastContact: string;
  selected: boolean;
}

const MHA = () => {
  const { handleTaskSave } = useTaskContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  
  const [mhaOffices, setMhaOffices] = useState<MHAOffice[]>([
    {
      id: '1',
      name: 'MHA Regional Office - Northeast',
      location: 'Boston, MA',
      contactPerson: 'Dr. Sarah Wilson',
      email: 's.wilson@mha.gov',
      phone: '+1 (555) 123-4567',
      status: 'active',
      lastContact: '2024-12-28',
      selected: false
    },
    {
      id: '2',
      name: 'MHA Regional Office - Southeast',
      location: 'Atlanta, GA',
      contactPerson: 'Dr. Michael Chen',
      email: 'm.chen@mha.gov',
      phone: '+1 (555) 234-5678',
      status: 'pending',
      lastContact: '2024-12-20',
      selected: false
    },
    {
      id: '3',
      name: 'MHA Regional Office - Midwest',
      location: 'Chicago, IL',
      contactPerson: 'Dr. Emily Rodriguez',
      email: 'e.rodriguez@mha.gov',
      phone: '+1 (555) 345-6789',
      status: 'completed',
      lastContact: '2024-12-15',
      selected: false
    },
    {
      id: '4',
      name: 'MHA Regional Office - West',
      location: 'San Francisco, CA',
      contactPerson: 'Dr. James Thompson',
      email: 'j.thompson@mha.gov',
      phone: '+1 (555) 456-7890',
      status: 'active',
      lastContact: '2024-12-29',
      selected: false
    }
  ]);

  const handleOfficeSelect = (officeId: string) => {
    setMhaOffices(offices => 
      offices.map(office => 
        office.id === officeId 
          ? { ...office, selected: !office.selected }
          : office
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredOffices = mhaOffices.filter(office => {
    const matchesSearch = office.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || office.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">MHA Offices</h1>
        <p className="text-sm text-gray-600">Manage Mental Health Administration relationships.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search MHA offices..."
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
        </div>

        {showFilters && (
          <div className="p-3 bg-gray-100 border border-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm">Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 border border-gray-300"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Office List */}
      <div className="space-y-2">
        {filteredOffices.map((office) => (
          <div 
            key={office.id} 
            className="border border-gray-300 p-3"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={office.selected}
                  onChange={() => handleOfficeSelect(office.id)}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{office.name}</h3>
                  <p className="text-sm text-gray-600">{office.location}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs ${getStatusColor(office.status)}`}>
                {office.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-1">
              Contact: {office.contactPerson}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{office.email}</span>
              <span>Last Contact: {new Date(office.lastContact).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredOffices.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No MHA offices found.</p>
        </div>
      )}
    </div>
  );
};

export default MHA;
