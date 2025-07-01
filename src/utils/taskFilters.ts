
import { type Task } from '@/data/taskData';

export const getMyPendingTasks = (tasks: Task[], isMyTask: (task: Task) => boolean) => {
  // Get dates for filtering
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  console.log('=== FILTERING TASKS ===');
  console.log('All tasks:', tasks);
  console.log('Today:', todayStr, 'Tomorrow:', tomorrowStr, 'Yesterday:', yesterdayStr);

  // Filter for MY pending tasks that are due today, overdue, or due tomorrow
  const myPendingTasks = tasks.filter(task => {
    const isMyTaskResult = isMyTask(task);
    const isPending = task.status === 'pending';
    const isDueRelevant = task.dueDate === todayStr || task.dueDate === tomorrowStr || task.dueDate <= yesterdayStr;
    
    console.log('Task filtering:', {
      taskId: task.id,
      title: task.title,
      assignee: task.assignee,
      tag: task.tag,
      isMyTaskResult,
      isPending,
      isDueRelevant,
      dueDate: task.dueDate,
      status: task.status
    });
    
    return isMyTaskResult && isPending && isDueRelevant;
  });

  console.log('My pending tasks result:', myPendingTasks);
  console.log('My pending tasks count:', myPendingTasks.length);

  return myPendingTasks;
};
