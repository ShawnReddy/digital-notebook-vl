
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, ArrowRight, Info } from 'lucide-react';
import MeetingCard from './MeetingCard';

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

interface TodaysScheduleProps {
  meetings: Meeting[];
  onBriefClick: (meeting: Meeting) => void;
}

const TodaysSchedule: React.FC<TodaysScheduleProps> = ({ meetings, onBriefClick }) => {
  return (
    <TooltipProvider>
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-blue-600" />
              Today's Schedule
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 p-1 h-6 w-6">
                    <Info className="w-3 h-3 text-slate-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Information is populated via your Compass account</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {meetings.map((meeting, index) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onBriefClick={onBriefClick}
              showConnector={index < meetings.length - 1}
            />
          ))}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TodaysSchedule;
