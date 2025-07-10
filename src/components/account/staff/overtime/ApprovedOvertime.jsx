import { getApprovedShiftsByUserAndYearMonthService } from '@/services/shiftsServices';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatLocalDate, getDayOfWeek } from '@/utilities/formatDates';
import { useUndevelopedFunctionality } from '@/contexts/UndevelopedFunctionalityWarning';

const ApprovedOvertime = ({departments, selectedYearMonth, setSelectedYearMonth, handleMenuClick}) => {

  const [shifts, setShifts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { user } = useAuth();
  const { showWarning } = useUndevelopedFunctionality();

  React.useEffect(() => {
    const fetchShifts = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError('');
      try {
        console.log('Fetching approved shifts for user:', user.id, 'month:', selectedYearMonth);
        const response = await getApprovedShiftsByUserAndYearMonthService(user.id, selectedYearMonth);
        if (response.data) {
          setShifts(response.data);
          console.log('Approved shifts fetched:', response.data);
        } else if (response.error) {
          setError(response.error);
          console.error('Error from API:', response.error);
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
        setError('Failed to load approved shifts');
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [user, selectedYearMonth]);

  const findShiftLocation = (shift) => {
    const department = departments && departments.find(dept => (
      dept._id === shift.department._id
    ));

    return department?.name || 'Unknown Department';
  };

  const handleCancelShift = (shiftId) => {
    showWarning('Cancel shift functionality is under development');
  };

  const handleSwapShift = (shiftId) => {
    showWarning('Swap shift functionality is under development');
  };

  return (
    <div className='lg:flex-row flex flex-col gap-5 w-full'>
      <div className='lg:w-fit w-full '>
        <button
          onClick={()=>window.location.href='/staff/request-overtime'}
          className='bg-primary p-3 rounded-lg text-white hover:scale-105 cursor-pointer'
        >
          Make a shift request
        </button>
      </div>

      <div className='flex flex-col lg:w-3/4'>
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

        <span className='text-primary font-semibold'>Your approved overtime shifts</span>
        
        {loading && <div className="text-center py-4 text-gray-500">Loading approved shifts...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}
        
        {!loading && shifts && shifts.length > 0 ? (
          <div className="space-y-4 mt-4">
            {shifts.map((shift, idx) => (
              <div key={shift._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Shift Details */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Date:</span>
                        <div>
                          <p className="font-semibold text-secondary">{getDayOfWeek(shift.date)}</p>
                          <p className="text-sm">{formatLocalDate(shift.date)}</p>
                          {shift.isBackdoorRequest && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full mt-1">
                              🚪 Special Request
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Location:</span>
                        <p className="font-semibold">{findShiftLocation(shift)}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Start Time:</span>
                        <p className="font-semibold text-gray-700">{shift.startTime}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">End Time:</span>
                        <p className="font-semibold text-gray-700">{shift.endTime}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleCancelShift(shift._id)}
                      className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSwapShift(shift._id)}
                      className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors shadow-md"
                    >
                      Swap
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200 mt-4">
            <p className="font-semibold text-red-500 mb-4">
              You do not have any approved overtime at the moment
            </p>
            <button 
              onClick={() => handleMenuClick('Available Overtime in my location')} 
              className='px-6 py-3 text-secondary hover:underline cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Check Available Overtime
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ApprovedOvertime;
