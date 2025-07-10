
export interface TaskTag {
  type: 'account' | 'contact' | 'personal';
  name: string;
  account?: string; // For contact type, this would be their account
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
  clientType: 'clients' | 'prospects' | 'inactive' | 'mha' | 'personal' | 'alumni';
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

// Helper function to get current user name for dynamic task assignment
const getCurrentUserName = (): string => {
  const savedSession = localStorage.getItem('mock-session');
  if (savedSession) {
    try {
      const sessionData = JSON.parse(savedSession);
      return sessionData.user.user_metadata.full_name || 'Demo User';
    } catch (error) {
      console.error('Error parsing saved session:', error);
    }
  }
  return 'Demo User';
};

// Centralized task data that all components will use
export const getMockTasks = (): Task[] => {
  const currentUser = getCurrentUserName();
  
  return [
    // --- My Tasks (Current User) ---
    {
      id: '1',
      title: 'Follow up with John Doe',
      assignee: currentUser,
      dueDate: todayStr,
      dueTime: '10:00 AM',
      priority: 'high',
      status: 'pending',
      category: 'today',
      tag: {
        type: 'contact',
        name: 'John Doe',
        account: 'Synergy Corp'
      },
      source: 'manual',
      clientType: 'prospects'
    },
    {
      id: '2',
      title: 'Send email to Synergy',
      assignee: currentUser,
      dueDate: todayStr,
      dueTime: '11:00 AM',
      priority: 'medium',
      status: 'pending',
      category: 'today',
      tag: {
        type: 'account',
        name: 'Synergy Corp'
      },
      source: 'manual',
      clientType: 'clients'
    },
    {
      id: '3',
      title: 'Prep for Quantum Leap',
      assignee: currentUser,
      dueDate: tomorrowStr,
      dueTime: '2:00 PM',
      priority: 'medium',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'account',
        name: 'Quantum Leap'
      },
      source: 'manual',
      clientType: 'mha'
    },
    {
      id: '4',
      title: 'Call Emily White',
      assignee: currentUser,
      dueDate: tomorrowStr,
      dueTime: '3:00 PM',
      priority: 'low',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'contact',
        name: 'Emily White',
        account: 'Event Horizon'
      },
      source: 'manual',
      clientType: 'prospects'
    },
    {
      id: '5',
      title: 'Review Inactive Account List',
      assignee: currentUser,
      dueDate: tomorrowStr,
      dueTime: '4:00 PM',
      priority: 'medium',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'account',
        name: 'Legacy Holdings'
      },
      source: 'manual',
      clientType: 'inactive'
    },
    {
      id: '6',
      title: 'Personal: Update LinkedIn profile',
      assignee: currentUser,
      dueDate: todayStr,
      dueTime: '6:00 PM',
      priority: 'low',
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
      id: '10',
      title: 'Check in with Alice Kim',
      assignee: currentUser,
      dueDate: tomorrowStr,
      dueTime: '10:30 AM',
      priority: 'medium',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'contact',
        name: 'Alice Kim',
        account: 'BrightPath Health'
      },
      source: 'manual',
      clientType: 'clients'
    },
    {
      id: '11',
      title: 'Review contract for Apex Labs',
      assignee: currentUser,
      dueDate: tomorrowStr,
      dueTime: '11:30 AM',
      priority: 'high',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'account',
        name: 'Apex Labs'
      },
      source: 'manual',
      clientType: 'clients'
    },
    {
      id: '12',
      title: 'Follow up with Carlos Rivera',
      assignee: currentUser,
      dueDate: tomorrowStr,
      dueTime: '1:00 PM',
      priority: 'medium',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'contact',
        name: 'Carlos Rivera',
        account: 'Rivera Consulting'
      },
      source: 'manual',
      clientType: 'prospects'
    },
    {
      id: '19',
      title: 'Reconnect with Maria Garcia',
      assignee: currentUser,
      dueDate: todayStr,
      dueTime: '4:00 PM',
      priority: 'medium',
      status: 'pending',
      category: 'today',
      tag: {
        type: 'contact',
        name: 'Maria Garcia',
        account: 'Garcia & Associates'
      },
      source: 'manual',
      clientType: 'alumni'
    },
    {
      id: '20',
      title: 'Review alumni outreach strategy',
      assignee: currentUser,
      dueDate: tomorrowStr,
      dueTime: '9:00 AM',
      priority: 'high',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'account',
        name: 'Alumni Network'
      },
      source: 'manual',
      clientType: 'alumni'
    },
    // --- Team Tasks (assigned to others) ---
    {
      id: '7',
      title: 'Draft proposal for Acme Inc.',
      assignee: 'Sarah Johnson',
      dueDate: todayStr,
      dueTime: '2:00 PM',
      priority: 'high',
      status: 'pending',
      category: 'today',
      tag: {
        type: 'account',
        name: 'Acme Inc.'
      },
      source: 'manual',
      clientType: 'clients'
    },
    {
      id: '8',
      title: 'Schedule meeting with TechStart',
      assignee: 'Mike Chen',
      dueDate: tomorrowStr,
      dueTime: '9:00 AM',
      priority: 'medium',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'account',
        name: 'TechStart Solutions'
      },
      source: 'manual',
      clientType: 'prospects'
    },
    {
      id: '9',
      title: 'Review quarterly reports',
      assignee: 'Lisa Wang',
      dueDate: yesterdayStr,
      dueTime: '5:00 PM',
      priority: 'high',
      status: 'pending',
      category: 'overdue',
      tag: {
        type: 'account',
        name: 'Global Enterprises'
      },
      source: 'manual',
      clientType: 'clients'
    },
    {
      id: '13',
      title: 'Prepare presentation for InnovateCorp',
      assignee: 'David Rodriguez',
      dueDate: todayStr,
      dueTime: '3:30 PM',
      priority: 'high',
      status: 'pending',
      category: 'today',
      tag: {
        type: 'account',
        name: 'InnovateCorp'
      },
      source: 'manual',
      clientType: 'mha'
    },
    {
      id: '14',
      title: 'Follow up with Maria Garcia',
      assignee: 'Alex Thompson',
      dueDate: tomorrowStr,
      dueTime: '12:00 PM',
      priority: 'medium',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'contact',
        name: 'Maria Garcia',
        account: 'Garcia & Associates'
      },
      source: 'manual',
      clientType: 'prospects'
    },
    {
      id: '15',
      title: 'Review inactive client outreach',
      assignee: 'Jennifer Lee',
      dueDate: tomorrowStr,
      dueTime: '4:30 PM',
      priority: 'low',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'account',
        name: 'Sunset Industries'
      },
      source: 'manual',
      clientType: 'inactive'
    },
    {
      id: '16',
      title: 'Update client database',
      assignee: 'Robert Kim',
      dueDate: todayStr,
      dueTime: '1:00 PM',
      priority: 'medium',
      status: 'pending',
      category: 'today',
      tag: {
        type: 'personal',
        name: 'Administrative'
      },
      source: 'manual',
      clientType: 'personal'
    },
    {
      id: '17',
      title: 'Schedule team meeting',
      assignee: 'Amanda Foster',
      dueDate: tomorrowStr,
      dueTime: '10:00 AM',
      priority: 'medium',
      status: 'pending',
      category: 'week',
      tag: {
        type: 'personal',
        name: 'Team Management'
      },
      source: 'manual',
      clientType: 'personal'
    },
    {
      id: '18',
      title: 'Review marketing materials',
      assignee: 'Kevin O\'Brien',
      dueDate: yesterdayStr,
      dueTime: '3:00 PM',
      priority: 'high',
      status: 'pending',
      category: 'overdue',
      tag: {
        type: 'account',
        name: 'Marketing Partners'
      },
      source: 'manual',
      clientType: 'clients'
    }
  ];
};

// Legacy export for backward compatibility
export const mockTasks = getMockTasks();

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
