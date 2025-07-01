import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TaskModal from './TaskModal';
import BriefModal from './BriefModal';
import PersonalTaskModal from './PersonalTaskModal';
import StatsOverview from './StatsOverview';
import TodaysSchedule from './TodaysSchedule';
import TaskManagementPane from './TaskManagementPane';
import TaskBreakdownModal from './TaskBreakdownModal';
import { mockTasks, mockPersonalTasks, getTasksByStatus, type Task, type PersonalTask } from '@/data/taskData';
import { useToast } from '@/hooks/use-toast';

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

const Dashboard = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPersonalTaskModalOpen, setIsPersonalTaskModalOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTaskBreakdownOpen, setIsTaskBreakdownOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingPersonalTask, setEditingPersonalTask] = useState<PersonalTask | null>(null);
  const [taskModalPreset, setTaskModalPreset] = useState<{ company: string; person: string } | null>(null);
  
  // Use centralized task data
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>(mockPersonalTasks);

  // Helper function to check if a task belongs to the current user (Shawn)
  const isMyTask = (task: Task): boolean => {
    const currentUserName = userProfile?.full_name || 'Shawn';
    
    // Check if assigned to me by exact name match
    if (task.assignee === currentUserName) return true;
    if (task.assignee === 'Shawn') return true;
    
    // Check if tagged to me (person tag with my name)
    if (task.tag.type === 'person' && task.tag.name === currentUserName) return true;
    if (task.tag.type === 'person' && task.tag.name === 'Shawn') return true;
    
    // Check if tagged to me (company tag and I'm the assignee)
    if (task.tag.type === 'company' && (task.assignee === currentUserName || task.assignee === 'Shawn')) return true;
    
    return false;
  };

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

  const handleTaskSave = (taskData: Omit<Task, 'id'>) => {
    console.log('Saving task:', taskData);
    
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id } : t);
      setTasks(updatedTasks);
      console.log('Updated tasks:', updatedTasks);
      toast({
        title: "Task Updated",
        description: `Task "${taskData.title}" has been updated successfully.`,
      });
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString()
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      console.log('New task created:', newTask);
      console.log('All tasks after creation:', updatedTasks);
      toast({
        title: "Task Created",
        description: `Task "${taskData.title}" has been created and assigned to ${taskData.assignee}.`,
      });
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setTaskModalPreset(null);
  };

  const handlePersonalTaskSave = (taskData: Omit<PersonalTask, 'id'>) => {
    if (editingPersonalTask) {
      setPersonalTasks(personalTasks.map(t => t.id === editingPersonalTask.id ? { ...taskData, id: editingPersonalTask.id } : t));
      toast({
        title: "Personal Task Updated",
        description: `Personal task "${taskData.title}" has been updated successfully.`,
      });
    } else {
      const newTask: PersonalTask = {
        ...taskData,
        id: Date.now().toString()
      };
      setPersonalTasks([...personalTasks, newTask]);
      toast({
        title: "Personal Task Created",
        description: `Personal task "${taskData.title}" has been created.`,
      });
    }
    setIsPersonalTaskModalOpen(false);
    setEditingPersonalTask(null);
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed' as const } : t
    ));
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const displayName = userProfile?.full_name || 'User';
  const firstName = displayName.split(' ')[0];

  // Get dates for filtering
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Filter for MY pending tasks that are due today, overdue, or due tomorrow
  const myPendingTasks = tasks.filter(task => {
    const isMyTaskResult = isMyTask(task);
    const isPending = task.status === 'pending';
    const isDueRelevant = task.dueDate === todayStr || task.dueDate === tomorrowStr || task.dueDate <= yesterdayStr;
    
    console.log('Task filtering:', {
      taskId: task.id,
      title: task.title,
      assignee: task.assignee,
      tag: task.tag,
      isMyTaskResult,
      isPending,
      isDueRelevant,
      dueDate: task.dueDate
    });
    
    return isMyTaskResult && isPending && isDueRelevant;
  });

  console.log('My pending tasks:', myPendingTasks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">Hello, {firstName}</h1>
              <p className="text-lg text-slate-600">Here's what's happening today - stay on top of your goals.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">Today</p>
                <p className="text-xl font-semibold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">{getInitials(displayName)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview
          meetingsCount={meetings.length}
          pendingTasksCount={myPendingTasks.length}
          onPendingTasksClick={() => setIsTaskBreakdownOpen(true)}
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Today's Meetings */}
          <div className="xl:col-span-5">
            <TodaysSchedule meetings={meetings} onBriefClick={handleBriefClick} />
          </div>

          {/* Task Management Pane */}
          <div className="xl:col-span-7">
            <TaskManagementPane 
              tasks={tasks}
              onAddPersonalTask={handleAddPersonalTask}
              onAddManualTask={handleAddManualTask}
              onAddTaskFromClient={handleAddTaskFromClient}
              isMyTask={isMyTask}
            />
          </div>
        </div>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
            setTaskModalPreset(null);
          }}
          onSave={handleTaskSave}
          task={editingTask}
          preset={taskModalPreset}
        />

        <PersonalTaskModal
          isOpen={isPersonalTaskModalOpen}
          onClose={() => {
            setIsPersonalTaskModalOpen(false);
            setEditingPersonalTask(null);
          }}
          onSave={handlePersonalTaskSave}
          task={editingPersonalTask}
        />

        <BriefModal
          isOpen={isBriefModalOpen}
          onClose={() => {
            setIsBriefModalOpen(false);
            setSelectedMeeting(null);
          }}
          meeting={selectedMeeting}
        />

        <TaskBreakdownModal
          isOpen={isTaskBreakdownOpen}
          onClose={() => setIsTaskBreakdownOpen(false)}
          tasks={myPendingTasks}
        />
      </div>
    </div>
  );
};

export default Dashboard;
