
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Task } from '@/data/taskData';

interface TaskBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const TaskBreakdownModal: React.FC<TaskBreakdownModalProps> = ({ isOpen, onClose, tasks }) => {
  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'clients': return '👥';
      case 'prospects': return '✅';
      case 'inactive': return '❌';
      case 'mha': return '🏢';
      case 'personal': return '👤';
      default: return '👥';
    }
  };

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'clients': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'prospects': return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'mha': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'personal': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTagDisplay = (task: Task) => {
    switch (task.tag.type) {
      case 'company':
        return task.tag.name;
      case 'person':
        return `${task.tag.name}${task.tag.company ? ` (${task.tag.company})` : ''}`;
      case 'personal':
        return 'Personal Task';
      default:
        return task.tag.name;
    }
  };

  const getTagIcon = (tagType: string) => {
    switch (tagType) {
      case 'company': return '🏢';
      case 'person': return '👤';
      case 'personal': return '👤';
      default: return '🏢';
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.clientType]) {
      acc[task.clientType] = [];
    }
    acc[task.clientType].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const clientTypeLabels = {
    clients: 'Active Clients',
    prospects: 'Prospects',
    inactive: 'Inactive Clients',
    mha: 'MHA',
    personal: 'Personal Tasks'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Task Breakdown Overview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {Object.entries(groupedTasks).map(([clientType, typeTasks]) => (
            <div key={clientType} className="border border-gray-300 p-3">
              <div className="flex items-center mb-3">
                <span className="mr-2">{getClientTypeIcon(clientType)}</span>
                <h3 className="font-semibold text-gray-800">
                  {clientTypeLabels[clientType as keyof typeof clientTypeLabels]}
                </h3>
                <span className={`ml-2 px-2 py-1 text-xs ${getClientTypeColor(clientType)}`}>
                  {typeTasks.length} {typeTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              <div className="space-y-2">
                {typeTasks.map((task) => (
                  <div key={task.id} className="border border-gray-300 p-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {task.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                          {getTagIcon(task.tag.type)} Tagged to: {getTagDisplay(task)}
                        </p>
                        {task.source === 'compass' && (
                          <span className="text-xs px-1 py-0.5 bg-blue-100 text-blue-700 border border-blue-300">
                            Compass
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 text-xs ${getPriorityColor(task.priority)}`}>
                          {getPriorityIcon(task.priority)} {task.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Assigned to: {task.assignee}</span>
                      <div className="flex gap-2">
                        <span>{formatDate(task.dueDate)}</span>
                        <span>{task.dueTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {Object.keys(groupedTasks).length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No pending tasks</p>
              <p className="text-xs">You're all caught up!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskBreakdownModal;

