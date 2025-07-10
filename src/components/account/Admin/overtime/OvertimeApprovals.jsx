import React, { useEffect, useState } from 'react';
import { approveShiftService, getPendingShiftsService, rejectShiftService } from '@/services/shiftsServices';
import { useAuth } from '@/contexts/AuthContext';

const OvertimeApprovals = ({ onShiftUpdate }) => {
  const [pendingShifts, setPendingShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedYearMonth, setSelectedYearMonth] = useState(new Date().toISOString().slice(0, 7)); // Current month as default
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  const { user } = useAuth();

  useEffect(() => {
    const fetchPendingShifts = async () => {
      setLoading(true);
      setMessage('');
      try {
        const res = await getPendingShiftsService(selectedYearMonth);
        if (res.data) {
          setPendingShifts(res.data);
        } else {
          setMessage(res.error || 'Failed to load pending shifts');
        }
      } catch (error) {
        console.error('Error fetching pending shifts:', error);
        setMessage('Error loading pending shifts');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingShifts();
  }, [selectedYearMonth, refreshTrigger]); // Add refreshTrigger dependency

  const handleApprove = async (shiftId, userId, userFullName) => {
    const actionKey = `approve-${shiftId}-${userId}`;
    setActionLoading(prev => ({ ...prev, [actionKey]: true }));
    setMessage('');
    
    try {
      const res = await approveShiftService(shiftId, userId, user?.id);
      if (res.data) {
        setMessage(`Shift approved successfully for ${userFullName}!`);
        // Trigger local refresh to update the pending shifts list
        setRefreshTrigger(prev => prev + 1);
        // Trigger refresh of parent component data
        if (onShiftUpdate) {
          // Small delay to ensure database transaction is complete
          setTimeout(() => {
            console.log('🔄 Triggering shift update after approval');
            onShiftUpdate();
          }, 500);
        }
      } else {
        setMessage(res.error || 'Failed to approve shift');
      }
    } catch (error) {
      console.error('Error approving shift:', error);
      setMessage('Error approving shift');
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleRejectClick = (shiftId, userId) => {
    setSelectedShiftId(shiftId);
    setSelectedUserId(userId);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      setMessage('Please provide a reason for rejection');
      return;
    }

    const actionKey = `reject-${selectedShiftId}-${selectedUserId}`;
    setActionLoading(prev => ({ ...prev, [actionKey]: true }));
    setMessage('');
    
    try {
      const res = await rejectShiftService(selectedShiftId, selectedUserId, rejectionReason, user?.id);
      if (res.data) {
        setMessage('Shift rejected successfully!');
        // Trigger local refresh to update the pending shifts list
        setRefreshTrigger(prev => prev + 1);
        setShowRejectModal(false);
        setSelectedShiftId(null);
        setSelectedUserId(null);
        setRejectionReason('');
        // Trigger refresh of parent component data
        if (onShiftUpdate) {
          // Small delay to ensure database transaction is complete
          setTimeout(() => {
            console.log('🔄 Triggering shift update after rejection');
            onShiftUpdate();
          }, 500);
        }
      } else {
        setMessage(res.error || 'Failed to reject shift');
      }
    } catch (error) {
      console.error('Error rejecting shift:', error);
      setMessage('Error rejecting shift');
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setSelectedShiftId(null);
    setSelectedUserId(null);
    setRejectionReason('');
  };

  return (
    <div className='text-text-gray p-4'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-primary">Overtime Approvals</h2>
        <p className="text-gray-600 mb-4">
          Review and approve overtime shifts that staff have booked. Once approved, shifts will be confirmed for the staff members.
        </p>
        
        {/* Month Filter */}
        <div className="flex items-center gap-2 mb-4">
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
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-primary">Loading pending approvals...</div>
        </div>
      )}
      
      {message && (
        <div className={`p-3 rounded-md mb-4 ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          {message}
        </div>
      )}

      {pendingShifts.length === 0 && !loading && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No pending shifts require approval at this time.</p>
          <p className="text-gray-400 text-sm mt-2">Staff-booked shifts will appear here for your review.</p>
        </div>
      )}

      {pendingShifts.length > 0 && (
        <div className="space-y-4">
          {pendingShifts.map(shift => {
            const pendingBooking = shift.pendingBooking;
            const staffMember = pendingBooking?.by;
            const approveActionKey = `approve-${shift._id}-${staffMember?._id}`;
            const rejectActionKey = `reject-${shift._id}-${staffMember?._id}`;
            const isApproveLoading = actionLoading[approveActionKey];
            const isRejectLoading = actionLoading[rejectActionKey];
            
            return (
              <div key={`${shift._id}-${staffMember?._id}`} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                  {/* Staff Information */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Staff Member</h3>
                    <div className="text-lg font-semibold text-gray-900">
                      {staffMember?.fullName || 'Unknown Staff'}
                    </div>
                    {staffMember?.email && (
                      <div className="text-sm text-gray-600">{staffMember.email}</div>
                    )}
                    {pendingBooking?.bookedAt && (
                      <div className="text-xs text-gray-500">
                        Booked: {new Date(pendingBooking.bookedAt).toLocaleDateString()} at {new Date(pendingBooking.bookedAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  {/* Department Information */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Department</h3>
                    <div className="text-lg font-semibold text-secondary">
                      {shift.department?.name || 'Unknown Department'}
                    </div>
                    {pendingBooking?.isBackdoorRequest && (
                      <div className="inline-flex px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        Backdoor Request
                      </div>
                    )}
                  </div>

                  {/* Shift Details */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Shift Details</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="font-medium">{new Date(shift.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Day:</span>
                        <span className="font-medium">{new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Time:</span>
                        <span className="font-medium">{shift.startTime} - {shift.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Pending Approval
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 justify-center">
                    <button
                      className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      onClick={() => handleApprove(shift._id, staffMember?._id, staffMember?.fullName)}
                      disabled={isApproveLoading || isRejectLoading}
                    >
                      {isApproveLoading ? 'Approving...' : 'Approve Shift'}
                    </button>
                    <button
                      className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      onClick={() => handleRejectClick(shift._id, staffMember?._id)}
                      disabled={isApproveLoading || isRejectLoading}
                    >
                      {isRejectLoading ? 'Processing...' : 'Reject Shift'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Shift</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this overtime shift. This will be communicated to the staff member.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRejectCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={Object.values(actionLoading).some(loading => loading)}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={Object.values(actionLoading).some(loading => loading) || !rejectionReason.trim()}
              >
                {actionLoading[`reject-${selectedShiftId}-${selectedUserId}`] ? 'Rejecting...' : 'Reject Shift'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OvertimeApprovals;
