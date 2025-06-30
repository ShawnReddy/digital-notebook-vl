
import React from 'react';
import { Calendar, AlertCircle, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsOverviewProps {
  meetingsCount: number;
  pendingTasksCount: number;
  activeClientsCount: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  meetingsCount,
  pendingTasksCount,
  activeClientsCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
      
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending Tasks</p>
              <p className="text-3xl font-bold text-slate-900">{pendingTasksCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Clients</p>
              <p className="text-3xl font-bold text-slate-900">{activeClientsCount}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
