
import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsOverviewProps {
  meetingsCount: number;
  pendingTasksCount: number;
  onPendingTasksClick: () => void;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  meetingsCount,
  pendingTasksCount,
  onPendingTasksClick
}) => {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-300 bg-white p-3">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Today's Meetings</p>
            <p className="text-xl font-bold text-gray-900">{meetingsCount}</p>
          </div>
        </div>
        
        <div 
          className="border border-gray-300 bg-white p-3 cursor-pointer hover:bg-gray-50"
          onClick={onPendingTasksClick}
        >
          <div className="text-center">
            <p className="text-gray-600 text-sm">Pending Tasks</p>
            <p className="text-xl font-bold text-gray-900">{pendingTasksCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
