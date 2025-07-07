
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
    <div className="mb-4">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Hello, {firstName}</h1>
      <p className="text-sm text-gray-600 mb-4">Welcome to Digital Notebook</p>
    </div>
  );
};

export default DashboardHeader;
