
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockTasks, mockPersonalTasks, type Task, type PersonalTask } from '@/data/taskData';

export const useTaskManagement = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>(mockPersonalTasks);

  // Helper function to check if a task belongs to the current user
  const isMyTask = (task: Task): boolean => {
    const currentUserName = userProfile?.full_name || 'Shawn';
    
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
    if (task.assignee === 'Shawn') {
      console.log('Task is mine - assigned to Shawn');
      return true;
    }
    
    // Check if tagged to me (person tag with my name)
    if (task.tag.type === 'person' && task.tag.name === currentUserName) {
      console.log('Task is mine - tagged to current user name');
      return true;
    }
    if (task.tag.type === 'person' && task.tag.name === 'Shawn') {
      console.log('Task is mine - tagged to Shawn');
      return true;
    }
    
    // Check if tagged to me (company tag and I'm the assignee)
    if (task.tag.type === 'company' && (task.assignee === currentUserName || task.assignee === 'Shawn')) {
      console.log('Task is mine - company tag with me as assignee');
      return true;
    }
    
    console.log('Task is not mine');
    return false;
  };

  const handleTaskSave = (taskData: Omit<Task, 'id'>, editingTask?: Task | null) => {
    console.log('=== TASK SAVE START ===');
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
    
    console.log('=== TASK SAVE END ===');
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
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed' as const } : t
    ));
  };

  return {
    tasks,
    personalTasks,
    isMyTask,
    handleTaskSave,
    handlePersonalTaskSave,
    handleTaskComplete
  };
};
