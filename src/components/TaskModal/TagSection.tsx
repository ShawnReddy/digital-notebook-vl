import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Building } from 'lucide-react';
import { type TaskTag } from '@/data/taskData';

interface TagSectionProps {
  tag: TaskTag;
  isAutoTagged: boolean;
  preset?: {
    company: string;
    person: string;
  } | null;
  onTagTypeChange: (type: 'company' | 'person' | 'personal') => void;
  onTagNameChange: (name: string) => void;
}

// Unified company and people data that matches across all pages
const companiesByType = {
  clients: [
    'ABC Corporation',
    'XYZ Solutions Ltd',
    'Global Tech Solutions',
    'Innovative Solutions Inc'
  ],
  prospects: [
    'Future Tech Inc.',
    'NextGen Solutions',
    'Digital Dynamics',
    'Startup Ventures'
  ],
  inactive: [
    'Acme Corp',
    'Beta Industries',
    'Gamma Solutions',
    'Delta Corp'
  ],
  mha: [
    'Metro Health Alliance',
    'Regional Medical Group',
    'Community Healthcare Network',
    'Integrated Care Systems'
  ]
};

// Updated people data to match the contacts from all pages
const peopleByCompany: Record<string, Array<{ name: string; title?: string }>> = {
  // Clients
  'ABC Corporation': [
    { name: 'Jennifer Martinez', title: 'CEO' },
    { name: 'David Wilson', title: 'CTO' }
  ],
  'XYZ Solutions Ltd': [
    { name: 'Robert Chen', title: 'VP Sales' },
    { name: 'Lisa Anderson', title: 'Marketing Director' }
  ],
  'Global Tech Solutions': [
    { name: 'Michael Thompson', title: 'Operations Manager' },
    { name: 'Emily Rodriguez', title: 'Project Lead' }
  ],
  'Innovative Solutions Inc': [
    { name: 'Sarah Williams', title: 'Business Development' },
    { name: 'James Johnson', title: 'Technical Lead' }
  ],
  
  // Prospects
  'Future Tech Inc.': [
    { name: 'Lisa Thompson', title: 'VP of Technology' },
    { name: 'David Kim', title: 'CTO' }
  ],
  'NextGen Solutions': [
    { name: 'Robert Kim', title: 'CEO' }
  ],
  'Digital Dynamics': [
    { name: 'Amanda Foster', title: 'Operations Director' },
    { name: 'Mark Stevens', title: 'Business Development' }
  ],
  'Startup Ventures': [
    { name: 'James Wilson', title: 'Founder' }
  ],
  
  // Inactive Clients
  'Acme Corp': [
    { name: 'John Doe', title: 'CEO' },
    { name: 'Jane Smith', title: 'CFO' }
  ],
  'Beta Industries': [
    { name: 'Alice Johnson', title: 'CTO' }
  ],
  'Gamma Solutions': [
    { name: 'Bob Williams', title: 'Project Manager' },
    { name: 'Charlie Brown', title: 'Consultant' }
  ],
  'Delta Corp': [
    { name: 'Eve Davis', title: 'Finance Director' }
  ],
  
  // MHA
  'Metro Health Alliance': [
    { name: 'Dr. Sandra Martinez', title: 'Chief Medical Officer' },
    { name: 'Robert Chen', title: 'Director of Operations' }
  ],
  'Regional Medical Group': [
    { name: 'Dr. Michael Thompson', title: 'Regional Director' }
  ],
  'Community Healthcare Network': [
    { name: 'Dr. Lisa Wang', title: 'Network Administrator' },
    { name: 'Jennifer Adams', title: 'Compliance Officer' }
  ],
  'Integrated Care Systems': [
    { name: 'Dr. Robert Johnson', title: 'Chief Executive Officer' }
  ]
};

const TagSection: React.FC<TagSectionProps> = ({
  tag,
  isAutoTagged,
  preset,
  onTagTypeChange,
  onTagNameChange
}) => {
  const [selectedClientType, setSelectedClientType] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  const [availablePeople, setAvailablePeople] = useState<Array<{ name: string; title?: string }>>([]);

  // Initialize state based on current tag or preset
  useEffect(() => {
    if (preset) {
      // Find the company in our data structure
      for (const [clientType, companies] of Object.entries(companiesByType)) {
        if (companies.includes(preset.company)) {
          setSelectedClientType(clientType);
          setAvailableCompanies(companies);
          setSelectedCompany(preset.company);
          setAvailablePeople(peopleByCompany[preset.company] || []);
          break;
        }
      }
    } else if (tag.type === 'company' && tag.name) {
      // Find which client type this company belongs to
      for (const [clientType, companies] of Object.entries(companiesByType)) {
        if (companies.includes(tag.name)) {
          setSelectedClientType(clientType);
          setAvailableCompanies(companies);
          setSelectedCompany(tag.name);
          break;
        }
      }
    } else if (tag.type === 'person' && tag.company) {
      // Find which client type this company belongs to
      for (const [clientType, companies] of Object.entries(companiesByType)) {
        if (companies.includes(tag.company)) {
          setSelectedClientType(clientType);
          setAvailableCompanies(companies);
          setSelectedCompany(tag.company);
          setAvailablePeople(peopleByCompany[tag.company] || []);
          break;
        }
      }
    }
  }, [tag, preset]);

  // Reset selections when tag type changes
  useEffect(() => {
    if (tag.type === 'personal') {
      setSelectedClientType('');
      setSelectedCompany('');
      setAvailableCompanies([]);
      setAvailablePeople([]);
    }
  }, [tag.type]);

  // Update available companies when client type changes
  const handleClientTypeChange = (clientType: string) => {
    setSelectedClientType(clientType);
    const companies = companiesByType[clientType as keyof typeof companiesByType] || [];
    setAvailableCompanies(companies);
    setSelectedCompany('');
    setAvailablePeople([]);
    // Clear the tag name when client type changes
    onTagNameChange('');
  };

  // Update available people when company changes
  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company);
    const people = peopleByCompany[company] || [];
    setAvailablePeople(people);
    
    if (tag.type === 'company') {
      onTagNameChange(company);
    } else if (tag.type === 'person') {
      // Clear person selection when company changes
      onTagNameChange('');
    }
  };

  const handlePersonSelection = (personName: string) => {
    onTagNameChange(personName);
  };

  if (isAutoTagged && preset) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center mb-2">
          <Building className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">Auto-Tagged To:</span>
        </div>
        <div className="text-sm text-blue-700">
          <div className="font-medium">{preset.person}</div>
          <div className="text-blue-600">{preset.company}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-slate-700 flex items-center">
        <Building className="w-4 h-4 mr-2" />
        Tag Task To
      </Label>
      
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant={tag.type === 'company' ? 'default' : 'outline'}
          onClick={() => onTagTypeChange('company')}
          className="h-10"
        >
          <Building className="w-4 h-4 mr-1" />
          Account
        </Button>
        <Button
          type="button"
          variant={tag.type === 'person' ? 'default' : 'outline'}
          onClick={() => onTagTypeChange('person')}
          className="h-10"
        >
          <User className="w-4 h-4 mr-1" />
          Contact
        </Button>
        <Button
          type="button"
          variant={tag.type === 'personal' ? 'default' : 'outline'}
          onClick={() => onTagTypeChange('personal')}
          className="h-10"
        >
          Others
        </Button>
      </div>

      {(tag.type === 'company' || tag.type === 'person') && (
        <div className="space-y-4">
          <Select value={selectedClientType} onValueChange={handleClientTypeChange}>
            <SelectTrigger className="h-12 border-slate-200 bg-white">
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 z-50">
              <SelectItem value="clients" className="hover:bg-slate-50">Clients</SelectItem>
              <SelectItem value="prospects" className="hover:bg-slate-50">Prospects</SelectItem>
              <SelectItem value="inactive" className="hover:bg-slate-50">Inactive</SelectItem>
              <SelectItem value="mha" className="hover:bg-slate-50">MHA</SelectItem>
            </SelectContent>
          </Select>

          {selectedClientType && availableCompanies.length > 0 && (
            <Select value={selectedCompany} onValueChange={handleCompanyChange}>
              <SelectTrigger className="h-12 border-slate-200 bg-white">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 z-50">
                {availableCompanies.map((company) => (
                  <SelectItem key={company} value={company} className="hover:bg-slate-50">
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {tag.type === 'person' && selectedCompany && availablePeople.length > 0 && (
            <Select value={tag.name} onValueChange={handlePersonSelection}>
              <SelectTrigger className="h-12 border-slate-200 bg-white">
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 z-50">
                {availablePeople.map((person) => (
                  <SelectItem key={person.name} value={person.name} className="hover:bg-slate-50">
                    <div>
                      <div className="font-medium">{person.name}</div>
                      {person.title && <div className="text-xs text-gray-500">{person.title}</div>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {tag.type === 'personal' && (
        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
          This task will be tagged as a personal task.
        </div>
      )}
    </div>
  );
};

export default TagSection;
