import { useAuth } from '@/contexts/AuthContext';
import { getAvailablePublishedShiftsByUserDepartmentService, bookShiftService } from '@/services/shiftsServices';
import { useUndevelopedFunctionality } from '@/contexts/UndevelopedFunctionalityWarning';
import React from 'react';

const AvailableOvertimeInMyLocation = ({departments, selectedYearMonth, setSelectedYearMonth, handleMenuClick}) => {

  const [shifts, setShifts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const { user } = useAuth();
  const { showWarning } = useUndevelopedFunctionality();

  React.useEffect(() => {
    const fetchShifts = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await getAvailablePublishedShiftsByUserDepartmentService(user.id, selectedYearMonth);
        if (response.data) {
          setShifts(response.data);
        } else if (response.error) {
          setMessage(response.error);
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
        setMessage('Error loading shifts');
      }
      setLoading(false);
    };

    fetchShifts();
  }, [user, selectedYearMonth]);

  const handleBookShift = async (shiftId) => {
    setLoading(true);
    setMessage('');
    const response = await bookShiftService(shiftId, user.id);
    if (response.data) {
      setMessage('Shift booked successfully! Check "My Pending overtime Requests" tab.');
      // Remove the booked shift from available list
      setShifts(shifts.filter(shift => shift._id !== shiftId));
    } else {
      setMessage(response.error || 'Failed to book shift');
    }
    setLoading(false);
  };



  return (
    <div className='flex flex-col w-full'>
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
        
        <div className="p-4">
          <h3 className='text-primary font-semibold mb-4'>Available Shifts in My Department</h3>
          
          {loading && <p>Loading...</p>}
          {message && <p className={message.includes('Error') || message.includes('Failed') ? 'text-red-600' : 'text-green-600'}>{message}</p>}
          
          {shifts.length === 0 && !loading && (
            <p className="text-gray-500">No available shifts in your department for this month.</p>
          )}

          <div className="space-y-4">
            {shifts.map((shift) => (
              <div key={shift._id} className="border p-4 rounded-lg bg-white shadow-sm">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Date:</span>
                        <p className="font-semibold">{new Date(shift.date).toLocaleDateString()}</p>
                        <p className="text-sm text-secondary">{new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Time:</span>
                        <p className="font-semibold">{shift.startTime} - {shift.endTime}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Available Slots:</span>
                        <p className="font-semibold">
                          {shift.quantity - (shift.status?.filter(s => ['pending', 'approved'].includes(s.status)).length || 0)} / {shift.quantity}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <p className="font-semibold text-green-600">Available</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4">
                    <button
                      onClick={() => handleBookShift(shift._id)}
                      disabled={loading}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Booking...' : 'Book Shift'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};

export default AvailableOvertimeInMyLocation;