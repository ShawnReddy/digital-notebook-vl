import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Calendar, Flag, Tag, Building } from 'lucide-react';
import { type Task, type TaskTag } from '@/data/taskData';
import { useAuth } from '@/contexts/AuthContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  task?: Task | null;
  preset?: {
    company: string;
    person: string;
  } | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, preset }) => {
  const { userProfile } = useAuth();
  const currentUserName = userProfile?.full_name || 'Shawn';

  const [formData, setFormData] = useState<{
    title: string;
    assignee: string;
    dueDate: string;
    dueTime: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'completed';
    category: 'today' | 'week' | 'overdue';
    tag: TaskTag;
    source: 'compass' | 'manual';
    clientType: 'clients' | 'prospects' | 'inactive' | 'mha' | 'personal';
  }>({
    title: '',
    assignee: currentUserName, // Auto-assign to current user
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    status: 'pending',
    category: 'today',
    tag: {
      type: 'company',
      name: ''
    },
    source: 'manual',
    clientType: 'clients'
  });

  const teamMembers = [
    'John Smith',
    'Sarah Johnson',
    'Mike Davis',
    'Emily Chen',
    'David Wilson',
    'Shawn'
  ];

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

  // Determine if this is auto-tagged (has preset) or manual tagging
  const isAutoTagged = !!preset;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        assignee: task.assignee,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
        priority: task.priority,
        status: task.status,
        category: task.category,
        tag: task.tag,
        source: task.source,
        clientType: task.clientType
      });
    } else if (preset) {
      setFormData({
        title: '',
        assignee: currentUserName, // Always assign to current user
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        status: 'pending',
        category: 'today',
        tag: {
          type: 'person',
          name: preset.person,
          company: preset.company
        },
        source: 'manual',
        clientType: 'clients'
      });
    } else {
      setFormData({
        title: '',
        assignee: currentUserName, // Always assign to current user
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        status: 'pending',
        category: 'today',
        tag: {
          type: 'company',
          name: ''
        },
        source: 'manual',
        clientType: 'clients'
      });
    }
  }, [task, preset, isOpen, currentUserName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('TaskModal submitting task:', formData);
    onSave(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagTypeChange = (type: 'company' | 'person' | 'personal') => {
    setFormData(prev => ({
      ...prev,
      tag: {
        type,
        name: '',
        ...(type === 'person' ? { company: '' } : {})
      },
      clientType: type === 'personal' ? 'personal' : 'clients'
    }));
  };

  const handleTagNameChange = (name: string) => {
    if (formData.tag.type === 'person') {
      const selectedPerson = people.find(p => p.name === name);
      setFormData(prev => ({
        ...prev,
        tag: {
          ...prev.tag,
          name,
          company: selectedPerson?.company || ''
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tag: {
          ...prev.tag,
          name
        }
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <Tag className="w-4 h-4 text-white" />
            </div>
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-slate-700 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Task Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What needs to be done?"
              required
              className="h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>

          {/* Assignee field - now readonly and shows only current user */}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-semibold text-slate-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
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
                value={formData.dueTime}
                onChange={(e) => handleInputChange('dueTime', e.target.value)}
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
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
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

          {/* Auto-tagged Section - Only show when auto-tagged */}
          {isAutoTagged && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Building className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Auto-Tagged To:</span>
              </div>
              <div className="text-sm text-blue-700">
                <div className="font-medium">{preset?.person}</div>
                <div className="text-blue-600">{preset?.company}</div>
              </div>
            </div>
          )}

          {/* Manual Tag Selection - Only show when not auto-tagged */}
          {!isAutoTagged && (
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-slate-700 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Tag Task To
              </Label>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={formData.tag.type === 'company' ? 'default' : 'outline'}
                  onClick={() => handleTagTypeChange('company')}
                  className="h-10"
                >
                  <Building className="w-4 h-4 mr-1" />
                  Company
                </Button>
                <Button
                  type="button"
                  variant={formData.tag.type === 'person' ? 'default' : 'outline'}
                  onClick={() => handleTagTypeChange('person')}
                  className="h-10"
                >
                  <User className="w-4 h-4 mr-1" />
                  Person
                </Button>
                <Button
                  type="button"
                  variant={formData.tag.type === 'personal' ? 'default' : 'outline'}
                  onClick={() => handleTagTypeChange('personal')}
                  className="h-10"
                >
                  Personal
                </Button>
              </div>

              {formData.tag.type === 'company' && (
                <Select value={formData.tag.name} onValueChange={handleTagNameChange}>
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

              {formData.tag.type === 'person' && (
                <Select value={formData.tag.name} onValueChange={handleTagNameChange}>
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

              {formData.tag.type === 'personal' && (
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  This task will be tagged as a personal task.
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 h-12 border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-6 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
