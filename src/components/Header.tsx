
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, UserCheck, UserX, Building, Calendar, BarChart3, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { userProfile, signOut } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart3 },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Prospects', path: '/prospects', icon: UserCheck },
    { name: 'Inactive Clients', path: '/inactive', icon: UserX },
    { name: 'MHA', path: '/mha', icon: Building },
    { name: 'Events', path: '/events', icon: Calendar },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const displayName = userProfile?.full_name || 'User';

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Digital Notebook
              </h1>
            </div>
          </div>
          
          {/* Navigation - Hidden on smaller screens */}
          <nav className="hidden lg:flex space-x-1 flex-1 justify-center max-w-2xl mx-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                <span className="hidden xl:inline">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-slate-500">Welcome back</p>
              <p className="text-sm font-semibold text-slate-900 truncate max-w-32">{displayName}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-sm font-bold">{getInitials(displayName)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-slate-600 hover:text-slate-900 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden pb-3 border-t border-slate-200/60 mt-3">
          <nav className="flex space-x-1 overflow-x-auto py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
