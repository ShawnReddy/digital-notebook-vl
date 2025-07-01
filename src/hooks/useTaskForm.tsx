
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
    company: string;
    person: string;
  } | null;
  isOpen: boolean;
}

export const useTaskForm = ({ task, preset, isOpen }: UseTaskFormProps) => {
  const { userProfile } = useAuth();
  const currentUserName = userProfile?.full_name || 'Shawn';

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    assignee: currentUserName,
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    status: 'pending',
    category: 'today',
    tag: {
      type: 'company',
      name: ''
    },
    source: 'manual',
    clientType: 'clients'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        assignee: currentUserName, // Always assign to current user
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
          type: 'person',
          name: preset.person,
          company: preset.company
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
          type: 'company',
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

  const handleTagTypeChange = (type: 'company' | 'person' | 'personal') => {
    setFormData(prev => ({
      ...prev,
      tag: {
        type,
        name: '',
        ...(type === 'person' ? { company: '' } : {})
      },
      clientType: type === 'personal' ? 'personal' : 'clients'
    }));
  };

  const handleTagNameChange = (name: string, people?: Array<{ name: string; company: string }>) => {
    if (formData.tag.type === 'person') {
      setFormData(prev => ({
        ...prev,
        tag: {
          ...prev.tag,
          name,
          company: prev.tag.company || ''
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

  const handleTagCompanyChange = (company: string) => {
    if (formData.tag.type === 'person') {
      setFormData(prev => ({
        ...prev,
        tag: {
          ...prev.tag,
          company,
          name: '' // Reset person name when company changes
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
    handleTagCompanyChange
  };
};
