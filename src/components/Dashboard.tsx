import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TaskModal from './TaskModal';
import BriefModal from './BriefModal';
import PersonalTaskModal from './PersonalTaskModal';
import StatsOverview from './StatsOverview';
import TodaysSchedule from './TodaysSchedule';
import TaskManagementPane from './TaskManagementPane';
import TaskBreakdownModal from './TaskBreakdownModal';

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  category: 'today' | 'week' | 'overdue';
}

interface PersonalTask {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
}

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPersonalTaskModalOpen, setIsPersonalTaskModalOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTaskBreakdownOpen, setIsTaskBreakdownOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingPersonalTask, setEditingPersonalTask] = useState<PersonalTask | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Follow up with ABC Corp proposal',
      assignee: 'John Smith',
      dueDate: '2024-12-30',
      priority: 'high',
      status: 'pending',
      category: 'today'
    },
    {
      id: '2',
      title: 'Prepare demo for XYZ Solutions',
      assignee: 'Sarah Johnson',
      dueDate: '2024-12-31',
      priority: 'medium',
      status: 'pending',
      category: 'week'
    },
    {
      id: '3',
      title: 'Send contract to DEF Industries',
      assignee: 'Mike Davis',
      dueDate: '2024-12-28',
      priority: 'high',
      status: 'pending',
      category: 'overdue'
    }
  ]);

  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([]);

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

  // Enhanced task data with client information for breakdown
  const enhancedTasks = [
    {
      id: '1',
      title: 'Follow up with ABC Corp proposal',
      assignee: 'John Smith',
      dueDate: '2024-12-30',
      dueTime: '10:00 AM',
      priority: 'high' as const,
      status: 'pending' as const,
      clientType: 'clients' as const,
      clientName: 'ABC Corporation'
    },
    {
      id: '2',
      title: 'Prepare demo for XYZ Solutions',
      assignee: 'Sarah Johnson',
      dueDate: '2024-12-31',
      dueTime: '2:30 PM',
      priority: 'medium' as const,
      status: 'pending' as const,
      clientType: 'prospects' as const,
      clientName: 'XYZ Solutions Ltd'
    },
    {
      id: '3',
      title: 'Send contract to DEF Industries',
      assignee: 'Mike Davis',
      dueDate: '2024-12-28',
      dueTime: '11:15 AM',
      priority: 'high' as const,
      status: 'pending' as const,
      clientType: 'inactive' as const,
      clientName: 'DEF Industries'
    },
    {
      id: '4',
      title: 'Review MHA compliance documents',
      assignee: 'Emily Chen',
      dueDate: '2024-12-30',
      dueTime: '3:45 PM',
      priority: 'medium' as const,
      status: 'pending' as const,
      clientType: 'mha' as const,
      clientName: 'MHA Regional Office'
    },
    {
      id: '5',
      title: 'Schedule quarterly review meeting',
      assignee: 'David Wilson',
      dueDate: '2024-12-29',
      dueTime: '9:30 AM',
      priority: 'low' as const,
      status: 'pending' as const,
      clientType: 'clients' as const,
      clientName: 'Global Tech Solutions'
    }
  ];

  const handleTaskSave = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id } : t));
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString()
      };
      setTasks([...tasks, newTask]);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handlePersonalTaskSave = (taskData: Omit<PersonalTask, 'id'>) => {
    if (editingPersonalTask) {
      setPersonalTasks(personalTasks.map(t => t.id === editingPersonalTask.id ? { ...taskData, id: editingPersonalTask.id } : t));
    } else {
      const newTask: PersonalTask = {
        ...taskData,
        id: Date.now().toString()
      };
      setPersonalTasks([...personalTasks, newTask]);
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const displayName = userProfile?.full_name || 'User';
  const firstName = displayName.split(' ')[0];

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
          pendingTasksCount={enhancedTasks.filter(t => t.status === 'pending').length}
          onPendingTasksClick={() => setIsTaskBreakdownOpen(true)}
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Today's Meetings */}
          <div className="xl:col-span-5">
            <TodaysSchedule meetings={meetings} onBriefClick={handleBriefClick} />
          </div>

          {/* Task Management Pane */}
          <div className="xl:col-span-7">
            <TaskManagementPane onAddPersonalTask={() => setIsPersonalTaskModalOpen(true)} />
          </div>
        </div>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleTaskSave}
          task={editingTask}
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
          tasks={enhancedTasks.filter(t => t.status === 'pending')}
        />
      </div>
    </div>
  );
};

export default Dashboard;
