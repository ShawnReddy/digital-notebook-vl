
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Check, Edit, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  category: 'today' | 'week' | 'overdue';
}

interface TaskSectionProps {
  tasks: Task[];
  onAddTask: () => void;
  onCompleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const TaskSection: React.FC<TaskSectionProps> = ({
  tasks,
  onAddTask,
  onCompleteTask,
  onEditTask
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const tasksByCategory = {
    today: tasks.filter(t => t.category === 'today'),
    week: tasks.filter(t => t.category === 'week'),
    overdue: tasks.filter(t => t.category === 'overdue')
  };

  const renderTaskGroup = (title: string, tasks: Task[], color: string, icon?: React.ReactNode) => (
    <div>
      <div className="flex items-center mb-4">
        <div className={`w-2 h-2 ${color} rounded-full mr-3`}></div>
        <h3 className="font-bold text-slate-900 flex items-center">
          {icon}
          {title}
          <span className={`ml-2 px-2 py-1 ${color.replace('bg-', 'bg-').replace('-500', '-100')} ${color.replace('bg-', 'text-').replace('-500', '-700')} text-xs rounded-full font-semibold`}>
            {tasks.length}
          </span>
        </h3>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className={`group flex items-center p-4 bg-gradient-to-r ${getTaskBgColor(task.category)} border ${getTaskBorderColor(task.category)} rounded-xl hover:shadow-md transition-all duration-200`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCompleteTask(task.id)}
              className="mr-4 w-8 h-8 rounded-full border-2 border-slate-300 hover:border-green-500 hover:bg-green-50 flex-shrink-0"
            >
              <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 text-green-600" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold text-slate-900 group-hover:${getTaskHoverColor(task.category)} transition-colors`}>
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
              onClick={() => onEditTask(task)}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const getTaskBgColor = (category: string) => {
    switch (category) {
      case 'today': return 'from-red-50 to-pink-50';
      case 'week': return 'from-blue-50 to-indigo-50';
      case 'overdue': return 'from-orange-50 to-red-50';
      default: return 'from-gray-50 to-slate-50';
    }
  };

  const getTaskBorderColor = (category: string) => {
    switch (category) {
      case 'today': return 'border-red-100';
      case 'week': return 'border-blue-100';
      case 'overdue': return 'border-orange-200';
      default: return 'border-gray-100';
    }
  };

  const getTaskHoverColor = (category: string) => {
    switch (category) {
      case 'today': return 'text-red-700';
      case 'week': return 'text-blue-700';
      case 'overdue': return 'text-orange-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900">Task Management</CardTitle>
          <Button 
            onClick={onAddTask}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {renderTaskGroup('Today', tasksByCategory.today, 'bg-red-500')}
        {renderTaskGroup('This Week', tasksByCategory.week, 'bg-blue-500')}
        {renderTaskGroup('Overdue', tasksByCategory.overdue, 'bg-orange-500', <AlertCircle className="w-4 h-4 mr-1 text-orange-500" />)}
      </CardContent>
    </Card>
  );
};

export default TaskSection;
