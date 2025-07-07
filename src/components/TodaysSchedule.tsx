
import React from 'react';

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
    <div className="border border-gray-300 p-3">
      <h3 className="font-bold mb-2">Today's Schedule</h3>
      <div className="space-y-2">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="border border-gray-300 p-2">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold text-sm">{meeting.title}</div>
                <div className="text-xs text-gray-600">{meeting.client}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{meeting.time}</div>
                <button 
                  onClick={() => onBriefClick(meeting)}
                  className="text-xs underline"
                >
                  Brief
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysSchedule;
