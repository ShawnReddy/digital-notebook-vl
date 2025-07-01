
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

// Mock data for companies categorized by client type
const companiesByType = {
  clients: [
    'ABC Corporation',
    'XYZ Solutions Ltd',
    'Global Tech Solutions',
    'Innovative Solutions Inc'
  ],
  prospects: [
    'Future Corp',
    'NextGen Industries',
    'Prospect Technologies',
    'Emerging Solutions'
  ],
  inactive: [
    'Legacy Systems Inc',
    'Old School Corp',
    'Dormant Enterprises'
  ],
  mha: [
    'MHA Partners',
    'Healthcare Associates',
    'Medical Group LLC'
  ]
};

// Mock data for people by company
const peopleByCompany: Record<string, Array<{ name: string; title?: string }>> = {
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
  'Future Corp': [
    { name: 'Alex Turner', title: 'Founder' },
    { name: 'Maria Garcia', title: 'Head of Product' }
  ],
  'NextGen Industries': [
    { name: 'Kevin Brown', title: 'VP Engineering' }
  ],
  'Prospect Technologies': [
    { name: 'Rachel Davis', title: 'CEO' }
  ],
  'Legacy Systems Inc': [
    { name: 'Thomas Miller', title: 'Legacy Manager' }
  ],
  'MHA Partners': [
    { name: 'Dr. Patricia Jones', title: 'Medical Director' },
    { name: 'Dr. Mark Thompson', title: 'Specialist' }
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

  // Reset selections when tag type changes
  useEffect(() => {
    if (tag.type !== 'person') {
      setSelectedClientType('');
      setSelectedCompany('');
      setAvailableCompanies([]);
      setAvailablePeople([]);
    }
  }, [tag.type]);

  // Update available companies when client type changes
  useEffect(() => {
    if (selectedClientType && tag.type === 'person') {
      setAvailableCompanies(companiesByType[selectedClientType as keyof typeof companiesByType] || []);
      setSelectedCompany('');
      setAvailablePeople([]);
    }
  }, [selectedClientType, tag.type]);

  // Update available people when company changes
  useEffect(() => {
    if (selectedCompany && tag.type === 'person') {
      setAvailablePeople(peopleByCompany[selectedCompany] || []);
    }
  }, [selectedCompany, tag.type]);

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
          Company
        </Button>
        <Button
          type="button"
          variant={tag.type === 'person' ? 'default' : 'outline'}
          onClick={() => onTagTypeChange('person')}
          className="h-10"
        >
          <User className="w-4 h-4 mr-1" />
          Person
        </Button>
        <Button
          type="button"
          variant={tag.type === 'personal' ? 'default' : 'outline'}
          onClick={() => onTagTypeChange('personal')}
          className="h-10"
        >
          Personal
        </Button>
      </div>

      {tag.type === 'company' && (
        <div className="space-y-4">
          <Select value={selectedClientType} onValueChange={setSelectedClientType}>
            <SelectTrigger className="h-12 border-slate-200">
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="clients" className="hover:bg-slate-50">Clients</SelectItem>
              <SelectItem value="prospects" className="hover:bg-slate-50">Prospects</SelectItem>
              <SelectItem value="inactive" className="hover:bg-slate-50">Inactive</SelectItem>
              <SelectItem value="mha" className="hover:bg-slate-50">MHA</SelectItem>
            </SelectContent>
          </Select>

          {selectedClientType && (
            <Select value={tag.name} onValueChange={onTagNameChange}>
              <SelectTrigger className="h-12 border-slate-200">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {availableCompanies.map((company) => (
                  <SelectItem key={company} value={company} className="hover:bg-slate-50">
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {tag.type === 'person' && (
        <div className="space-y-4">
          <Select value={selectedClientType} onValueChange={setSelectedClientType}>
            <SelectTrigger className="h-12 border-slate-200">
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="clients" className="hover:bg-slate-50">Clients</SelectItem>
              <SelectItem value="prospects" className="hover:bg-slate-50">Prospects</SelectItem>
              <SelectItem value="inactive" className="hover:bg-slate-50">Inactive</SelectItem>
              <SelectItem value="mha" className="hover:bg-slate-50">MHA</SelectItem>
            </SelectContent>
          </Select>

          {selectedClientType && (
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="h-12 border-slate-200">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {availableCompanies.map((company) => (
                  <SelectItem key={company} value={company} className="hover:bg-slate-50">
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedCompany && availablePeople.length > 0 && (
            <Select value={tag.name} onValueChange={handlePersonSelection}>
              <SelectTrigger className="h-12 border-slate-200">
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
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
