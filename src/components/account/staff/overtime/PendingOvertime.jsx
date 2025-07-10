import { useAuth } from '@/contexts/AuthContext';
import { getPendingShiftsAndRejectionHistoryByUserService, cancelUserBookingService } from '@/services/shiftsServices';
import { getShiftRequestsByUserService } from '@/services/shiftRequestServices'; // Add this import
import { useUndevelopedFunctionality } from '@/contexts/UndevelopedFunctionalityWarning';
import React from 'react';

const PendingOvertime = ({selectedYearMonth, setSelectedYearMonth}) => {
  const [pendingShifts, setPendingShifts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all'); // 'all', 'pending', 'rejected'
  const { user } = useAuth();
  const { showWarning } = useUndevelopedFunctionality();

  React.useEffect(() => {
    const fetchPendingData = async () => {
      if (!user?.id) return;
      setLoading(true);
      setMessage('');
      
      try {
        // Fetch both shift bookings and backdoor requests concurrently
        const [shiftsResponse, requestsResponse] = await Promise.all([
          getPendingShiftsAndRejectionHistoryByUserService(user.id, selectedYearMonth),
          getShiftRequestsByUserService(user.id) // Get all backdoor requests
        ]);
        
        let combinedData = [];
        
        // Add regular shift bookings (pending and rejected)
        if (shiftsResponse.data) {
          combinedData = [...shiftsResponse.data];
        }
        
        // Add backdoor requests and transform them to match the expected format
        if (requestsResponse.data) {
          const backdoorRequests = requestsResponse.data
            .filter(request => {
              // Only include pending and rejected backdoor requests
              // Approved backdoor requests become regular shifts
              if (!['pending', 'rejected'].includes(request.status)) {
                return false;
              }
              
              // Filter by selected month if needed
              const requestDate = new Date(request.date);
              const [year, month] = selectedYearMonth.split('-');
              const startDate = new Date(`${year}-${month}-01`);
              const endDate = new Date(startDate);
              endDate.setMonth(endDate.getMonth() + 1);
              
              return requestDate >= startDate && requestDate < endDate;
            })
            .map(request => ({
              _id: request._id,
              date: request.date,
              startTime: request.startTime,
              endTime: request.endTime,
              department: request.department,
              type: request.status === 'pending' ? 'backdoor-pending' : 'backdoor-rejected',
              status: request.status,
              reason: request.reason,
              isBackdoorRequest: true,
              createdAt: request.createdAt,
              reviewedAt: request.reviewedAt,
              reviewedBy: request.reviewedBy,
              adminNotes: request.adminNotes,
              rejectionReason: request.status === 'rejected' ? request.adminNotes : null
            }));
          
          combinedData = [...combinedData, ...backdoorRequests];
        }
        
        // Sort by date (newest first)
        combinedData.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        
        setPendingShifts(combinedData);
        
        // Set error message if both failed
        if (shiftsResponse.error && requestsResponse.error) {
          setMessage('Error loading pending shifts and requests');
        }
      } catch (error) {
        console.error('Error fetching pending data:', error);
        setMessage('Error loading pending shifts and requests');
      }
      setLoading(false);
    };

    fetchPendingData();
  }, [user, selectedYearMonth]);

  const handleCancelRequest = async (shiftId) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await cancelUserBookingService(shiftId, user.id);
      if (response.data) {
        setMessage('Request canceled successfully!');
        // Remove the canceled shift from the list
        setPendingShifts(pendingShifts.filter(shift => shift._id !== shiftId));
      } else {
        setMessage(response.error || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Error canceling request:', error);
      setMessage('Error canceling request');
    }
    
    setLoading(false);
  };

  // Filter shifts based on selected status
  const filteredShifts = React.useMemo(() => {
    if (statusFilter === 'all') return pendingShifts;
    return pendingShifts.filter(shift => {
      if (statusFilter === 'pending') {
        return shift.type === 'pending' || shift.type === 'backdoor-pending';
      } else if (statusFilter === 'rejected') {
        return shift.type === 'rejected' || shift.type === 'backdoor-rejected';
      }
      return shift.type === statusFilter;
    });
  }, [pendingShifts, statusFilter]);

  // Count shifts by type for filter labels
  const shiftCounts = React.useMemo(() => {
    const pending = pendingShifts.filter(shift => 
      shift.type === 'pending' || shift.type === 'backdoor-pending'
    ).length;
    const rejected = pendingShifts.filter(shift => 
      shift.type === 'rejected' || shift.type === 'backdoor-rejected'
    ).length;
    return { pending, rejected, total: pendingShifts.length };
  }, [pendingShifts]);

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className='text-amber-700 font-semibold mb-4 sm:mb-0'>My Pending & Rejected Overtime Requests</h3>
            
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({shiftCounts.total})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending ({shiftCounts.pending})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'rejected'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Rejected ({shiftCounts.rejected})
              </button>
            </div>
          </div>
          
          {/* Active filter indicator */}
          {statusFilter !== 'all' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Showing:</span> {statusFilter === 'pending' ? 'Pending' : 'Rejected'} requests only 
                <button 
                  onClick={() => setStatusFilter('all')}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Show all
                </button>
              </p>
            </div>
          )}
          
          {loading && <p>Loading...</p>}
          {message && <p className="text-gray-600">{message}</p>}
          
          {filteredShifts.length === 0 && !loading && (
            <div className="text-center py-10">
              {statusFilter === 'all' ? (
                <>
                  <p className="text-gray-500 mb-4">You have no pending or rejected overtime requests for this month.</p>
                  <p className="text-sm text-gray-400">Book shifts from the "Available Overtime" tabs to see them here.</p>
                </>
              ) : statusFilter === 'pending' ? (
                <>
                  <p className="text-gray-500 mb-4">You have no pending overtime requests for this month.</p>
                  <p className="text-sm text-gray-400">Book shifts from the "Available Overtime" tabs to see them here.</p>
                </>
              ) : (
                <>
                  <p className="text-gray-500 mb-4">You have no rejected overtime requests for this month.</p>
                  <p className="text-sm text-gray-400">Rejected requests will appear here when administrators decline your overtime requests.</p>
                </>
              )}
            </div>
          )}

          <div className="space-y-4">
            {filteredShifts.map((shift, index) => {
              const isPending = shift.type === 'pending' || shift.type === 'backdoor-pending';
              const isRejected = shift.type === 'rejected' || shift.type === 'backdoor-rejected';
              const isBackdoorRequest = shift.isBackdoorRequest;
              
              return (
              <div key={`${shift._id}-${shift.type}-${shift.rejectedAt || shift.date}-${index}`} className={`border p-4 rounded-lg shadow-sm ${
                isRejected 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Department:</span>
                        <p className="font-semibold">{shift.department?.name}</p>
                      </div>
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
                        <span className="text-sm text-gray-500">Status:</span>
                        <p className={`font-semibold ${
                          isRejected 
                            ? 'text-red-600' 
                            : 'text-amber-600'
                        }`}>
                          {isRejected ? 'Rejected' : 'Pending Approval'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Show backdoor request reason if it's a backdoor request */}
                    {isBackdoorRequest && shift.reason && (
                      <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Request Reason:</h4>
                        <p className="text-sm text-blue-700">{shift.reason}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          This is a custom shift request (backdoor request)
                        </p>
                      </div>
                    )}
                    
                    {/* Show rejection reason if the shift was rejected */}
                    {isRejected && shift.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
                        <h4 className="text-sm font-semibold text-red-800 mb-1">Rejection Reason:</h4>
                        <p className="text-sm text-red-700">{shift.rejectionReason}</p>
                        {shift.rejectedAt && (
                          <p className="text-xs text-red-600 mt-1">
                            Rejected on: {new Date(shift.rejectedAt).toLocaleDateString()} at {new Date(shift.rejectedAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Only show cancel button for pending shifts (note: backdoor requests can't be cancelled like regular bookings) */}
                  {isPending && !isBackdoorRequest && (
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <button
                        onClick={() => handleCancelRequest(shift._id)}
                        disabled={loading}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Canceling...' : 'Cancel Request'}
                      </button>
                    </div>
                  )}
                  
                  {/* Show note for backdoor requests */}
                  {isBackdoorRequest && isPending && (
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
                        <p className="font-medium">Custom Request</p>
                        <p>Waiting for admin approval</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default PendingOvertime;