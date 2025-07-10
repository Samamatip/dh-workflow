import React from 'react';
import { formatLocalDate } from '@/utilities/formatDates'; // Importing the date formatting utility
import Image from 'next/image';
import { useUndevelopedFunctionality } from '@/contexts/UndevelopedFunctionalityWarning';

const AvailableOvertime = ({ shifts, selectedYearMonth, setSelectedYearMonth, loading }) => {
  const [openShifts, setOpenShifts] = React.useState({});
  const { showWarning } = useUndevelopedFunctionality();

  const filteredShifts = shifts.filter((shift) => {
    // filter shift based on if they have slots greater than 0 available
    return shift.shift.filter((s) => s.quantity > 0);
  });

  // Function to toggle the visibility of shifts for a department
  const toggleShifts = (deptId) => {
    setOpenShifts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId], // Toggle the visibility
    }));
  };

  return (
    <div className='text-text-gray'>
      <div className="flex lg:flex-row flex-col gap-5 py-5 w-full">
        {/* Render department names and number of shifts */}
        <ul className="bg-green-900 px-1 py-2 rounded-lg shadow-md w-full lg:w-1/6 lg:max-h-fit max-h-28 overflow-y-auto scrollbar-thin">
          <h4 className="text-white w-full border-b text-center font-semibold mb-2">Available shifts</h4>
          {shifts.map((dept) => (
            <li key={dept.department._id}>
              {/* Render the departments name, and the total of all shift quantities */}
              <strong className="text-white">{dept.department.name}</strong>
              <span className="ml-2 text-background-1">: {dept?.shift?.reduce((total, shift) => total + shift.quantity, 0)} Shifts</span>
            </li>
          ))}
        </ul>

        {/* Render shifts for each department */}
        <div className="lg:w-2/3 w-full sticky top-48 z-7 overflow-hidden">
          {/* filter shifts by month and year selector */}
          <h2 className="bg-background-1 p-2 w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-end">
            <label htmlFor="monthYearSelect" className="text-secondary font-semibold">
              Filter Shifts by month:
            </label>
            <input
              type="month"
              id="monthYearSelect"
              className="p-2 border-1 border-secondary cursor-pointer rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedYearMonth}
              onChange={(e) => setSelectedYearMonth(e.target.value)}
            />
          </h2>

          {loading ? (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading available shifts...</p>
            </div>
          ) : shifts.map((dept) => (
            <div key={dept.department._id} className="mb-5 bg-secondary rounded-sm p-2">
              <h3 className="px-5 py-2 text-white font-semibold flex flex-row justify-between items-center">
                <span className="">{dept.department.name} Shifts</span>
                <button
                  onClick={() => toggleShifts(dept.department._id)}
                  className="ml-2 text-white cursor-pointer hover:scale-105 transition-transform duration-200"
                  title={`${openShifts[dept.department._id] ? 'Collapse shifts' : 'Open shifts'}`}
                >
                  {openShifts[dept.department._id] ? '▼' : '◀'}
                </button>
              </h3>
              {openShifts[dept.department._id] && (
                // Render the shifts for the department
                <ul className="p-1 bg-gray-100 rounded-sm max-h-[50vh] overflow-y-auto scrollbar-thin">
                  {loading ? (
                    <li className="text-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading shifts...</p>
                    </li>
                  ) : dept?.shift?.length > 0 ? (
                    dept.shift.map((shift) => (
                      <li key={shift._id} className="border-b border-gray-200 p-2">
                        {/* Mobile-first responsive layout */}
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 lg:gap-x-4">
                          {/* Date and time info */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1">
                            <span className="font-medium text-sm lg:text-base">{formatLocalDate(shift.date)}</span>
                            <span className="text-gray-600 text-sm">({shift.weekDay})</span>
                            <span className="text-sm lg:text-base">{shift.startTime} to {shift.endTime}</span>
                            <span className="text-gray-600 text-sm">({shift.hoursWorked} hours)</span>
                          </div>
                          
                          {/* Slots info and actions */}
                          <div className="flex justify-between items-center lg:gap-4">
                            <span className="text-amber-800 font-medium text-sm lg:text-base">
                              Slots: {shift.quantity}
                            </span>
                            
                            {/* Action buttons */}
                            <div className='flex gap-2'>
                              {/* Edit */}
                              <Image
                               src={'/assets/edit.png'}
                               width={18}
                               height={18}
                               alt='edit'
                               className='cursor-pointer hover:scale-105'
                               onClick={showWarning}
                              />
                          
                              {/* Delete shift */}
                              <span 
                                title='delete shift' 
                                className='cursor-pointer rounded-full px-2 text-white bg-error hover:scale-105 text-sm'
                                onClick={showWarning}
                              >
                                  X
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-text-gray text-sm p-5">No shifts available for this department in this period</li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableOvertime;
