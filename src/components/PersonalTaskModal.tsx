
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {task ? 'Edit Personal Task' : 'Add Personal Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-bold">Task Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What do you need to do?"
              required
              className="w-full px-2 py-1 border border-gray-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-bold">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
                className="w-full px-2 py-1 border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-bold">Due Time</label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) => handleInputChange('dueTime', e.target.value)}
                required
                className="w-full px-2 py-1 border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 text-sm"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-300">
            <button 
              type="button" 
              onClick={onClose}
              className="px-2 py-1 border border-gray-300 text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-2 py-1 bg-blue-600 text-white text-sm"
            >
              {task ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalTaskModal;
