
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockPersonalTasks, getMockTasks, type Task, type PersonalTask } from '@/data/taskData';

interface TaskContextType {
  tasks: Task[];
  personalTasks: PersonalTask[];
  isMyTask: (task: Task) => boolean;
  handleTaskSave: (taskData: Omit<Task, 'id'>, editingTask?: Task | null) => void;
  handlePersonalTaskSave: (taskData: Omit<PersonalTask, 'id'>, editingPersonalTask?: PersonalTask | null) => void;
  handleTaskComplete: (taskId: string) => void;
  refreshTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(getMockTasks());
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>(mockPersonalTasks);

  // Refresh tasks when user profile changes
  useEffect(() => {
    setTasks(getMockTasks());
  }, [userProfile]);

  const refreshTasks = () => {
    setTasks(getMockTasks());
  };

  // Helper function to check if a task belongs to the current user
  const isMyTask = (task: Task): boolean => {
    const currentUserName = userProfile?.full_name || 'Shawn Reddy';
    
    console.log('Checking isMyTask for:', {
      taskId: task.id,
      title: task.title,
      assignee: task.assignee,
      currentUserName,
      tag: task.tag
    });
    
    // Check if assigned to me by exact name match
    if (task.assignee === currentUserName) {
      console.log('Task is mine - assigned to current user name');
      return true;
    }
    if (task.assignee === 'Shawn Reddy') {
      console.log('Task is mine - assigned to Shawn Reddy');
      return true;
    }
    
    // Check if tagged to me (contact tag with my name)
    if (task.tag.type === 'contact' && task.tag.name === currentUserName) {
      console.log('Task is mine - tagged to current user name');
      return true;
    }
    if (task.tag.type === 'contact' && task.tag.name === 'Shawn Reddy') {
      console.log('Task is mine - tagged to Shawn Reddy');
      return true;
    }
    
    // Check if tagged to me (account tag and I'm the assignee)
    if (task.tag.type === 'account' && (task.assignee === currentUserName || task.assignee === 'Shawn Reddy')) {
      console.log('Task is mine - account tag with me as assignee');
      return true;
    }
    
    console.log('Task is not mine');
    return false;
  };

  const handleTaskSave = (taskData: Omit<Task, 'id'>, editingTask?: Task | null) => {
    console.log('=== GLOBAL TASK SAVE START ===');
    console.log('Saving task data:', taskData);
    console.log('Current tasks before save:', tasks);
    
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id } : t);
      setTasks(updatedTasks);
      console.log('Updated existing task, new tasks array:', updatedTasks);
      toast({
        title: "Task Updated",
        description: `Task "${taskData.title}" has been updated successfully.`,
      });
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString()
      };
      console.log('Creating new task:', newTask);
      console.log('Is this new task mine?', isMyTask(newTask));
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      console.log('Added new task, updated tasks array:', updatedTasks);
      console.log('Total tasks after addition:', updatedTasks.length);
      
      toast({
        title: "Task Created",
        description: `Task "${taskData.title}" has been created successfully.`,
      });
    }
    
    console.log('=== GLOBAL TASK SAVE END ===');
  };

  const handlePersonalTaskSave = (taskData: Omit<PersonalTask, 'id'>, editingPersonalTask?: PersonalTask | null) => {
    if (editingPersonalTask) {
      setPersonalTasks(personalTasks.map(t => t.id === editingPersonalTask.id ? { ...taskData, id: editingPersonalTask.id } : t));
      toast({
        title: "Personal Task Updated",
        description: `Personal task "${taskData.title}" has been updated successfully.`,
      });
    } else {
      const newTask: PersonalTask = {
        ...taskData,
        id: Date.now().toString()
      };
      setPersonalTasks([...personalTasks, newTask]);
      toast({
        title: "Personal Task Created",
        description: `Personal task "${taskData.title}" has been created.`,
      });
    }
  };

  const handleTaskComplete = (taskId: string) => {
    // Remove the task from the tasks array instead of just marking it as completed
    setTasks(tasks.filter(t => t.id !== taskId));
    toast({
      title: "Task Completed",
      description: "Task has been completed and removed from your list.",
    });
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      personalTasks,
      isMyTask,
      handleTaskSave,
      handlePersonalTaskSave,
      handleTaskComplete,
      refreshTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};
