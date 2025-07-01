
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tag } from 'lucide-react';
import { type Task } from '@/data/taskData';
import { useTaskForm } from '@/hooks/useTaskForm';
import AssigneeSection from './TaskModal/AssigneeSection';
import TagSection from './TaskModal/TagSection';
import BasicFields from './TaskModal/BasicFields';

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
  const {
    formData,
    currentUserName,
    handleInputChange,
    handleTagTypeChange,
    handleTagNameChange
  } = useTaskForm({ task, preset, isOpen });

  const isAutoTagged = !!preset;

  const people = [
    { name: 'Jennifer Martinez', company: 'ABC Corporation' },
    { name: 'Sarah Williams', company: 'Innovative Solutions Inc' },
    { name: 'Robert Chen', company: 'XYZ Solutions Ltd' },
    { name: 'Michael Thompson', company: 'Global Tech Solutions' }
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
          <BasicFields
            title={formData.title}
            dueDate={formData.dueDate}
            dueTime={formData.dueTime}
            priority={formData.priority}
            onInputChange={handleInputChange}
          />

          <AssigneeSection currentUserName={currentUserName} />

          <TagSection
            tag={formData.tag}
            isAutoTagged={isAutoTagged}
            preset={preset}
            onTagTypeChange={handleTagTypeChange}
            onTagNameChange={handleTagNameChangeWithPeople}
          />

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
