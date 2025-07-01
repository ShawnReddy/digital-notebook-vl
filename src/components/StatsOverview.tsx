
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Today's Meetings</p>
              <p className="text-3xl font-bold text-slate-900">{meetingsCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="border-0 shadow-lg bg-white/70 backdrop-blur-sm cursor-pointer hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:scale-105"
        onClick={onPendingTasksClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending Tasks</p>
              <p className="text-3xl font-bold text-slate-900">{pendingTasksCount}</p>
              <p className="text-xs text-amber-600 font-medium mt-1">Click for breakdown</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
