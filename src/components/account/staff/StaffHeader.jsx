import Image from 'next/image';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const StaffHeader = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { user, isAuthenticated, loading, logOut } = useAuth();
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      text: 'Dashboard',
      icon: '🏠',
      url: '/',
    },
    {
      text: 'Overtime Shifts',
      icon: '⏰',
      url: '/staff/overtime',
    },
    {
      text: 'My Rota',
      icon: '📅',
      url: '',
    },
    {
      text: 'Settings',
      icon: '⚙️',
      url: '',
    },
  ];

  const handleRouting = (item) => {
    setDropdownOpen(false);
    const url = item.url || '';
    if (url) {
      window.location.href = url;
    } else {
      console.warn('No URL specified for this menu item.');
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logOut();
  };

  return (
    <div className="relative bg-secondary flex items-center justify-between p-4 text-white">
      {/* Staff Header Component */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">👤</span>
          </div>
          <div>
            <span className="text-lg font-bold block">Welcome, {user?.fullName}</span>
            <span className="text-sm text-green-100 hidden sm:block">Staff Portal</span>
          </div>
        </div>
        
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)} 
          className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          <Image 
            src="/assets/menu.png" 
            alt="Menu" 
            width={24} 
            height={24} 
            className="cursor-pointer filter invert" 
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full right-4 mt-2 w-64 bg-white text-black rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👤</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">Staff Member</p>
                </div>
              </div>
              <button 
                onClick={() => setDropdownOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <span className="text-gray-600 font-bold text-sm">×</span>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleRouting(item)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item.text}</span>
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 p-3">
            <button 
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              🚪 Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffHeader;
