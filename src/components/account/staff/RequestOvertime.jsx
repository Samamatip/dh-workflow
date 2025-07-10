import React, { useState, useEffect } from 'react';
import StaffHeader from './StaffHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useUndevelopedFunctionality } from '@/contexts/UndevelopedFunctionalityWarning';
import { getDepartmentsService } from '@/services/departmentsServices';
import { createShiftRequestService } from '@/services/shiftRequestServices';

const RequestOvertime = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
    department: ''
  });
  const { showWarning } = useUndevelopedFunctionality();

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setDepartmentsLoading(true);
      try {
        const response = await getDepartmentsService();
        if (response.data) {
          setDepartments(response.data);
          console.log('Departments loaded:', response.data);
        } else {
          console.error('Failed to fetch departments:', response.error);
          setMessage('Failed to load departments');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setMessage('Error loading departments');
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Set default department to user's department when both user and departments are loaded
  useEffect(() => {
    console.log('User data:', user); // Debug log
    if (user?.department?._id && departments.length > 0 && !formData.department) {
      setFormData(prev => ({
        ...prev,
        department: user.department._id
      }));
    }
  }, [user, departments, formData.department]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      setMessage('User not authenticated. Please log in again.');
      return;
    }

    // Validate form data
    if (!formData.department || !formData.date || !formData.startTime || !formData.endTime || !formData.reason) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const requestData = {
        requestedBy: user.id,
        department: formData.department,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        reason: formData.reason
      };

      const response = await createShiftRequestService(requestData);

      if (response.data) {
        setMessage('Shift request submitted successfully! Admin will review and respond to your request.');
        // Clear form
        setFormData({
          date: '',
          startTime: '',
          endTime: '',
          reason: '',
          department: user?.department?._id || ''
        });
      } else {
        setMessage(response.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setMessage('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen overflow-y-auto scrollbar-thin text-text-gray h-screen">
      <div className="sticky top-0 w-full z-10 shadow-md">
        <StaffHeader />
      </div>
      <div className='text-text-gray p-6'>
        <h2 className="text-2xl font-bold mb-4 text-primary">Request Overtime Shift</h2>
        <p className="text-gray-600 mb-6">
          Use this form to request specific overtime shifts for any department before admin uploads or publishes them. 
          This is like a "backdoor" request system for special circumstances.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Requested Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                {departmentsLoading ? (
                  <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
                    Loading departments...
                  </div>
                ) : (
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  You can request overtime for any department
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Request *
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Please explain why you need this specific overtime shift..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                <p>{message}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({
                  date: '',
                  startTime: '',
                  endTime: '',
                  reason: '',
                  department: user?.department?._id || ''
                })}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 font-medium"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-semibold text-yellow-800 mb-2">How this works:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• This request goes directly to admin for consideration</li>
            <li>• You can request overtime for any department, not just your own</li>
            <li>• Admin can review and decide whether to create/publish the requested shift</li>
            <li>• Different from booking existing shifts in the "Overtime" section</li>
            <li>• Useful for special circumstances or urgent staffing needs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestOvertime;