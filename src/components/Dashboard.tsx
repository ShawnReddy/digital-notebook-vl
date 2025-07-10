import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { getMyPendingTasks } from '@/utils/taskFilters';
import DashboardHeader from './DashboardHeader';
import DashboardModals from './DashboardModals';
import StatsOverview from './StatsOverview';
import TodaysSchedule from './TodaysSchedule';
import TaskManagementPane from './TaskManagementPane';
import { type Task, type PersonalTask } from '@/data/taskData';
import PendingTasksTable from './PendingTasksTable';

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

const Dashboard = () => {
  const {
    tasks,
    personalTasks,
    isMyTask,
    handleTaskSave,
    handlePersonalTaskSave,
    handleTaskComplete
  } = useTaskContext();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPersonalTaskModalOpen, setIsPersonalTaskModalOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTaskBreakdownOpen, setIsTaskBreakdownOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingPersonalTask, setEditingPersonalTask] = useState<PersonalTask | null>(null);
  const [taskModalPreset, setTaskModalPreset] = useState<{ account: string; contact: string } | null>(null);

  // Set document title
  useEffect(() => {
    document.title = 'Digital Notebook';
  }, []);

  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Quarterly Review',
      client: 'ABC Corporation',
      time: '10:00 AM',
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Product Demo',
      client: 'XYZ Solutions',
      time: '2:30 PM',
      type: 'demo'
    },
    {
      id: '3',
      title: 'Discovery Call',
      client: 'New Prospect Inc.',
      time: '4:00 PM',
      type: 'call'
    }
  ];

  const onTaskSave = (taskData: Omit<Task, 'id'>) => {
    handleTaskSave(taskData, editingTask);
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setTaskModalPreset(null);
  };

  const onPersonalTaskSave = (taskData: Omit<PersonalTask, 'id'>) => {
    handlePersonalTaskSave(taskData, editingPersonalTask);
    setIsPersonalTaskModalOpen(false);
    setEditingPersonalTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleBriefClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsBriefModalOpen(true);
  };

  const handleAddPersonalTask = () => {
    setIsPersonalTaskModalOpen(true);
  };

  const handleAddTaskFromClient = (preset: { account: string; contact: string }) => {
    setTaskModalPreset(preset);
    setIsTaskModalOpen(true);
  };

  const handleAddManualTask = () => {
    setTaskModalPreset(null);
    setIsTaskModalOpen(true);
  };

  // Get my pending tasks using the utility function
  const myPendingTasks = getMyPendingTasks(tasks, isMyTask);

  // Collect unique assignees from tasks
  const assignees = Array.from(new Set(tasks.map(t => t.assignee)));

  // Handler for completing a task
  const handleCompleteTask = (taskId: string) => {
    handleTaskComplete(taskId);
  };

  // Handler for adding a follow-up task
  const handleAddFollowUp = ({ originalTask, assignee, dueDate, note }: { originalTask: Task; assignee: string; dueDate: string; note: string }) => {
    handleTaskSave({
      title: `Follow up: ${originalTask.title}`,
      assignee,
      dueDate,
      dueTime: '',
      priority: 'medium',
      status: 'pending',
      tag: originalTask.tag,
      clientType: originalTask.clientType,
      category: 'today',
      source: 'manual',
    }, null);
  };

  // Prepare color-coded badge data for overview
  const CLIENT_TYPE_MAP = {
    prospects: { label: 'PROSPECT', color: 'bg-blue-600 text-white' },
    clients: { label: 'CLIENT', color: 'bg-green-700 text-white' },
    mha: { label: 'MHA', color: 'bg-purple-600 text-white' },
    inactive: { label: 'INACTIVE', color: 'bg-gray-700 text-white' },
    personal: { label: 'PERSONAL', color: 'bg-indigo-600 text-white' },
    alumni: { label: 'ALUMNI', color: 'bg-orange-600 text-white' },
  };
  const typeCounts = myPendingTasks.reduce<Record<string, number>>((acc, t) => {
    const key = t.clientType;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <div className="mb-4">
        <div className="border border-gray-300 p-3">
          <h2 className="font-bold mb-2">Overview</h2>
          <div className="flex gap-4">
            <div>
              <span className="text-sm">Meetings: {meetings.length}</span>
            </div>
          </div>
          {/* Color-coded badges only */}
          <div className="flex gap-2 mt-4">
            {Object.entries(CLIENT_TYPE_MAP).map(([key, { label, color }]) => (
              <span
                key={key}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${color}`}
              >
                {label} <span>{typeCounts[key] || 0}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <TodaysSchedule meetings={meetings} onBriefClick={handleBriefClick} />
        </div>

        <div>
          <TaskManagementPane 
            tasks={myPendingTasks}
            assignees={assignees}
            onComplete={handleCompleteTask}
            onAddFollowUp={handleAddFollowUp}
            onAddManualTask={handleAddManualTask}
          />
        </div>
      </div>

      <DashboardModals
        showTaskModal={isTaskModalOpen}
        setShowTaskModal={setIsTaskModalOpen}
        showPersonalTaskModal={isPersonalTaskModalOpen}
        setShowPersonalTaskModal={setIsPersonalTaskModalOpen}
        showTaskBreakdownModal={isTaskBreakdownOpen}
        setShowTaskBreakdownModal={setIsTaskBreakdownOpen}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        editingPersonalTask={editingPersonalTask}
        setEditingPersonalTask={setEditingPersonalTask}
        taskModalPreset={taskModalPreset}
        setTaskModalPreset={setTaskModalPreset}
        onTaskSave={onTaskSave}
        onPersonalTaskSave={onPersonalTaskSave}
        onTaskComplete={handleTaskComplete}
      />
    </div>
  );
};

export default Dashboard;
