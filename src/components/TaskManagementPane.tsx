import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Users, User, Clock, Flag, Calendar, Info, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Mock data - these would come from Compass CRM
  const [teamTasks, setTeamTasks] = useState<Task[]>([
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
  ]);

  const [personalTasks, setPersonalTasks] = useState<Task[]>([
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
  ]);

  const handleCompleteTask = (taskId: string, isTeamTask: boolean) => {
    if (isTeamTask) {
      const task = teamTasks.find(t => t.id === taskId);
      setTeamTasks(teamTasks.filter(t => t.id !== taskId));
      toast({
        title: "Task Completed",
        description: `"${task?.title}" has been marked as complete and removed.`,
      });
    } else {
      const task = personalTasks.find(t => t.id === taskId);
      setPersonalTasks(personalTasks.filter(t => t.id !== taskId));
      toast({
        title: "Task Completed",
        description: `"${task?.title}" has been marked as complete and removed.`,
      });
    }
  };

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

  const renderTaskList = (tasks: Task[], showAddButton = false, isTeamTask = true) => (
    <div className="space-y-3">
      {showAddButton && (
        <div className="flex justify-end mb-4">
          <Button 
            onClick={onAddPersonalTask}
            variant="outline"
            size="sm"
            className="border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm"
          >
            <Plus className="w-3 h-3 mr-1" strokeWidth={2.5} />
            Add Task
          </Button>
        </div>
      )}
      {tasks.map((task) => (
        <div key={task.id} className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:border-blue-200 hover:-translate-y-0.5">
          {/* Priority indicator line */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
            task.priority === 'high' ? 'bg-red-400' :
            task.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
          }`} />
          
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-semibold text-slate-900 flex-1 pr-3 leading-relaxed group-hover:text-blue-900 transition-colors duration-200">
              {task.title}
            </h4>
            <div className="flex items-center space-x-2">
              <Badge className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)} flex items-center space-x-1.5`}>
                {getPriorityIcon(task.priority)}
                <span className="capitalize">{task.priority}</span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCompleteTask(task.id, isTeamTask)}
                className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0 rounded-full bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300"
                title="Mark as complete"
              >
                <Check className="w-4 h-4 text-green-600" />
              </Button>
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
                {personalTasks.length}
              </div>
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 max-h-96 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {activeTab === 'team' && renderTaskList(teamTasks, false, true)}
          {activeTab === 'personal' && renderTaskList(personalTasks, true, false)}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TaskManagementPane;
