
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, UserCheck, UserX, Building, Calendar } from 'lucide-react';

const Header = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: null },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Prospects', path: '/prospects', icon: UserCheck },
    { name: 'Inactive Clients', path: '/inactive', icon: UserX },
    { name: 'MHA', path: '/mha', icon: Building },
    { name: 'Events', path: '/events', icon: Calendar },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">SalesTracker</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">SE</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
