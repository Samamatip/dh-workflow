'use client';
import { getDepartmentsService } from '@/services/departmentsServices';
import React from 'react';
import { getPublishedShiftsByDepartmentAndYearMonthService } from '@/services/shiftsServices';
import AdminHeader from '../AdminHeader';
import UploadedOvertime from './UploadedOvertime';
import AvailableOvertime from './AvailableOvertime';
import OvertimeRequests from './OvertimeRequests';
import OvertimeApprovals from './OvertimeApprovals';
import UnpublishedOvertime from './UnpublishedOvertime';

const Overtime = () => {
  const [activeMenu, setActiveMenu] = React.useState('Published Overtime');
  const [selectedYearMonth, setSelectedYearMonth] = React.useState(new Date().toISOString().slice(0, 7)); // Default to current month in 'YYYY-MM' format
  const [shifts, setShifts] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingShifts, setLoadingShifts] = React.useState(false);

  // Helper to generate ISO date and weekday
  function getShiftDay(baseDate) {
    const date = new Date(baseDate);
    date.setDate(date.getDate());
    const weekDay = date.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    return weekDay;
  }

  // Helper to calculate hours worked
  function hoursWorked(startTime, endTime) {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diff = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
    return diff >= 0 ? diff : 0; // Ensure non-negative hours
  }

  React.useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await getDepartmentsService();
        if (response.data) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  React.useEffect(() => {
    const fetchShiftsByDepartmentAndYearMonth = async () => {
      if (departments.length === 0) return;
      
      setLoadingShifts(true);
      try {
        const shiftsData = await Promise.all(
          departments.map(async (dept) => {
            const response = await getPublishedShiftsByDepartmentAndYearMonthService(dept._id, selectedYearMonth);
            if (response.data) {
              return {
                department: response.data.department,
                shift: response?.data?.shift?.map((shift) => ({
                  _id: shift._id,
                  date: shift.date,
                  weekDay: getShiftDay(shift.date),
                  startTime: shift.startTime,
                  endTime: shift.endTime,
                  hoursWorked: hoursWorked(shift.startTime, shift.endTime),
                  quantity: shift.quantity,
                  slotsTaken: shift.slotsTaken,
                })),
              };
            } else {
              return {
                department: dept,
                shift: [],
              };
            }
          })
        );
        setShifts(shiftsData);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } finally {
        setLoadingShifts(false);
      }
    };

    fetchShiftsByDepartmentAndYearMonth();
  }, [departments, selectedYearMonth]);

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  const menuItems = [
    {
      name: 'Published Overtime',
      component: <UploadedOvertime shifts={shifts} selectedYearMonth={selectedYearMonth} setSelectedYearMonth={setSelectedYearMonth} loading={loadingShifts} />,
      styleActive:`font-bold text-primary scale-105 bg-white p-1 rounded-sm shadow-md`
    },
    {
      name: 'Available Overtime',
      component: <AvailableOvertime shifts={shifts} selectedYearMonth={selectedYearMonth} setSelectedYearMonth={setSelectedYearMonth} loading={loadingShifts} />,
      styleActive:`font-bold text-secondary scale-105 bg-white p-1 rounded-sm shadow-md`
    },
    {
      name: 'Unpublished Overtime',
      component: <UnpublishedOvertime selectedYearMonth={selectedYearMonth} setSelectedYearMonth={setSelectedYearMonth} loading={loading} />,
      styleActive: `font-bold text-amber-700 scale-105 bg-white p-1 rounded-sm shadow-md`,
    },
    {
      name: 'Overtime Requests',
      component: <OvertimeRequests />,
      styleActive:`font-bold text-primary`
    },
    {
      name: 'Overtime Approvals',
      component: <OvertimeApprovals />,
      styleActive:`font-bold text-primary`
    },
  ];

  return (
    <div className="max-h-screen overflow-y-auto scrollbar-thin text-text-gray">
      {/* Header */}
      <div className="sticky top-0 w-full z-10 shadow-md">
        <AdminHeader />
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
