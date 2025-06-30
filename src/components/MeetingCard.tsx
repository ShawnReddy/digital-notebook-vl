
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Building2, FileText } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

interface MeetingCardProps {
  meeting: Meeting;
  onBriefClick: (meeting: Meeting) => void;
  showConnector?: boolean;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onBriefClick, showConnector = false }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'meeting': return '🤝';
      case 'demo': return '💻';
      default: return '📅';
    }
  };

  return (
    <div className="group relative">
      <div className="flex items-center p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-lg mr-4">
          {getTypeIcon(meeting.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {meeting.title}
          </h4>
          <p className="text-slate-600 flex items-center mt-1">
            <Building2 className="w-4 h-4 mr-1" />
            {meeting.client}
          </p>
          <div className="flex items-center text-sm text-slate-500 mt-2">
            <Clock className="w-4 h-4 mr-1" />
            {meeting.time}
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col space-y-2">
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            Join
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onBriefClick(meeting)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:from-emerald-100 hover:to-teal-100"
          >
            <FileText className="w-3 h-3 mr-1" />
            Brief
          </Button>
        </div>
      </div>
      {showConnector && (
        <div className="absolute left-6 top-16 w-px h-4 bg-slate-200"></div>
      )}
    </div>
  );
};

export default MeetingCard;
