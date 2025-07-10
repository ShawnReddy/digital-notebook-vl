
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
  showTaskModal: boolean;
  setShowTaskModal: (show: boolean) => void;
  showPersonalTaskModal: boolean;
  setShowPersonalTaskModal: (show: boolean) => void;
  showTaskBreakdownModal: boolean;
  setShowTaskBreakdownModal: (show: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  editingPersonalTask: PersonalTask | null;
  setEditingPersonalTask: (task: PersonalTask | null) => void;
  taskModalPreset: { account: string; contact: string } | null;
  setTaskModalPreset: (preset: { account: string; contact: string } | null) => void;
  onTaskSave: (task: Omit<Task, 'id'>) => void;
  onPersonalTaskSave: (task: Omit<PersonalTask, 'id'>) => void;
  onTaskComplete: (taskId: string) => void;
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
  showTaskModal,
  setShowTaskModal,
  showPersonalTaskModal,
  setShowPersonalTaskModal,
  showTaskBreakdownModal,
  setShowTaskBreakdownModal,
  editingTask,
  setEditingTask,
  editingPersonalTask,
  setEditingPersonalTask,
  taskModalPreset,
  setTaskModalPreset,
  onTaskSave,
  onPersonalTaskSave,
  onTaskComplete
}) => {
  return (
    <>
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
          setTaskModalPreset(null);
        }}
        onSave={onTaskSave}
        task={editingTask}
        preset={taskModalPreset}
      />

      <PersonalTaskModal
        isOpen={showPersonalTaskModal}
        onClose={() => {
          setShowPersonalTaskModal(false);
          setEditingPersonalTask(null);
        }}
        onSave={onPersonalTaskSave}
        task={editingPersonalTask}
      />

      <TaskBreakdownModal
        isOpen={showTaskBreakdownModal}
        onClose={() => setShowTaskBreakdownModal(false)}
        tasks={[]}
      />
    </>
  );
};

export default DashboardModals;
