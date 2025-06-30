
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Flag, User } from 'lucide-react';

interface PersonalTask {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
}

interface PersonalTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<PersonalTask, 'id'>) => void;
  task?: PersonalTask | null;
}

const PersonalTaskModal: React.FC<PersonalTaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState<{
    title: string;
    dueDate: string;
    dueTime: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'completed';
  }>({
    title: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    status: 'pending'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
        priority: task.priority,
        status: task.status
      });
    } else {
      setFormData({
        title: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        status: 'pending'
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
              <User className="w-4 h-4 text-white" />
            </div>
            {task ? 'Edit Personal Task' : 'Add Personal Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
              Task Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What do you need to do?"
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
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
                className="h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueTime" className="text-sm font-semibold text-slate-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
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
              {task ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalTaskModal;
