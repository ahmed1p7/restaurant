import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col w-64 bg-sea-blue-800 text-white">
      <div className="flex items-center justify-center h-20 border-b border-sea-blue-700">
        <h1 className="text-3xl font-extrabold tracking-wider">SEA</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 hover:bg-sea-blue-700 hover:text-white ${
                isActive ? 'bg-sea-blue-900 text-white' : 'text-sea-blue-100'
              }`
            }
          >
            <span className="mr-4">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-sea-blue-700">
         <div className="flex items-center justify-between">
            <div className="flex items-center">
                <img className="h-10 w-10 rounded-full object-cover" src="https://picsum.photos/seed/manager/100" alt="User" />
                <div className="mr-3">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-sea-blue-300">متصل</p>
                </div>
            </div>
            <button onClick={logout} title="تسجيل الخروج" className="text-sea-blue-200 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
