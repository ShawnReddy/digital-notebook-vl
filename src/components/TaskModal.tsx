import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Calendar, Flag, Tag } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  category: 'today' | 'week' | 'overdue';
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  task?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState<{
    title: string;
    assignee: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'completed';
    category: 'today' | 'week' | 'overdue';
  }>({
    title: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    category: 'today'
  });

  const teamMembers = [
    'John Smith',
    'Sarah Johnson',
    'Mike Davis',
    'Emily Chen',
    'David Wilson'
  ];

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        assignee: task.assignee,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        category: task.category
      });
    } else {
      setFormData({
        title: '',
        assignee: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        category: 'today'
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
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

          <div className="space-y-2">
            <Label htmlFor="assignee" className="text-sm font-semibold text-slate-700 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Assign To
            </Label>
            <Select value={formData.assignee} onValueChange={(value) => handleInputChange('assignee', value)}>
              <SelectTrigger className="h-12 border-slate-200">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {teamMembers.map((member) => (
                  <SelectItem key={member} value={member} className="hover:bg-slate-50">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mr-2">
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                      {member}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="h-12 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="today">📅 Today</SelectItem>
                  <SelectItem value="week">📆 This Week</SelectItem>
                  <SelectItem value="overdue">⚠️ Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
