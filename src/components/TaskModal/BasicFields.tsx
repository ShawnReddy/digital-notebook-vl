
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag, Calendar, Flag } from 'lucide-react';

interface BasicFieldsProps {
  title: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  onInputChange: (field: string, value: string) => void;
}

const BasicFields: React.FC<BasicFieldsProps> = ({
  title,
  dueDate,
  dueTime,
  priority,
  onInputChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold text-slate-700 flex items-center">
          <Tag className="w-4 h-4 mr-2" />
          Task Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="What needs to be done?"
          required
          className="h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-sm font-semibold text-slate-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Due Date
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => onInputChange('dueDate', e.target.value)}
            required
            className="h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueTime" className="text-sm font-semibold text-slate-700">
            Due Time
          </Label>
          <Input
            id="dueTime"
            type="time"
            value={dueTime}
            onChange={(e) => onInputChange('dueTime', e.target.value)}
            required
            className="h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority" className="text-sm font-semibold text-slate-700 flex items-center">
          <Flag className="w-4 h-4 mr-2" />
          Priority
        </Label>
        <Select value={priority} onValueChange={(value) => onInputChange('priority', value)}>
          <SelectTrigger className="h-12 border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200">
            <SelectItem value="high" className="hover:bg-red-50">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                High Priority
              </div>
            </SelectItem>
            <SelectItem value="medium" className="hover:bg-amber-50">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                Medium Priority
              </div>
            </SelectItem>
            <SelectItem value="low" className="hover:bg-emerald-50">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Low Priority
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default BasicFields;
