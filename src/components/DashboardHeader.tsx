
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader: React.FC = () => {
  const { userProfile } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const displayName = userProfile?.full_name || 'User';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Hello, {firstName}</h1>
          <p className="text-lg text-slate-600">Here's what's happening today - stay on top of your goals.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-slate-500">Today</p>
            <p className="text-xl font-semibold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">{getInitials(displayName)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
