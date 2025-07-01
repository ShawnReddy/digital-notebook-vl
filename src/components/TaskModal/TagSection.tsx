
import React from 'react';
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

const TagSection: React.FC<TagSectionProps> = ({
  tag,
  isAutoTagged,
  preset,
  onTagTypeChange,
  onTagNameChange
}) => {
  const companies = [
    'ABC Corporation',
    'XYZ Solutions Ltd',
    'DEF Industries',
    'Global Tech Solutions',
    'Innovative Solutions Inc'
  ];

  const people = [
    { name: 'Jennifer Martinez', company: 'ABC Corporation' },
    { name: 'Sarah Williams', company: 'Innovative Solutions Inc' },
    { name: 'Robert Chen', company: 'XYZ Solutions Ltd' },
    { name: 'Michael Thompson', company: 'Global Tech Solutions' }
  ];

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
        <Select value={tag.name} onValueChange={onTagNameChange}>
          <SelectTrigger className="h-12 border-slate-200">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200">
            {companies.map((company) => (
              <SelectItem key={company} value={company} className="hover:bg-slate-50">
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {tag.type === 'person' && (
        <Select value={tag.name} onValueChange={onTagNameChange}>
          <SelectTrigger className="h-12 border-slate-200">
            <SelectValue placeholder="Select person" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200">
            {people.map((person) => (
              <SelectItem key={person.name} value={person.name} className="hover:bg-slate-50">
                <div>
                  <div className="font-medium">{person.name}</div>
                  <div className="text-xs text-gray-500">{person.company}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
