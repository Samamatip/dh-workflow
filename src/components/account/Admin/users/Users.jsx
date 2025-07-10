import React from 'react';
import AdminHeader from '../AdminHeader';
import ViewUsers from './ViewUsers';
import Groups from './Groups';
import { useUndevelopedFunctionality } from '@/contexts/UndevelopedFunctionalityWarning';

const sampleUsers = [
  {
    _id: 1,
    fullName: 'John Doe',
    email: 'user1@gmail.com',
    department: {
      name: 'Arthurs',
    },
    group: [
      {
        name: 'Bank staff',
      },
    ],
  },
  {
    _id: 2,
    fullName: 'Jane Smith',
    email: 'user2@gmail.com',
    department: {
      name: 'Transitions',
    },
    group: [
      {
        name: 'Day staff',
      },
    ],
  },
  {
    _id: 3,
    fullName: 'Alice Johnson',
    email: 'user3@gmail.com',
    department: {
      name: 'Arthurs',
    },
  },
  {
    _id: 4,
    fullName: 'Bob Brown',
    email: 'user4@gmail.com',
    department: {
      name: 'Mews',
    },
  },
  {
    _id: 5,
    fullName: 'Charlie White',
    email: 'user5@gmail.com',
    department: {
      name: 'Mews',
    },
  },
  {
    _id: 6,
    fullName: 'David Green',
    email: 'user6@gmail.com',
    department: {
      name: 'Transitions',
    },
    group: [
      {
        name: 'Bank staff',
      },
    ],
  },
  {
    _id: 7,
    fullName: 'Eve Black',
    email: 'user7@gmail.com',
    department: {
      name: 'Arthurs',
    },
  },
  {
    _id: 8,
    fullName: 'Frank Blue',
    email: 'user8@gmail.com',
    department: {
      name: 'Transitions',
    },
  },
];

const Users = () => {
  const [activeMenu, setActiveMenu] = React.useState('All Users');
  const [usersData, setUsersData] = React.useState([]);
  const { showWarning } = useUndevelopedFunctionality();

  React.useEffect(() => {
    setUsersData(sampleUsers);
  }, []);

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  const handleNavClick = (url) => {
    if (!url || url === '') {
      return;
    }

    window.location.href = `users/${url}`;
  };

  const menuItems = [
    {
      name: 'All Users',
      component: <ViewUsers usersData={usersData} />,
      topNav: {
        name: 'Add new user',
        url: 'new-user',
      },
    },
    {
      name: 'Groups and Departments',
      component: <Groups usersData={usersData} />,
      topNav: {
        name: 'Add new group',
        url: 'new-group',
      },
    },
  ];

  return (
    <div className="w-full text-text-gray min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 w-full z-10 shadow-md">
        <AdminHeader />
      </div>
      
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        {/* Navigation menu for large screens */}
        <ul className="hidden lg:flex space-x-8 px-6 py-4 overflow-x-auto">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 rounded-lg transition-all font-medium ${
                activeMenu === item.name 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:text-primary hover:bg-gray-100'
              }`}
              onClick={() => handleMenuClick(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Mobile navigation menu */}
        <div className="lg:hidden px-4 py-3">
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-700 font-medium appearance-none bg-no-repeat bg-right bg-[length:1rem] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23374151%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] pr-10" 
            value={activeMenu} 
            onChange={(e) => handleMenuClick(e.target.value)}
          >
            {menuItems.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Display top nav*/}
            {menuItems.map((item) =>
              item.name === activeMenu ? (
                <div key={item.name} className="lg:w-auto w-full">
                  <button
                    onClick={showWarning}
                    className="bg-secondary w-full lg:w-auto shadow-lg text-white py-3 px-6 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all font-medium text-sm lg:text-base"
                  >
                    {item?.topNav?.name}
                  </button>
                </div>
              ) : null
            )}

            {/* Display body*/}
            {menuItems.map((item) =>
              item.name === activeMenu ? (
                <div key={item.name} className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 lg:p-6">
                    {item.component}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
