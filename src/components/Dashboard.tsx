import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { getMyPendingTasks } from '@/utils/taskFilters';
import DashboardHeader from './DashboardHeader';
import DashboardModals from './DashboardModals';
import StatsOverview from './StatsOverview';
import TodaysSchedule from './TodaysSchedule';
import TaskManagementPane from './TaskManagementPane';
import { type Task, type PersonalTask } from '@/data/taskData';

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
  const [taskModalPreset, setTaskModalPreset] = useState<{ company: string; person: string } | null>(null);

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

  const handleAddTaskFromClient = (preset: { company: string; person: string }) => {
    setTaskModalPreset(preset);
    setIsTaskModalOpen(true);
  };

  const handleAddManualTask = () => {
    setTaskModalPreset(null);
    setIsTaskModalOpen(true);
  };

  // Get my pending tasks using the utility function
  const myPendingTasks = getMyPendingTasks(tasks, isMyTask);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader />

        <StatsOverview
          meetingsCount={meetings.length}
          pendingTasksCount={myPendingTasks.length}
          onPendingTasksClick={() => setIsTaskBreakdownOpen(true)}
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-5">
            <TodaysSchedule meetings={meetings} onBriefClick={handleBriefClick} />
          </div>

          <div className="xl:col-span-7">
            <TaskManagementPane 
              tasks={tasks}
              onAddPersonalTask={handleAddPersonalTask}
              onAddManualTask={handleAddManualTask}
              onAddTaskFromClient={handleAddTaskFromClient}
              onTaskComplete={handleTaskComplete}
              onEditTask={handleEditTask}
              isMyTask={isMyTask}
            />
          </div>
        </div>

        <DashboardModals
          isTaskModalOpen={isTaskModalOpen}
          setIsTaskModalOpen={setIsTaskModalOpen}
          isPersonalTaskModalOpen={isPersonalTaskModalOpen}
          setIsPersonalTaskModalOpen={setIsPersonalTaskModalOpen}
          isBriefModalOpen={isBriefModalOpen}
          setIsBriefModalOpen={setIsBriefModalOpen}
          isTaskBreakdownOpen={isTaskBreakdownOpen}
          setIsTaskBreakdownOpen={setIsTaskBreakdownOpen}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          editingPersonalTask={editingPersonalTask}
          setEditingPersonalTask={setEditingPersonalTask}
          selectedMeeting={selectedMeeting}
          setSelectedMeeting={setSelectedMeeting}
          taskModalPreset={taskModalPreset}
          setTaskModalPreset={setTaskModalPreset}
          onTaskSave={onTaskSave}
          onPersonalTaskSave={onPersonalTaskSave}
          myPendingTasks={myPendingTasks}
        />
      </div>
    </div>
  );
};

export default Dashboard;
