
import React, { useState } from 'react';
import { getTasksByDate, getTeamTasks, getMyTasks, type Task } from '@/data/taskData';
import { useAuth } from '@/contexts/AuthContext';

interface TaskManagementPaneProps {
  tasks: Task[];
  onAddPersonalTask: () => void;
  onAddManualTask: () => void;
  onAddTaskFromClient: (preset: { company: string; person: string }) => void;
  onTaskComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  isMyTask: (task: Task) => boolean;
}

const TaskManagementPane: React.FC<TaskManagementPaneProps> = ({ 
  tasks, 
  onAddPersonalTask, 
  onAddManualTask,
  onAddTaskFromClient,
  onTaskComplete,
  onEditTask,
  isMyTask
}) => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'team' | 'personal'>('personal');

  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Filter tasks based on tab selection using the isMyTask function
  const teamTasks = tasks.filter(task => !isMyTask(task));
  const myTasks = tasks.filter(task => isMyTask(task));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTagDisplay = (task: Task) => {
    switch (task.tag.type) {
      case 'company':
        return task.tag.name;
      case 'person':
        return `${task.tag.name}${task.tag.company ? ` (${task.tag.company})` : ''}`;
      case 'personal':
        return 'Personal';
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

  const renderTaskList = (tasks: Task[]) => (
    <div className="space-y-1">
      {tasks.map((task) => (
        <div key={task.id} className="border border-gray-300 p-1">
          <div className="text-sm font-semibold">{task.title}</div>
          <div className="text-xs text-gray-600">Assigned to: {task.assignee}</div>
          <div className="text-xs text-gray-500">Due: {formatDate(task.dueDate)} at {task.dueTime}</div>
          <div className="flex gap-1 mt-1">
            <span className="text-xs">{task.priority}</span>
            {isMyTask(task) && (
              <button
                onClick={() => onTaskComplete(task.id)}
                className="text-xs underline"
              >
                Done
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTaskSection = (title: string, tasks: Task[], showAddButton = false) => (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <h3 className="text-sm font-bold">{title}</h3>
        {showAddButton && activeTab === 'personal' && (
          <button 
            onClick={onAddManualTask}
            className="text-xs underline"
          >
            Add
          </button>
        )}
      </div>
      {tasks.length > 0 ? (
        renderTaskList(tasks)
      ) : (
        <div className="text-xs text-gray-500 py-1">
          No tasks for this day
        </div>
      )}
    </div>
  );

  const currentTasks = activeTab === 'team' ? teamTasks : myTasks;
  const todayTasks = getTasksByDate(currentTasks, todayStr);
  const tomorrowTasks = getTasksByDate(currentTasks, tomorrowStr);

  return (
    <div className="border border-gray-300 p-3">
      <h2 className="font-bold mb-2">Task Management</h2>
      
      <div className="mb-2">
        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-2 py-1 text-sm ${
              activeTab === 'personal'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            My Tasks ({myTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-2 py-1 text-sm ${
              activeTab === 'team'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Team Tasks ({teamTasks.length})
          </button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {renderTaskSection('Due Today', todayTasks, true)}
        {renderTaskSection('Due Tomorrow', tomorrowTasks)}
      </div>
    </div>
  );
};

export default TaskManagementPane;
