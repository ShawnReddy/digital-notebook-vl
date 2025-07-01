
import React from 'react';
import TaskModal from './TaskModal';
import BriefModal from './BriefModal';
import PersonalTaskModal from './PersonalTaskModal';
import TaskBreakdownModal from './TaskBreakdownModal';
import { type Task, type PersonalTask } from '@/data/taskData';

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

interface DashboardModalsProps {
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  isPersonalTaskModalOpen: boolean;
  setIsPersonalTaskModalOpen: (open: boolean) => void;
  isBriefModalOpen: boolean;
  setIsBriefModalOpen: (open: boolean) => void;
  isTaskBreakdownOpen: boolean;
  setIsTaskBreakdownOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  editingPersonalTask: PersonalTask | null;
  setEditingPersonalTask: (task: PersonalTask | null) => void;
  selectedMeeting: Meeting | null;
  setSelectedMeeting: (meeting: Meeting | null) => void;
  taskModalPreset: { company: string; person: string } | null;
  setTaskModalPreset: (preset: { company: string; person: string } | null) => void;
  onTaskSave: (taskData: Omit<Task, 'id'>) => void;
  onPersonalTaskSave: (taskData: Omit<PersonalTask, 'id'>) => void;
  myPendingTasks: Task[];
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
  isTaskModalOpen,
  setIsTaskModalOpen,
  isPersonalTaskModalOpen,
  setIsPersonalTaskModalOpen,
  isBriefModalOpen,
  setIsBriefModalOpen,
  isTaskBreakdownOpen,
  setIsTaskBreakdownOpen,
  editingTask,
  setEditingTask,
  editingPersonalTask,
  setEditingPersonalTask,
  selectedMeeting,
  setSelectedMeeting,
  taskModalPreset,
  setTaskModalPreset,
  onTaskSave,
  onPersonalTaskSave,
  myPendingTasks
}) => {
  return (
    <>
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setTaskModalPreset(null);
        }}
        onSave={onTaskSave}
        task={editingTask}
        preset={taskModalPreset}
      />

      <PersonalTaskModal
        isOpen={isPersonalTaskModalOpen}
        onClose={() => {
          setIsPersonalTaskModalOpen(false);
          setEditingPersonalTask(null);
        }}
        onSave={onPersonalTaskSave}
        task={editingPersonalTask}
      />

      <BriefModal
        isOpen={isBriefModalOpen}
        onClose={() => {
          setIsBriefModalOpen(false);
          setSelectedMeeting(null);
        }}
        meeting={selectedMeeting}
      />

      <TaskBreakdownModal
        isOpen={isTaskBreakdownOpen}
        onClose={() => setIsTaskBreakdownOpen(false)}
        tasks={myPendingTasks}
      />
    </>
  );
};

export default DashboardModals;
