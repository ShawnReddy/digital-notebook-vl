
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Flag, Users, UserCheck, UserX, Building, User } from 'lucide-react';
import { type Task } from '@/data/taskData';

interface TaskBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const TaskBreakdownModal: React.FC<TaskBreakdownModalProps> = ({ isOpen, onClose, tasks }) => {
  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'clients': return <Users className="w-4 h-4 text-blue-600" />;
      case 'prospects': return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'inactive': return <UserX className="w-4 h-4 text-gray-600" />;
      case 'mha': return <Building className="w-4 h-4 text-purple-600" />;
      case 'personal': return <User className="w-4 h-4 text-indigo-600" />;
      default: return <Users className="w-4 h-4 text-blue-600" />;
    }
  };

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'clients': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'prospects': return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'mha': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'personal': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTagDisplay = (task: Task) => {
    switch (task.tag.type) {
      case 'company':
        return task.tag.name;
      case 'person':
        return `${task.tag.name}${task.tag.company ? ` (${task.tag.company})` : ''}`;
      case 'personal':
        return 'Personal Task';
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

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.clientType]) {
      acc[task.clientType] = [];
    }
    acc[task.clientType].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const clientTypeLabels = {
    clients: 'Active Clients',
    prospects: 'Prospects',
    inactive: 'Inactive Clients',
    mha: 'MHA',
    personal: 'Personal Tasks'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
              <Flag className="w-4 h-4 text-white" />
            </div>
            Task Breakdown Overview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {Object.entries(groupedTasks).map(([clientType, typeTasks]) => (
            <Card key={clientType} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  {getClientTypeIcon(clientType)}
                  <span className="ml-2">{clientTypeLabels[clientType as keyof typeof clientTypeLabels]}</span>
                  <Badge className={`ml-3 px-2 py-1 text-xs font-medium ${getClientTypeColor(clientType)}`}>
                    {typeTasks.length} {typeTasks.length === 1 ? 'task' : 'tasks'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {typeTasks.map((task) => (
                  <div key={task.id} className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:border-blue-200 hover:-translate-y-0.5">
                    {/* Priority indicator line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                      task.priority === 'high' ? 'bg-red-400' :
                      task.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-3">
                        <h4 className="font-semibold text-slate-900 leading-relaxed group-hover:text-blue-900 transition-colors duration-200 mb-1">
                          {task.title}
                        </h4>
                        <div className="flex items-center text-sm text-slate-600 font-medium mb-1">
                          {getTagIcon(task.tag.type)}
                          <span className="ml-1">Tagged to: {getTagDisplay(task)}</span>
                        </div>
                        {task.source === 'compass' && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                            Compass
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)} flex items-center space-x-1`}>
                          {getPriorityIcon(task.priority)}
                          <span className="capitalize">{task.priority}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-600">
                        <div className="w-7 h-7 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-xs font-bold mr-2 shadow-sm">
                          {getInitials(task.assignee)}
                        </div>
                        <span className="font-medium text-sm">{task.assignee}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-slate-500">
                        <div className="flex items-center bg-slate-50 px-2 py-1 rounded-full">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="text-xs font-medium">{formatDate(task.dueDate)}</span>
                        </div>
                        <div className="flex items-center bg-slate-50 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3 mr-1" />
                          <span className="text-xs font-medium">{task.dueTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
          
          {Object.keys(groupedTasks).length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Flag className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">No pending tasks</p>
              <p className="text-sm">You're all caught up! Great work.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskBreakdownModal;
