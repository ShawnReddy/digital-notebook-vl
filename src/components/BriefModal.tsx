
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, User, Calendar, Phone, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const interactions = meeting ? getClientInteractions(meeting.client) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <Search className="w-4 h-4 text-white" />
            </div>
            Meeting Brief: {meeting?.title}
          </DialogTitle>
          <p className="text-slate-600">Client: {meeting?.client} • {meeting?.time}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Deep Research Section */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center justify-between">
                <span className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  Company Intelligence
                </span>
                <Button
                  onClick={handleDeepResearch}
                  disabled={isResearching}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sage AI is fetching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Deep Research
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {researchData ? (
                <div className="prose prose-sm max-w-none">
                  <div className="bg-white/70 p-4 rounded-lg border border-blue-200">
                    <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
                      {researchData}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600 italic">
                  Click "Deep Research" to get AI-powered insights about {meeting?.client}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Client Interaction History */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Client Interaction History
              </CardTitle>
              <p className="text-sm text-slate-600">
                Recent interactions with {meeting?.client} team members
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {interactions.length > 0 ? (
                interactions.map((interaction) => (
                  <div key={interaction.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {interaction.contact.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{interaction.contact}</h4>
                          <p className="text-sm text-slate-600">{interaction.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        {getInteractionIcon(interaction.type)}
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(interaction.date).toLocaleDateString()}</span>
                        {interaction.duration && (
                          <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                            {interaction.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {interaction.subject && (
                      <p className="font-medium text-slate-800 mb-2">
                        Subject: {interaction.subject}
                      </p>
                    )}
                    
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {interaction.notes}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No interaction history available for {meeting?.client}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-200">
          <Button 
            onClick={onClose}
            variant="outline"
            className="px-6"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BriefModal;
