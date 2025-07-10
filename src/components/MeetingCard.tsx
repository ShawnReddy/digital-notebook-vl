
import React from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'meeting': return '🤝';
      case 'demo': return '💻';
      default: return '📅';
    }
  };

  const handleJoinCall = () => {
    // Simulate joining MS Teams call via Compass integration
    toast({
      title: "Joining MS Teams Meeting",
      description: `Opening ${meeting.title} with ${meeting.client} via Compass integration...`,
    });
    
    // Simulate opening MS Teams (in a real implementation, this would open the actual Teams link)
    setTimeout(() => {
      window.open(`https://teams.microsoft.com/l/meetup-join/placeholder-meeting-id`, '_blank');
    }, 1000);
  };

  return (
    <div className="border border-gray-300 p-2 mb-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">
            {meeting.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {meeting.client}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {meeting.time}
          </p>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={handleJoinCall}
            className="px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700"
          >
            Join
          </button>
          <button 
            onClick={() => onBriefClick(meeting)}
            className="px-2 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-50"
          >
            Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
