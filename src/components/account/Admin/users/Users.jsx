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
    <div className="w-full text-text-gray">
      {/* Header */}
      <div className="sticky top-0 w-full z-10 shadow-md">
        <AdminHeader />
      </div>
      {/* Navigation */}
      <div>
        {/* Navigation menu for large screens */}
        <ul className="flex space-x-10 lg:p-4 bg-gray-100 sticky top-16 z-5">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`cursor-pointer hover:scale-105 hidden lg:block ${activeMenu === item.name ? 'font-bold text-primary' : 'text-gray-600'}`}
              onClick={() => handleMenuClick(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Mobile navigation menu */}
        <div className="lg:hidden p-4 bg-gray-100 sticky top-16 z-5">
          <select className="w-full p-2 border border-gray-300 rounded" value={activeMenu} onChange={(e) => handleMenuClick(e.target.value)}>
            {menuItems.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-0 lg:gap-5 space-y-4 lg:flex-row w-full">
        {/* Display top nav*/}

        {menuItems.map((item) =>
          item.name === activeMenu ? (
            <button
              key={item.name}
              onClick={showWarning}
              className="bg-secondary lg:w-20px shadow-lg sticky top-16  h-fit text-white py-2 px-4 rounded-lg cursor-pointer hover:scale-102"
            >
              {item?.topNav?.name}
            </button>
          ) : null
        )}

        {/* Display body*/}
        {menuItems.map((item) =>
          item.name === activeMenu ? (
            <div key={item.name} className="w-full lg:w-[85%] p-4 rounded-lg shadow-md">
              {item.component}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Users;
