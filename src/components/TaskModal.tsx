
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Task } from '@/data/taskData';
import { useTaskForm, teamMembers } from '@/hooks/useTaskForm';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  task?: Task | null;
  preset?: {
    account: string;
    contact: string;
  } | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, preset }) => {
  const {
    formData,
    currentUserName,
    handleInputChange,
    handleTagTypeChange,
    handleTagNameChange
  } = useTaskForm({ task, preset, isOpen });

  const isAutoTagged = !!preset;

  const people = [
    { name: 'Jennifer Martinez', account: 'ABC Corporation' },
    { name: 'Sarah Williams', account: 'Innovative Solutions Inc' },
    { name: 'Robert Chen', account: 'XYZ Solutions Ltd' },
    { name: 'Michael Thompson', account: 'Global Tech Solutions' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('TaskModal submitting task:', formData);
    onSave(formData);
  };

  const handleTagNameChangeWithPeople = (name: string) => {
    handleTagNameChange(name, people);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-bold">Task Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What needs to be done?"
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

          <div>
            <label className="text-sm font-bold">Assigned To</label>
            <select
              value={formData.assignee}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 text-sm"
            >
              {teamMembers.map((member) => (
                <option key={member} value={member}>
                  {member} {member === currentUserName ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold">Tag Type</label>
            <select
              value={formData.tag.type}
              onChange={(e) => handleTagTypeChange(e.target.value as 'account' | 'contact' | 'personal')}
              className="w-full px-2 py-1 border border-gray-300 text-sm"
            >
              <option value="personal">Personal</option>
              <option value="account">Account</option>
              <option value="contact">Contact</option>
            </select>
          </div>

          {formData.tag.type !== 'personal' && (
            <div>
              <label className="text-sm font-bold">Tag Name</label>
              <input
                type="text"
                value={formData.tag.name}
                onChange={(e) => handleTagNameChangeWithPeople(e.target.value)}
                placeholder={formData.tag.type === 'account' ? 'Account name' : 'Contact name'}
                className="w-full px-2 py-1 border border-gray-300 text-sm"
              />
            </div>
          )}

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
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
