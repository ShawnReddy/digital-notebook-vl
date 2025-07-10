import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, PhoneCall, Calendar, FileText, MessageSquare, Loader2 } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { type Task } from '@/data/taskData';
import TaskModal from '@/components/TaskModal';

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  lastContact: string;
}

interface InteractionHistory {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  date: string;
  time: string;
  subject: string;
  content: string;
  contact: string;
}

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: {
    id: string;
    name: string;
    location: string;
    contacts: Contact[];
    type: 'client' | 'prospect' | 'inactive' | 'mha';
    // Additional fields that might be specific to certain types
    revenue?: string;
    potentialRevenue?: string;
    lastRevenue?: string;
    status?: string;
    stage?: string;
    reason?: string;
    inactiveDate?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    lastContact?: string;
  } | null;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  company
}) => {
  const { handleTaskSave } = useTaskContext();
  const [isResearching, setIsResearching] = useState(false);
  const [researchData, setResearchData] = useState<string | null>(null);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskPreset, setTaskPreset] = useState<{account: string, contact: string} | null>(null);

  const handleDeepResearch = async () => {
    if (!company) return;
    
    setIsResearching(true);
    setResearchData(null);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResearchData = `${company.name} is ${company.type === 'prospect' ? 'an emerging prospect' : company.type === 'client' ? 'a leading company' : company.type === 'inactive' ? 'a former client' : 'an important partner'} with ${company.type === 'prospect' ? 'significant potential for partnership' : company.type === 'client' ? 'strong market presence and growth potential' : company.type === 'inactive' ? 'historical relationship value' : 'strategic importance'}.

Key insights:
• ${company.type === 'prospect' ? 'Growing company with expanding market presence' : company.type === 'client' ? 'Established company with solid financial foundation' : company.type === 'inactive' ? 'Previous successful partnership' : 'Government/Healthcare partnership'}
• ${company.type === 'prospect' ? 'Actively seeking technology solutions and partnerships' : company.type === 'client' ? 'Currently expanding their operations' : company.type === 'inactive' ? 'Potential for reactivation' : 'Regulatory compliance focus'}
• ${company.type === 'prospect' ? 'Strong leadership team with vision for growth' : company.type === 'client' ? 'Strong leadership team with industry experience' : company.type === 'inactive' ? 'Maintained relationships' : 'Structured decision-making process'}
• ${company.type === 'prospect' ? 'Current challenges include scaling operations and efficiency' : company.type === 'client' ? 'Looking for strategic partnerships and technology solutions' : company.type === 'inactive' ? 'Previous challenges addressed' : 'Budget and timeline constraints'}
• ${company.type === 'prospect' ? 'High potential for conversion with our value proposition' : company.type === 'client' ? 'Recent growth in revenue and market share' : company.type === 'inactive' ? 'Opportunity for renewed engagement' : 'Long-term partnership potential'}

${company.type === 'prospect' ? 'Competitive analysis shows they are evaluating multiple vendors, but our solution offers unique advantages in cost-effectiveness and implementation speed.' : company.type === 'client' ? 'Our analysis shows they are an ideal client for our services with high potential for long-term partnership and account growth.' : company.type === 'inactive' ? 'Previous relationship provides foundation for potential reactivation.' : 'Government partnerships require careful navigation of procurement processes.'}`;
      
      setResearchData(mockResearchData);
      setIsResearching(false);
    }, 2000);
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsInteractionModalOpen(true);
  };

  const handleAddTask = (contact: Contact, companyName: string) => {
    setTaskPreset({
      account: companyName,
      contact: contact.name
    });
    setIsTaskModalOpen(true);
  };

  const onTaskSave = (taskData: Omit<Task, 'id'>) => {
    handleTaskSave(taskData);
    setIsTaskModalOpen(false);
    setTaskPreset(null);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <PhoneCall className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'call': return 'bg-green-50 text-green-700 border-green-200';
      case 'meeting': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'note': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Mock interaction history data
  const getInteractionHistory = (contactId: string): InteractionHistory[] => {
    const mockHistory: InteractionHistory[] = [
      {
        id: '1',
        type: 'email',
        date: '2024-12-28',
        time: '10:30 AM',
        subject: 'Q4 Contract Renewal Discussion',
        content: 'Discussed renewal terms and pricing for Q1 2025. Client is interested in expanding scope.',
        contact: 'John Doe'
      },
      {
        id: '2',
        type: 'call',
        date: '2024-12-25',
        time: '2:15 PM',
        subject: 'Follow-up on Implementation',
        content: 'Called to check on system implementation progress. Minor technical issues resolved.',
        contact: 'Jane Smith'
      },
      {
        id: '3',
        type: 'meeting',
        date: '2024-12-20',
        time: '3:00 PM',
        subject: 'Quarterly Review',
        content: 'Quarterly business review meeting. Discussed performance metrics and future opportunities.',
        contact: 'Internal'
      }
    ];
    return mockHistory;
  };

  if (!company) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{company.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Company Intelligence Section */}
            <div className="border border-gray-300 p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Company Intelligence</h3>
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
                    Click "Deep Research" to get insights about {company.name}
                  </p>
                )}
              </div>
            </div>

            {/* Company Details Section */}
            <div className="border border-gray-300 p-3">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Company Details</h3>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-medium">{company.location}</p>
                    </div>
                    {company.status && (
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium">{company.status}</p>
                      </div>
                    )}
                    {company.stage && (
                      <div>
                        <p className="text-gray-600">Stage</p>
                        <p className="font-medium">{company.stage}</p>
                      </div>
                    )}
                    {company.reason && (
                      <div>
                        <p className="text-gray-600">Reason Inactive</p>
                        <p className="font-medium">{company.reason}</p>
                      </div>
                    )}
                    {company.inactiveDate && (
                      <div>
                        <p className="text-gray-600">Inactive Since</p>
                        <p className="font-medium">{new Date(company.inactiveDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {company.contactPerson && (
                      <div>
                        <p className="text-gray-600">Primary Contact</p>
                        <p className="font-medium">{company.contactPerson}</p>
                      </div>
                    )}
                    {company.email && (
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium">{company.email}</p>
                      </div>
                    )}
                    {company.phone && (
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium">{company.phone}</p>
                      </div>
                    )}
                    {company.lastContact && (
                      <div>
                        <p className="text-gray-600">Last Contact</p>
                        <p className="font-medium">{new Date(company.lastContact).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Revenue Section - Right Side */}
                <div className="ml-6 border-l border-gray-300 pl-6">
                  <h3 className="font-semibold mb-2 text-right">Revenue Information</h3>
                  <div className="space-y-3 text-sm">
                    {company.revenue && (
                      <div className="text-right">
                        <p className="text-gray-600">Revenue</p>
                        <p className="font-medium text-lg">{company.revenue}</p>
                      </div>
                    )}
                    {company.potentialRevenue && (
                      <div className="text-right">
                        <p className="text-gray-600">Potential Revenue</p>
                        <p className="font-medium text-lg">{company.potentialRevenue}</p>
                      </div>
                    )}
                    {company.lastRevenue && (
                      <div className="text-right">
                        <p className="text-gray-600">Last Revenue</p>
                        <p className="font-medium text-lg">{company.lastRevenue}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Company Contacts Section */}
            <div>
              <h3 className="font-semibold mb-2">Company Contacts</h3>
              <p className="text-sm text-gray-500 mb-2">
                * Contact information would be populated from Compass
              </p>
              <div className="space-y-2">
                {company.contacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className="border border-gray-300 p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleContactClick(contact)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.title}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Last Contact</p>
                        <p className="text-sm">{new Date(contact.lastContact).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interaction History Modal */}
      <Dialog open={isInteractionModalOpen} onOpenChange={setIsInteractionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex justify-between items-center">
              <span>Interaction History - {selectedContact?.name}</span>
              {selectedContact && (
                <Button
                  onClick={() => handleAddTask(selectedContact, company.name)}
                  size="sm"
                  variant="default"
                >
                  Add Task
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-3">
              <div className="bg-gray-100 p-3 border border-gray-300">
                <h4 className="font-semibold">{selectedContact.name}</h4>
                <p className="text-sm text-gray-600">{selectedContact.title}</p>
                <p className="text-sm text-gray-500">{selectedContact.email}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Recent Interactions</h3>
                <div className="space-y-2">
                  {getInteractionHistory(selectedContact.id).map((interaction) => (
                    <div key={interaction.id} className="border border-gray-300 p-2">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className={`px-2 py-1 text-xs ${getInteractionColor(interaction.type)}`}>
                            {interaction.type}
                          </span>
                          <span className="text-sm font-medium ml-2">{interaction.subject}</span>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(interaction.date).toLocaleDateString()}</p>
                          <p>{interaction.time}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{interaction.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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

export default CompanyModal; 