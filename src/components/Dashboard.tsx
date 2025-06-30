
import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Edit, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskModal from './TaskModal';

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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Meetings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Today's Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl mr-3">{getTypeIcon(meeting.type)}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                    <p className="text-sm text-gray-600">{meeting.client}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {meeting.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Task Management</CardTitle>
                <Button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Today's Tasks */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                    Today ({tasksByCategory.today.length})
                  </h3>
                  <div className="space-y-2">
                    {tasksByCategory.today.map((task) => (
                      <div key={task.id} className="flex items-center p-3 bg-red-50 border border-red-100 rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskComplete(task.id)}
                          className="mr-3"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <User className="w-3 h-3 mr-1" />
                            {task.assignee}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* This Week's Tasks */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">This Week ({tasksByCategory.week.length})</h3>
                  <div className="space-y-2">
                    {tasksByCategory.week.map((task) => (
                      <div key={task.id} className="flex items-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskComplete(task.id)}
                          className="mr-3"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <User className="w-3 h-3 mr-1" />
                            {task.assignee}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overdue Tasks */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                    Overdue ({tasksByCategory.overdue.length})
                  </h3>
                  <div className="space-y-2">
                    {tasksByCategory.overdue.map((task) => (
                      <div key={task.id} className="flex items-center p-3 bg-red-100 border border-red-200 rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskComplete(task.id)}
                          className="mr-3"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <User className="w-3 h-3 mr-1" />
                            {task.assignee}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
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
    </div>
  );
};

export default Dashboard;
