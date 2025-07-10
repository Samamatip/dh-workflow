import { getDepartmentsService } from '@/services/departmentsServices';
import React from 'react';
import StaffHeader from '../StaffHeader';
import ApprovedOvertime from './ApprovedOvertime';
import AvailableOvertimeInMyLocation from './AvailableOvertimeInMyLocation';
import AvailableOvertimeInOtherLocation from './AvailableOvertimeInOtherLocation';
import PendingOvertime from './PendingOvertime';
import { calculateHours } from '@/utilities/calculateHours';

const Overtime = () => {
  const [activeMenu, setActiveMenu] = React.useState('My approved Overtime');
  const [selectedYearMonth, setSelectedYearMonth] = React.useState(new Date().toISOString().slice(0, 7)); // Default to current month in 'YYYY-MM' format
  const [departments, setDepartments] = React.useState([]);

  // Helper to generate ISO date and weekday
  function getShiftDay(baseDate) {
    const date = new Date(baseDate);
    date.setDate(date.getDate());
    const weekDay = date.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    return weekDay;
  }

  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartmentsService();
        if (response.data) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    return;
  };

  const menuItems = [
    {
      name: 'My approved Overtime',
      component:  <ApprovedOvertime 
                    departments={departments} 
                    selectedYearMonth={selectedYearMonth} 
                    setSelectedYearMonth={setSelectedYearMonth} 
                    handleMenuClick={handleMenuClick}
                  />,
      styleActive:`font-bold text-primary scale-105 bg-white p-1 rounded-sm shadow-md`
    },
    {
      name: 'Available Overtime in my location',
      component: <AvailableOvertimeInMyLocation departments={departments} selectedYearMonth={selectedYearMonth} setSelectedYearMonth={setSelectedYearMonth} handleMenuClick={handleMenuClick} />,
      styleActive:`font-bold text-secondary scale-105 bg-white p-1 rounded-sm shadow-md`
    },
    {
      name: 'Available Overtime in other locations',
      component: <AvailableOvertimeInOtherLocation selectedYearMonth={selectedYearMonth} setSelectedYearMonth={setSelectedYearMonth} />,
      styleActive: `font-bold text-secondary scale-105 bg-white p-1 rounded-sm shadow-md`,
    },
    {
      name: 'My Pending overtime Requests',
      component: <PendingOvertime selectedYearMonth={selectedYearMonth} setSelectedYearMonth={setSelectedYearMonth} />,
      styleActive:`font-bold text-amber-700 scale-105 bg-white p-1 rounded-sm shadow-md`
    }
  ];

  return (
    <div className="max-h-screen overflow-y-auto scrollbar-thin text-text-gray h-screen">
      {/* Header */}
      <div className="sticky top-0 w-full z-10 shadow-md">
        <StaffHeader />
      </div>
      {/* Navigation */}
      <div className="sticky top-12 z-5 bg-gray-100">
        {/* Navigation menu for large screens */}
        <ul className="flex space-x-10 lg:p-4 bg-gray-100">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`cursor-pointer hover:scale-105 hidden lg:block ${activeMenu === item.name ? item.styleActive : `font-thin text-primary`}`}
              onClick={() => handleMenuClick(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Mobile navigation menu */}
        <div className="lg:hidden p-4 bg-gray-100 sticky top-12 z-5">
          <select className="w-full p-2 border border-gray-300 rounded" value={activeMenu} onChange={(e) => handleMenuClick(e.target.value)}>
            {menuItems.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display */}
      <div className="p-4 sticky top-16 z-5 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => (item.name === activeMenu ? <div key={item.name}>{item.component}</div> : null))}
      </div>
    </div>
  );
};

export default Overtime;
