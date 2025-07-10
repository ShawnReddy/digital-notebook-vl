import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, PhoneCall, Calendar, Building, User, Loader2, Plus } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { type Task } from '@/data/taskData';
import TaskModal from '@/components/TaskModal';

interface CompanyHistory {
  id: string;
  companyName: string;
  designation: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

interface AlumniContact {
  id: string;
  name: string;
  previousCompany: string;
  currentCompany: string;
  currentDesignation: string;
  lastContactDate: string;
  email?: string;
  phone?: string;
  notes?: string;
  companyHistory: CompanyHistory[];
}

interface AlumniContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: AlumniContact | null;
}

const AlumniContactModal: React.FC<AlumniContactModalProps> = ({
  isOpen,
  onClose,
  contact
}) => {
  const { handleTaskSave } = useTaskContext();
  const [isResearching, setIsResearching] = useState(false);
  const [researchData, setResearchData] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskPreset, setTaskPreset] = useState<{account: string, contact: string} | null>(null);

  const handleDeepResearch = async () => {
    if (!contact) return;
    
    setIsResearching(true);
    setResearchData(null);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResearchData = `${contact.name} is a seasoned professional with extensive experience in the industry.

Career Highlights:
• Currently serving as ${contact.currentDesignation} at ${contact.currentCompany}
• Previously held key positions at ${contact.previousCompany}
• Has worked across ${contact.companyHistory.length} companies in their career
• Strong track record of leadership and strategic decision-making

Key Insights:
• Known for building strong client relationships and driving business growth
• Has experience in both startup and enterprise environments
• Maintains active professional network in the industry
• Potential for future collaboration opportunities

Recent Activity:
• Last contact was on ${new Date(contact.lastContactDate).toLocaleDateString()}
• Currently focused on ${contact.currentCompany}'s expansion initiatives
• Open to discussing potential partnerships or opportunities`;
      
      setResearchData(mockResearchData);
      setIsResearching(false);
    }, 2000);
  };

  const handleAddTask = () => {
    if (!contact) return;
    setTaskPreset({
      account: contact.currentCompany,
      contact: contact.name
    });
    setIsTaskModalOpen(true);
  };

  const onTaskSave = (taskData: Omit<Task, 'id'>) => {
    handleTaskSave(taskData, null);
    setIsTaskModalOpen(false);
    setTaskPreset(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!contact) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <User className="h-5 w-5" />
              {contact.name}
            </DialogTitle>
            <p className="text-sm text-gray-600">
              {contact.currentDesignation} at {contact.currentCompany}
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Contact Information */}
            <div className="border border-gray-300 p-3">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-blue-600">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-gray-500" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Last Contact: {formatDate(contact.lastContactDate)}</span>
                </div>
              </div>
            </div>

            {/* Deep Research Section */}
            <div className="border border-gray-300 p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Professional Intelligence</h3>
                <Button
                  onClick={handleDeepResearch}
                  disabled={isResearching}
                  size="sm"
                  variant="default"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Deep Research'
                  )}
                </Button>
              </div>
              <div>
                {researchData ? (
                  <div className="bg-gray-100 p-3 border border-gray-300">
                    <pre className="whitespace-pre-wrap text-sm">
                      {researchData}
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Click "Deep Research" to get insights about {contact.name}
                  </p>
                )}
              </div>
            </div>

            {/* Company History */}
            <div className="border border-gray-300 p-3">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Career History
              </h3>
              <div className="space-y-3">
                {contact.companyHistory.map((company, index) => (
                  <div key={company.id} className="border border-gray-200 p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{company.companyName}</h4>
                        <p className="text-sm text-gray-600">{company.designation}</p>
                      </div>
                      {company.isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(company.startDate)} - {company.endDate ? formatDate(company.endDate) : 'Present'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {contact.notes && (
              <div className="border border-gray-300 p-3">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-gray-700">{contact.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <Button
                onClick={handleAddTask}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task/Follow-up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskPreset(null);
        }}
        onSave={onTaskSave}
        task={null}
        preset={taskPreset}
      />
    </>
  );
};

export default AlumniContactModal; 