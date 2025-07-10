
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { userProfile, signOut } = useAuth();
  
  const navItems = [
    { name: 'Clients', path: '/clients' },
    { name: 'Prospects', path: '/prospects' },
    { name: 'Client Alumni', path: '/alumni' },
    { name: 'Inactive Clients', path: '/inactive' },
    { name: 'MHA', path: '/mha' },
    { name: 'Growth Events', path: '/events' },
    { name: 'Other Tasks', path: '/tasks' },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const displayName = userProfile?.full_name || 'User';

  return (
    <header className="bg-blue-800 border-b border-blue-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="text-lg font-bold text-white hover:text-blue-200 transition-colors">
              Sage Planner
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-1 text-sm text-white ${
                    isActive
                      ? 'bg-blue-600'
                      : 'hover:bg-blue-700'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">{displayName}</span>
            <button
              onClick={signOut}
              className="text-white text-sm hover:underline"
            >
              Logout
            </button>
          </div>
        </div>


      </div>
    </header>
  );
};

export default Header;
