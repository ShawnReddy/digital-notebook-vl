
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, User, Clock, Flag, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  source: 'compass' | 'manual';
}

interface TaskManagementPaneProps {
  onAddPersonalTask: () => void;
}

const TaskManagementPane: React.FC<TaskManagementPaneProps> = ({ onAddPersonalTask }) => {
  const [activeTab, setActiveTab] = useState<'team' | 'personal'>('team');

  // Mock data - these would come from Compass CRM
  const teamTasks: Task[] = [
    {
      id: '1',
      title: 'Review Q4 sales pipeline with marketing team',
      assignee: 'Sarah Johnson',
      dueDate: '2024-12-30',
      dueTime: '10:00 AM',
      priority: 'high',
      status: 'pending',
      source: 'compass'
    },
    {
      id: '2',
      title: 'Complete client onboarding documentation',
      assignee: 'Mike Davis',
      dueDate: '2024-12-31',
      dueTime: '2:30 PM',
      priority: 'medium',
      status: 'pending',
      source: 'compass'
    },
    {
      id: '3',
      title: 'Prepare demo materials for prospect meeting',
      assignee: 'Emily Chen',
      dueDate: '2025-01-02',
      dueTime: '9:15 AM',
      priority: 'high',
      status: 'pending',
      source: 'compass'
    }
  ];

  const personalTasks: Task[] = [
    {
      id: '4',
      title: 'Follow up with ABC Corp proposal',
      assignee: 'Shawn',
      dueDate: '2024-12-30',
      dueTime: '3:00 PM',
      priority: 'high',
      status: 'pending',
      source: 'compass'
    },
    {
      id: '5',
      title: 'Review contract terms with legal team',
      assignee: 'Shawn',
      dueDate: '2024-12-31',
      dueTime: '11:30 AM',
      priority: 'medium',
      status: 'pending',
      source: 'manual'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderTaskList = (tasks: Task[], showAddButton = false) => (
    <div className="space-y-3">
      {showAddButton && (
        <Button 
          onClick={onAddPersonalTask}
          variant="outline"
          className="w-full justify-start border-dashed border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Personal Task
        </Button>
      )}
      {tasks.map((task) => (
        <div key={task.id} className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-slate-900 flex-1 pr-2">{task.title}</h4>
            <Badge className={`px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-slate-600">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold mr-2">
                  {getInitials(task.assignee)}
                </div>
                {task.assignee}
              </div>
              {task.source === 'compass' && (
                <Badge variant="outline" className="text-xs">
                  Compass
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-slate-500">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(task.dueDate)}
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {task.dueTime}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Task Management</CardTitle>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mt-4">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'team'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Team Tasks
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'personal'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            My Tasks
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {activeTab === 'team' && renderTaskList(teamTasks)}
        {activeTab === 'personal' && renderTaskList(personalTasks, true)}
      </CardContent>
    </Card>
  );
};

export default TaskManagementPane;
