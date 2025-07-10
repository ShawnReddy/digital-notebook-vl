
import React, { useState } from 'react';
import PendingTasksTable from './PendingTasksTable';
import { type Task } from '@/data/taskData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getMyTasks, getTeamTasks } from '@/utils/taskFilters';

interface TaskManagementPaneProps {
  tasks: Task[];
  assignees: string[];
  onComplete: (taskId: string) => void;
  onAddFollowUp: (followUp: { originalTask: Task; assignee: string; dueDate: string; note: string }) => void;
  onAddManualTask: () => void;
}

const TaskManagementPane: React.FC<TaskManagementPaneProps> = ({ tasks, assignees, onComplete, onAddFollowUp, onAddManualTask }) => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'my' | 'team'>('my');
  const currentUser = userProfile?.full_name || 'Shawn Reddy';

  const myTasks = getMyTasks(tasks, currentUser);
  const teamTasks = getTeamTasks(tasks, currentUser);

  const displayedTasks = activeTab === 'my' ? myTasks : teamTasks;

  return (
    <div className="border border-gray-300 p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold">Task Management</h2>
        <Button onClick={onAddManualTask} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-full text-sm font-semibold ${activeTab === 'my' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('my')}
        >
          My Tasks ({myTasks.length})
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm font-semibold ${activeTab === 'team' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('team')}
        >
          Team Tasks ({teamTasks.length})
        </button>
      </div>
      <PendingTasksTable
        tasks={displayedTasks}
        assignees={assignees}
        onComplete={onComplete}
        onAddFollowUp={onAddFollowUp}
        showTagInfo={true}
        canComplete={activeTab === 'my'}
      />
    </div>
  );
};

export default TaskManagementPane;
