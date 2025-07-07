
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

interface BriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
}

const BriefModal: React.FC<BriefModalProps> = ({ isOpen, onClose, meeting }) => {
  const [isResearching, setIsResearching] = useState(false);
  const [researchData, setResearchData] = useState<string | null>(null);

  // Mock client interaction data
  const getClientInteractions = (client: string) => {
    const interactions = {
      'ABC Corporation': [
        {
          id: '1',
          contact: 'John Anderson',
          role: 'CEO',
          date: '2024-12-28',
          type: 'call',
          duration: '45 min',
          notes: 'Discussed Q4 performance and 2025 strategy. Very interested in expanding our partnership.'
        },
        {
          id: '2',
          contact: 'Sarah Mitchell',
          role: 'CFO',
          date: '2024-12-20',
          type: 'email',
          subject: 'Budget Approval for Q1 Initiative',
          notes: 'Confirmed budget allocation for new project. Awaiting final signatures.'
        },
        {
          id: '3',
          contact: 'John Anderson',
          role: 'CEO',
          date: '2024-12-15',
          type: 'meeting',
          duration: '30 min',
          notes: 'Quarterly review preparation. Discussed key metrics and success stories.'
        }
      ],
      'XYZ Solutions': [
        {
          id: '1',
          contact: 'Michael Chen',
          role: 'CTO',
          date: '2024-12-25',
          type: 'call',
          duration: '30 min',
          notes: 'Technical demo feedback. Impressed with new features, wants to schedule full implementation.'
        }
      ],
      'New Prospect Inc.': [
        {
          id: '1',
          contact: 'Lisa Rodriguez',
          role: 'VP Sales',
          date: '2024-12-22',
          type: 'email',
          subject: 'Initial Interest',
          notes: 'Reached out via LinkedIn. Interested in learning more about our solutions.'
        }
      ]
    };
    return interactions[client as keyof typeof interactions] || [];
  };

  const handleDeepResearch = async () => {
    setIsResearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResearchData = `${meeting?.client} is a Fortune 500 company specializing in technology solutions and consulting services. Founded in 1995, they have grown to over 5,000 employees across 12 countries. 

Key insights:
• Recently announced a $50M investment in AI and automation
• Q3 revenue grew 15% year-over-year
• Expanding their North American operations
• Looking for strategic partnerships in cloud infrastructure
• Current pain points include legacy system integration and scalability challenges

Competitive landscape shows they're evaluating 3 other vendors, but our solution offers unique advantages in cost-effectiveness and implementation speed.`;
      
      setResearchData(mockResearchData);
      setIsResearching(false);
    }, 2000);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'meeting': return '💬';
      default: return '💬';
    }
  };

  const interactions = meeting ? getClientInteractions(meeting.client) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Meeting Brief: {meeting?.title}
          </DialogTitle>
          <p className="text-sm text-gray-600">Client: {meeting?.client} • {meeting?.time}</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Deep Research Section */}
          <div className="border border-gray-300 p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Company Intelligence</h3>
              <button
                onClick={handleDeepResearch}
                disabled={isResearching}
                className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                {isResearching ? 'Loading...' : 'Deep Research'}
              </button>
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
                  Click "Deep Research" to get insights about {meeting?.client}
                </p>
              )}
            </div>
          </div>

          {/* Client Interaction History */}
          <div className="border border-gray-300 p-3">
            <h3 className="font-semibold mb-2">Client Interaction History</h3>
            <p className="text-sm text-gray-600 mb-3">
              Recent interactions with {meeting?.client} team members
            </p>
            <div className="space-y-2">
              {interactions.length > 0 ? (
                interactions.map((interaction) => (
                  <div key={interaction.id} className="border border-gray-300 p-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{interaction.contact}</h4>
                        <p className="text-xs text-gray-600">{interaction.role}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {getInteractionIcon(interaction.type)} {new Date(interaction.date).toLocaleDateString()}
                        {interaction.duration && (
                          <span className="ml-1 bg-gray-100 px-1 py-0.5">
                            {interaction.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {interaction.subject && (
                      <p className="text-xs font-medium text-gray-800 mb-1">
                        Subject: {interaction.subject}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-700">
                      {interaction.notes}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <p>No interaction history available for {meeting?.client}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BriefModal;
