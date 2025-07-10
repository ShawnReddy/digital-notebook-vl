
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { type Task, type TaskTag } from '@/data/taskData';

interface TaskFormData {
  title: string;
  assignee: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  category: 'today' | 'week' | 'overdue';
  tag: TaskTag;
  source: 'compass' | 'manual';
  clientType: 'clients' | 'prospects' | 'inactive' | 'mha' | 'personal';
}

interface UseTaskFormProps {
  task?: Task | null;
  preset?: {
    account: string;
    contact: string;
  } | null;
  isOpen: boolean;
}

// Team members for assignment
export const teamMembers = [
  'Shawn Reddy',
  'Sarah Johnson',
  'Mike Chen',
  'Lisa Wang',
  'David Rodriguez',
  'Alex Thompson',
  'Jennifer Lee',
  'Robert Kim',
  'Amanda Foster',
  'Kevin O\'Brien'
];

export const useTaskForm = ({ task, preset, isOpen }: UseTaskFormProps) => {
  const { userProfile } = useAuth();
  const currentUserName = userProfile?.full_name || 'Shawn Reddy';

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    assignee: currentUserName,
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    status: 'pending',
    category: 'today',
    tag: {
      type: 'account',
      name: ''
    },
    source: 'manual',
    clientType: 'clients'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        assignee: task.assignee, // Keep original assignee for editing
        dueDate: task.dueDate,
        dueTime: task.dueTime,
        priority: task.priority,
        status: task.status,
        category: task.category,
        tag: task.tag,
        source: task.source,
        clientType: task.clientType
      });
    } else if (preset) {
      setFormData({
        title: '',
        assignee: currentUserName,
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        status: 'pending',
        category: 'today',
        tag: {
          type: 'contact',
          name: preset.contact,
          account: preset.account
        },
        source: 'manual',
        clientType: 'clients'
      });
    } else {
      setFormData({
        title: '',
        assignee: currentUserName,
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        status: 'pending',
        category: 'today',
        tag: {
          type: 'account',
          name: ''
        },
        source: 'manual',
        clientType: 'clients'
      });
    }
  }, [task, preset, isOpen, currentUserName]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagTypeChange = (type: 'account' | 'contact' | 'personal') => {
    setFormData(prev => ({
      ...prev,
      tag: {
        type,
        name: '',
        ...(type === 'contact' ? { account: '' } : {})
      },
      clientType: type === 'personal' ? 'personal' : 'clients'
    }));
  };

  const handleTagNameChange = (name: string, people?: Array<{ name: string; account: string }>) => {
    if (formData.tag.type === 'contact') {
      setFormData(prev => ({
        ...prev,
        tag: {
          ...prev.tag,
          name,
          account: prev.tag.account || ''
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tag: {
          ...prev.tag,
          name
        }
      }));
    }
  };

  const handleTagAccountChange = (account: string) => {
    if (formData.tag.type === 'contact') {
      setFormData(prev => ({
        ...prev,
        tag: {
          ...prev.tag,
          account,
          name: '' // Reset contact name when account changes
        }
      }));
    }
  };

  return {
    formData,
    currentUserName,
    handleInputChange,
    handleTagTypeChange,
    handleTagNameChange,
    handleTagAccountChange
  };
};
