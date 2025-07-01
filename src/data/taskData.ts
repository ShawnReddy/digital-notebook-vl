
export interface TaskTag {
  type: 'company' | 'person' | 'personal';
  name: string;
  company?: string; // For person type, this would be their company
}

export interface Task {
  id: string;
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

export interface PersonalTask {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  tag: TaskTag;
  source: 'manual';
}

// Get today and tomorrow dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const todayStr = today.toISOString().split('T')[0];
const tomorrowStr = tomorrow.toISOString().split('T')[0];
const yesterdayStr = yesterday.toISOString().split('T')[0];

// Centralized task data that all components will use
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with ABC Corp proposal',
    assignee: 'John Smith',
    dueDate: todayStr,
    dueTime: '10:00 AM',
    priority: 'high',
    status: 'pending',
    category: 'today',
    tag: {
      type: 'company',
      name: 'ABC Corporation'
    },
    source: 'compass',
    clientType: 'clients'
  },
  {
    id: '2',
    title: 'Prepare demo for XYZ Solutions',
    assignee: 'Sarah Johnson',
    dueDate: tomorrowStr,
    dueTime: '2:30 PM',
    priority: 'medium',
    status: 'pending',
    category: 'week',
    tag: {
      type: 'company',
      name: 'XYZ Solutions Ltd'
    },
    source: 'compass',
    clientType: 'prospects'
  },
  {
    id: '3',
    title: 'Send contract to DEF Industries',
    assignee: 'Mike Davis',
    dueDate: yesterdayStr,
    dueTime: '11:15 AM',
    priority: 'high',
    status: 'pending',
    category: 'overdue',
    tag: {
      type: 'company',
      name: 'DEF Industries'
    },
    source: 'compass',
    clientType: 'inactive'
  },
  {
    id: '4',
    title: 'Review MHA compliance documents',
    assignee: 'Emily Chen',
    dueDate: todayStr,
    dueTime: '3:45 PM',
    priority: 'medium',
    status: 'pending',
    category: 'today',
    tag: {
      type: 'company',
      name: 'MHA Regional Office'
    },
    source: 'compass',
    clientType: 'mha'
  },
  {
    id: '5',
    title: 'Schedule quarterly review meeting',
    assignee: 'David Wilson',
    dueDate: tomorrowStr,
    dueTime: '9:30 AM',
    priority: 'low',
    status: 'pending',
    category: 'week',
    tag: {
      type: 'company',
      name: 'Global Tech Solutions'
    },
    source: 'compass',
    clientType: 'clients'
  },
  {
    id: '6',
    title: 'Review contract terms with legal team',
    assignee: 'Shawn',
    dueDate: tomorrowStr,
    dueTime: '11:30 AM',
    priority: 'medium',
    status: 'pending',
    category: 'week',
    tag: {
      type: 'person',
      name: 'Jennifer Martinez',
      company: 'ABC Corporation'
    },
    source: 'manual',
    clientType: 'clients'
  },
  {
    id: '7',
    title: 'Prepare presentation for board meeting',
    assignee: 'Shawn',
    dueDate: todayStr,
    dueTime: '1:00 PM',
    priority: 'high',
    status: 'pending',
    category: 'today',
    tag: {
      type: 'personal',
      name: 'Personal Task'
    },
    source: 'manual',
    clientType: 'personal'
  },
  {
    id: '8',
    title: 'Call back prospective client Sarah Williams',
    assignee: 'Shawn',
    dueDate: todayStr,
    dueTime: '4:30 PM',
    priority: 'high',
    status: 'pending',
    category: 'today',
    tag: {
      type: 'person',
      name: 'Sarah Williams',
      company: 'Innovative Solutions Inc'
    },
    source: 'compass',
    clientType: 'prospects'
  }
];

export const mockPersonalTasks: PersonalTask[] = [
  {
    id: '9',
    title: 'Update LinkedIn profile',
    dueDate: todayStr,
    dueTime: '6:00 PM',
    priority: 'low',
    status: 'pending',
    tag: {
      type: 'personal',
      name: 'Personal Development'
    },
    source: 'manual'
  },
  {
    id: '10',
    title: 'Book dentist appointment',
    dueDate: tomorrowStr,
    dueTime: '12:00 PM',
    priority: 'medium',
    status: 'pending',
    tag: {
      type: 'personal',
      name: 'Health & Wellness'
    },
    source: 'manual'
  }
];

// Helper functions to filter and categorize tasks
export const getTasksByStatus = (tasks: Task[], status: 'pending' | 'completed') => {
  return tasks.filter(task => task.status === status);
};

export const getTasksByDate = (tasks: Task[], targetDate: string) => {
  return tasks.filter(task => task.dueDate === targetDate);
};

export const getTasksByAssignee = (tasks: Task[], assignee: string) => {
  return tasks.filter(task => task.assignee === assignee);
};

export const getTasksByClientType = (tasks: Task[], clientType: string) => {
  return tasks.filter(task => task.clientType === clientType);
};

export const getTeamTasks = (tasks: Task[]) => {
  return tasks.filter(task => task.assignee !== 'Shawn');
};

export const getMyTasks = (tasks: Task[]) => {
  return tasks.filter(task => task.assignee === 'Shawn');
};
