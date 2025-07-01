import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Users, User, Clock, Flag, Calendar, Info, Building } from 'lucide-react';
import { getTasksByDate, getTeamTasks, getMyTasks, type Task } from '@/data/taskData';
import { useAuth } from '@/contexts/AuthContext';

interface TaskManagementPaneProps {
  tasks: Task[];
  onAddPersonalTask: () => void;
  onAddManualTask: () => void;
  onAddTaskFromClient: (preset: { company: string; person: string }) => void;
  isMyTask: (task: Task) => boolean;
}

const TaskManagementPane: React.FC<TaskManagementPaneProps> = ({ 
  tasks, 
  onAddPersonalTask, 
  onAddManualTask,
  onAddTaskFromClient,
  isMyTask
}) => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'team' | 'personal'>('team');

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
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    const iconClass = "w-3 h-3";
    switch (priority) {
      case 'high': return <Flag className={`${iconClass} text-red-500`} fill="currentColor" />;
      case 'medium': return <Flag className={`${iconClass} text-amber-500`} fill="currentColor" />;
      case 'low': return <Flag className={`${iconClass} text-emerald-500`} fill="currentColor" />;
      default: return <Flag className={`${iconClass} text-gray-500`} />;
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
      case 'company': return <Building className="w-3 h-3" />;
      case 'person': return <User className="w-3 h-3" />;
      case 'personal': return <User className="w-3 h-3" />;
      default: return <Building className="w-3 h-3" />;
    }
  };

  const renderTaskList = (tasks: Task[]) => (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:border-blue-200 hover:-translate-y-0.5">
          {/* Priority indicator line */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
            task.priority === 'high' ? 'bg-red-400' :
            task.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
          }`} />
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-3">
              <h4 className="font-semibold text-slate-900 leading-relaxed group-hover:text-blue-900 transition-colors duration-200 mb-2">
                {task.title}
              </h4>
              <div className="flex items-center text-xs text-slate-600 mb-2">
                {getTagIcon(task.tag.type)}
                <span className="ml-1 font-medium">Tagged to: {getTagDisplay(task)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)} flex items-center space-x-1.5`}>
                {getPriorityIcon(task.priority)}
                <span className="capitalize">{task.priority}</span>
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-slate-600">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 shadow-sm">
                  {getInitials(task.assignee)}
                </div>
                <span className="font-medium">{task.assignee}</span>
              </div>
              {task.source === 'compass' && (
                <Badge variant="outline" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
                  Compass
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-slate-500">
              <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-sm font-medium">{formatDate(task.dueDate)}</span>
              </div>
              <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-sm font-medium">{task.dueTime}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTaskSection = (title: string, tasks: Task[], showAddButton = false) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {showAddButton && (
          <Button 
            onClick={activeTab === 'personal' ? onAddPersonalTask : onAddManualTask}
            variant="outline"
            size="sm"
            className="border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm"
          >
            <Plus className="w-3 h-3 mr-1" strokeWidth={2.5} />
            Add Task
          </Button>
        )}
      </div>
      {tasks.length > 0 ? (
        renderTaskList(tasks)
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p>No tasks scheduled for this day</p>
        </div>
      )}
    </div>
  );

  const currentTasks = activeTab === 'team' ? teamTasks : myTasks;
  const todayTasks = getTasksByDate(currentTasks, todayStr);
  const tomorrowTasks = getTasksByDate(currentTasks, tomorrowStr);

  return (
    <TooltipProvider>
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-sm h-full">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <Flag className="w-4 h-4 text-white" />
              </div>
              Task Management
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 p-1 h-6 w-6 hover:bg-blue-100">
                    <Info className="w-3 h-3 text-slate-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Information is populated via your Compass account</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </div>
          
          {/* Enhanced Tab Navigation */}
          <div className="flex space-x-1 bg-slate-100/70 rounded-xl p-1.5 mt-6 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'team'
                  ? 'bg-white text-blue-700 shadow-md shadow-blue-100/50 transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-4 h-4 mr-2" strokeWidth={2.5} />
              Team Tasks
              <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'team' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {teamTasks.length}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'personal'
                  ? 'bg-white text-blue-700 shadow-md shadow-blue-100/50 transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <User className="w-4 h-4 mr-2" strokeWidth={2.5} />
              My Tasks
              <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'personal' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {myTasks.length}
              </div>
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 max-h-96 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {renderTaskSection('Due Today', todayTasks, true)}
          {renderTaskSection('Due Tomorrow', tomorrowTasks)}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TaskManagementPane;
