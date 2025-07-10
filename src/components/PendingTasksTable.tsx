import React, { useState } from 'react';
import { Check, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Task } from '@/data/taskData';

interface PendingTasksTableProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onAddFollowUp: (followUp: { originalTask: Task; assignee: string; dueDate: string; note: string }) => void;
  assignees: string[];
  showTagInfo?: boolean;
  canComplete?: boolean;
}

const CLIENT_TYPE_MAP: Record<string, { label: string; color: string }> = {
  clients: { label: 'CLIENT', color: 'bg-green-700 text-white' },
  prospects: { label: 'PROSPECT', color: 'bg-blue-600 text-white' },
  alumni: { label: 'ALUMNI', color: 'bg-orange-600 text-white' },
  mha: { label: 'MHA', color: 'bg-purple-600 text-white' },
  inactive: { label: 'INACTIVE', color: 'bg-gray-700 text-white' },
  personal: { label: 'PERSONAL', color: 'bg-indigo-600 text-white' },
};

const getTagInfo = (task: Task) => {
  if (task.tag.type === 'account') {
    return `Tagged to: ${task.tag.name}`;
  } else if (task.tag.type === 'contact') {
    return `Tagged to: ${task.tag.name}${task.tag.account ? ` (${task.tag.account})` : ''}`;
  } else {
    return 'Personal Task';
  }
};

const PendingTasksTable: React.FC<PendingTasksTableProps> = ({ tasks, onComplete, onAddFollowUp, assignees, showTagInfo, canComplete = true }) => {
  const [followUpModal, setFollowUpModal] = useState<{ open: boolean; task: Task | null }>({ open: false, task: null });
  const [followUpAssignee, setFollowUpAssignee] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');

  const handleOpenFollowUp = (task: Task) => {
    setFollowUpModal({ open: true, task });
    setFollowUpAssignee(task.assignee);
    setFollowUpDate('');
    setFollowUpNote('');
  };

  const handleCreateFollowUp = () => {
    if (followUpModal.task && followUpAssignee && followUpDate) {
      onAddFollowUp({
        originalTask: followUpModal.task,
        assignee: followUpAssignee,
        dueDate: followUpDate,
        note: followUpNote,
      });
      setFollowUpModal({ open: false, task: null });
    }
  };

  return (
    <div className="border border-gray-300 bg-white rounded p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-2">Task</th>
            <th className="text-left py-2 px-2">Category</th>
            <th className="text-left py-2 px-2">Due Date</th>
            <th className="text-left py-2 px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const typeKey = task.clientType;
            const typeInfo = CLIENT_TYPE_MAP[typeKey] || { label: task.clientType, color: 'bg-gray-400 text-white' };
            return (
              <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-2">
                  <div>{task.title}</div>
                  {showTagInfo && (
                    <div className="text-xs text-gray-500 mt-1">{getTagInfo(task)}</div>
                  )}
                </td>
                <td className="py-2 px-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                </td>
                <td className="py-2 px-2">{task.dueDate}</td>
                <td className="py-2 px-2 flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onComplete(task.id)} disabled={!canComplete}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleOpenFollowUp(task)}>
                    <CalendarIcon className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-6">No pending tasks</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Follow Up Modal */}
      <Dialog open={followUpModal.open} onOpenChange={(open) => setFollowUpModal({ open, task: open ? followUpModal.task : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Follow-Up Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Assign To</label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={followUpAssignee}
                onChange={e => setFollowUpAssignee(e.target.value)}
              >
                {assignees.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Note</label>
              <Input type="text" value={followUpNote} onChange={e => setFollowUpNote(e.target.value)} placeholder="Add a note..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={handleCreateFollowUp} disabled={!followUpAssignee || !followUpDate}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingTasksTable; 