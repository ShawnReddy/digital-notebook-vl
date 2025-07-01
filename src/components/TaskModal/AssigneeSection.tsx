
import React from 'react';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface AssigneeSectionProps {
  currentUserName: string;
}

const AssigneeSection: React.FC<AssigneeSectionProps> = ({ currentUserName }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="assignee" className="text-sm font-semibold text-slate-700 flex items-center">
        <User className="w-4 h-4 mr-2" />
        Assigned To
      </Label>
      <div className="flex items-center h-12 px-3 border border-slate-200 rounded-lg bg-slate-50">
        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mr-2">
          {currentUserName.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-slate-700 font-medium">{currentUserName}</span>
        <span className="ml-2 text-xs text-slate-500">(You)</span>
      </div>
    </div>
  );
};

export default AssigneeSection;
