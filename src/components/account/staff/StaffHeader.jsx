import Image from 'next/image';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const StaffHeader = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { user, isAuthenticated, loading, logOut } = useAuth();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: null,
      url: '/',
    }, // Replace with actual icon component if needed
    {
      text: 'Overtime Shifts',
      icon: null,
      url: '/staff/overtime',
    },
    {
      text: 'My Rota',
      icon: null,
      url: '',
    },
    {
      text: 'Settings',
      icon: null,
      url: '',
    },
  ];

  const handleRouting = (item) => {
    const url = item.url || '';
    if (url) {
      window.location.href = url;
    } else {
      console.warn('No URL specified for this menu item.');
    }
  };

  return (
    <div className="relative bg-secondary flex items-center justify-between p-4 text-white">
      {/* Header Component */}
      <div className="flex items-center flex-row justify-between w-full">
        <span className="text-lg font-bold">Welcome, {user?.fullName}</span>
        {!dropdownOpen && (
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="ml-4">
            <Image src="/assets/menu.png" alt="open menu" width={24} height={24} title="Open Menu" className="cursor-pointer" />
          </button>
        )}
      </div>
      {dropdownOpen && (
        <div className="absolute top-0 right-2 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
          <span onClick={() => setDropdownOpen(false)} className="absolute right-0 py-2 px-3 cursor-pointer font-semibold bg-gray-300 rounded-full">
            X
          </span>
          <div className="pt-10">
            {menuItems.map((item, index) => (
              <div key={index} onClick={() => handleRouting(item)} title={item.text} className="px-4 py-1 hover:bg-primary hover:text-white cursor-pointer">
                {item.icon && <item.icon className="" />}
                {item.text}
              </div>
            ))}
          </div>
          <button onClick={logOut} className="bg-error hover:bg-error-hover text-white px-4 py-1 rounded w-full mt-2 cursor-pointer">
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default StaffHeader;
