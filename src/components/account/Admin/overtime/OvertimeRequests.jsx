import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllShiftRequestsService, reviewShiftRequestService } from '@/services/shiftRequestServices';
import { calculateHours } from '@/utilities/calculateHours';

const OvertimeRequests = ({ onShiftUpdate }) => {
  const { user } = useAuth();
  const [shiftRequests, setShiftRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYearMonth, setSelectedYearMonth] = useState(new Date().toISOString().slice(0, 7)); // Current month as default
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    fetchShiftRequests();
  }, [selectedStatus, selectedYearMonth]);

  const fetchShiftRequests = async () => {
    if (!user?.id) {
      setMessage('Please log in to view shift requests');
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const status = selectedStatus === 'all' ? null : selectedStatus;
      console.log('Fetching shift requests with params:', { status, yearMonth: selectedYearMonth }); // Debug log
      
      const response = await getAllShiftRequestsService(status, selectedYearMonth);
      console.log('API Response:', response); // Debug log
      
      if (response.data) {
        setShiftRequests(response.data);
        console.log('Shift requests loaded:', response.data.length); // Debug log
      } else {
        console.error('API Error:', response.error); // Debug log
        setMessage(response.error || 'Failed to load shift requests');
      }
    } catch (error) {
      console.error('Fetch Error:', error); // Debug log
      setMessage('Network error: Unable to connect to server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (requestId, status, adminNotes = '') => {
    if (!user?.id) {
      setMessage('User not authenticated');
      return;
    }

    setReviewingId(requestId);
    try {
      const response = await reviewShiftRequestService(requestId, status, adminNotes, user.id);
      
      if (response.data) {
        setMessage(`Request ${status} successfully!`);
        // Update the local state
        setShiftRequests(prevRequests => 
          prevRequests.map(request => 
            request._id === requestId 
              ? { ...request, status, reviewedBy: user, reviewedAt: new Date(), adminNotes }
              : request
          )
        );
        // Trigger refresh of parent component data (especially for approved requests that create new shifts)
        if (onShiftUpdate && status === 'approved') {
          // Small delay to ensure database transaction is complete
          setTimeout(() => {
            console.log('🔄 Triggering shift update after request approval');
            onShiftUpdate();
          }, 500);
        }
      } else {
        setMessage(response.error || `Failed to ${status} request`);
      }
    } catch (error) {
      console.error('Error reviewing request:', error);
      setMessage('Error processing request');
    } finally {
      setReviewingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='text-text-gray p-4'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-primary">Overtime Requests</h2>
        <p className="text-gray-600 mb-4">
          Review backdoor overtime requests from staff. These are special requests made outside the normal shift booking process.
        </p>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          {/* Month Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="monthFilter" className="text-sm font-medium text-gray-700">
              Month:
            </label>
            <input
              id="monthFilter"
              type="month"
              value={selectedYearMonth}
              onChange={(e) => setSelectedYearMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-primary">Loading shift requests...</div>
        </div>
      )}
      
      {message && (
        <div className={`p-3 rounded-md mb-4 ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          {message}
        </div>
      )}

      {shiftRequests.length === 0 && !loading && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No overtime requests found.</p>
          <p className="text-gray-400 text-sm mt-2">
            {selectedStatus === 'all' 
              ? 'Staff backdoor requests will appear here.' 
              : `No ${selectedStatus} requests at this time.`
            }
          </p>
        </div>
      )}

      {shiftRequests.length > 0 && (
        <div className="space-y-6">
          {shiftRequests.map(request => (
            <div key={request._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              {/* Backdoor Request Marker */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                  🚪 Backdoor Request
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                {/* Staff Information */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Requested By</h3>
                  <div className="text-lg font-semibold text-gray-900">
                    {request.requestedBy?.fullName || 'Unknown Staff'}
                  </div>
                  {request.requestedBy?.email && (
                    <div className="text-sm text-gray-600">{request.requestedBy.email}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Requested: {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Department Information */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Department</h3>
                  <div className="text-lg font-semibold text-secondary">
                    {request.department?.name || 'Unknown Department'}
                  </div>
                </div>

                {/* Shift Details */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Requested Shift</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="font-medium">{new Date(request.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Day:</span>
                      <span className="font-medium">{new Date(request.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Time:</span>
                      <span className="font-medium">{request.startTime} - {request.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Hours:</span>
                      <span className="font-medium">{calculateHours(request.startTime, request.endTime)}h</span>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Request Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500 block">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Reason:</span>
                      <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                        {request.reason}
                      </p>
                    </div>
                    {request.reviewedBy && (
                      <div>
                        <span className="text-sm text-gray-500 block">Reviewed By:</span>
                        <span className="text-sm text-gray-700">
                          {request.reviewedBy.fullName}
                        </span>
                        <div className="text-xs text-gray-500">
                          {new Date(request.reviewedAt).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {request.adminNotes && (
                      <div>
                        <span className="text-sm text-gray-500 block">Admin Notes:</span>
                        <p className="text-sm text-gray-700 mt-1 bg-blue-50 p-2 rounded">
                          {request.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        onClick={() => handleReview(request._id, 'approved')}
                        disabled={reviewingId === request._id}
                      >
                        {reviewingId === request._id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        onClick={() => handleReview(request._id, 'rejected')}
                        disabled={reviewingId === request._id}
                      >
                        {reviewingId === request._id ? 'Processing...' : 'Reject'}
                      </button>
                    </>
                  )}
                  {request.status !== 'pending' && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      Request {request.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OvertimeRequests;
