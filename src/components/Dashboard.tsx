import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Edit, Check, AlertCircle, ArrowRight, Users, Building2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import TaskModal from './TaskModal';
import BriefModal from './BriefModal';

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
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  category: 'today' | 'week' | 'overdue';
}

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'meeting': return '🤝';
      case 'demo': return '💻';
      default: return '📅';
    }
  };

  const tasksByCategory = {
    today: tasks.filter(t => t.category === 'today'),
    week: tasks.filter(t => t.category === 'week'),
    overdue: tasks.filter(t => t.category === 'overdue')
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
              <h1 className="text-4xl font-bold text-slate-900 mb-3">Good morning, {firstName}</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Today's Meetings</p>
                  <p className="text-3xl font-bold text-slate-900">{meetings.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Pending Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">{tasks.filter(t => t.status === 'pending').length}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Active Clients</p>
                  <p className="text-3xl font-bold text-slate-900">24</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Today's Meetings */}
          <div className="xl:col-span-5">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                    Today's Schedule
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {meetings.map((meeting, index) => (
                  <div key={meeting.id} className="group relative">
                    <div className="flex items-center p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-lg mr-4">
                        {getTypeIcon(meeting.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {meeting.title}
                        </h4>
                        <p className="text-slate-600 flex items-center mt-1">
                          <Building2 className="w-4 h-4 mr-1" />
                          {meeting.client}
                        </p>
                        <div className="flex items-center text-sm text-slate-500 mt-2">
                          <Clock className="w-4 h-4 mr-1" />
                          {meeting.time}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex flex-col space-y-2">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Join
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleBriefClick(meeting)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:from-emerald-100 hover:to-teal-100"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Brief
                        </Button>
                      </div>
                    </div>
                    {index < meetings.length - 1 && (
                      <div className="absolute left-6 top-16 w-px h-4 bg-slate-200"></div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tasks Section */}
          <div className="xl:col-span-7">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-slate-900">Task Management</CardTitle>
                  <Button 
                    onClick={() => setIsTaskModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Today's Tasks */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <h3 className="font-bold text-slate-900 flex items-center">
                      Today
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                        {tasksByCategory.today.length}
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {tasksByCategory.today.map((task) => (
                      <div key={task.id} className="group flex items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-xl hover:shadow-md transition-all duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskComplete(task.id)}
                          className="mr-4 w-8 h-8 rounded-full border-2 border-slate-300 hover:border-green-500 hover:bg-green-50 flex-shrink-0"
                        >
                          <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 text-green-600" />
                        </Button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                              {task.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-slate-600">
                            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mr-2">
                              {getInitials(task.assignee)}
                            </div>
                            {task.assignee}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* This Week's Tasks */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <h3 className="font-bold text-slate-900 flex items-center">
                      This Week
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                        {tasksByCategory.week.length}
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {tasksByCategory.week.map((task) => (
                      <div key={task.id} className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl hover:shadow-md transition-all duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskComplete(task.id)}
                          className="mr-4 w-8 h-8 rounded-full border-2 border-slate-300 hover:border-green-500 hover:bg-green-50 flex-shrink-0"
                        >
                          <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 text-green-600" />
                        </Button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                              {task.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-slate-600">
                            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mr-2">
                              {getInitials(task.assignee)}
                            </div>
                            {task.assignee}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overdue Tasks */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <h3 className="font-bold text-slate-900 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-orange-500" />
                      Overdue
                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
                        {tasksByCategory.overdue.length}
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {tasksByCategory.overdue.map((task) => (
                      <div key={task.id} className="group flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl hover:shadow-md transition-all duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskComplete(task.id)}
                          className="mr-4 w-8 h-8 rounded-full border-2 border-slate-300 hover:border-green-500 hover:bg-green-50 flex-shrink-0"
                        >
                          <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 text-green-600" />
                        </Button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 group-hover:text-orange-700 transition-colors">
                              {task.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-slate-600">
                            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mr-2">
                              {getInitials(task.assignee)}
                            </div>
                            {task.assignee}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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

        <BriefModal
          isOpen={isBriefModalOpen}
          onClose={() => {
            setIsBriefModalOpen(false);
            setSelectedMeeting(null);
          }}
          meeting={selectedMeeting}
        />
      </div>
    </div>
  );
};

export default Dashboard;
