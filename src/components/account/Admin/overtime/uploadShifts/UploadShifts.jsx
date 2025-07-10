'use client';
import React from 'react';
import AdminHeader from '../../AdminHeader';
import { getDepartmentsService } from '@/services/departmentsServices';
import Button from '@/components/commons/Button';
import ErrorInterface from '@/components/commons/ErrorInterface';
import { uploadShiftsService } from '@/services/shiftsServices';
import SuccessModal from '@/utilities/SuccessModal';

const UploadShifts = () => {
  const [formData, setFormData] = React.useState({
    department: '',
    shift: {
      date: '',
      startTime: '',
      endTime: '',
      quantity: 1, // Default to 1 slot
      published: false, // Default to unpublished
    },
  });
  const [departments, setDepartments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  //fetch departments
  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartmentsService();
        if (response.error) {
          console.error('Error fetching departments:', response.error);
          return;
        }

        if (response.data) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  console.log('formData:', formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form data
    if (!formData.department || !formData.shift.date || !formData.shift.startTime || !formData.shift.endTime || formData.shift.quantity <= 0) {
      setError('Please fill in all fields correctly.');
      return;
    }
    if (formData.shift.startTime >= formData.shift.endTime) {
      setError('End time must be after start time.');
      return;
    }

    // check if the date is in the past
    if (new Date(formData.shift.date) < new Date()) {
      setError('Shift date cannot be in the past.');
      return;
    };

    try {
      
      setLoading(true);
      const response = await uploadShiftsService(formData);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setSuccess(true);
        setFormData({
          department: '',
          shift: {
            date: '',
            startTime: '',
            endTime: '',
            quantity: 1, // Reset to default
          },
        });
      }
    } catch (error) {
      console.error('Error uploading shifts:', error);
      setError('Internal server error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen overflow-y-auto scrollbar-thin h-screen text-text-gray">
      {/* Header */}
      <div className="sticky top-0 w-full z-10 shadow-md">
        <AdminHeader />
      </div>

      <div className="flex flex-col lg:flex-row lg:px-10 w-full gap-5">
        <div className="">
          <button 
            onClick={() => window.location.href = '/overtime/upload-shifts/bulk-upload'}
            className="bg-secondary my-5 text-white py-2 px-4 rounded-lg shadow-md hover:scale-105 transition duration-200 mb-2 lg:mb-0 cursor-pointer">
            Upload shifts in bulk
          </button>
        </div>

        {/* Shift creation form */}
        <div className="flex flex-col items-center justify-center p-5 w-full lg:w-2/3 bg-gray-100 rounded-lg shadow-md">
          <p className="text-gray-600 mb-6">Upload overtime shifts for departments or locations</p>
          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto scrollbar-thin">
            {/* Form fields for selecting department/location */}
            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Select Department/Location
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value,
                  })
                }
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option value="" disabled>
                  Select a department
                </option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id} className="">
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Date picker for selecting shift date */}
            <div>
              <label htmlFor="shiftDate" className="block text-sm font-medium text-gray-700">
                Shift date:
              </label>
              <input
                id="shiftDate"
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary cursor-pointer"
                value={formData.shift.date || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shift: {
                      ...formData.shift,
                      date: e.target.value || '',
                    },
                  })
                }
              />
            </div>
            {/* start time */}
            <div className="mb-4 mt-4">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Shift Start Time
              </label>
              <input
                type="time"
                id="startTime"
                value={formData.shift.startTime || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shift: {
                      ...formData.shift,
                      startTime: e.target.value || '',
                    },
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 cursor-pointer"
              />
            </div>
            {/* end time */}
            <div className="mb-4">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                Shift End Time
              </label>
              <input 
                type="time" 
                id="endTime" 
                value={formData.shift.endTime || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shift: {
                      ...formData.shift,
                      endTime: e.target.value || '',
                    },
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 cursor-pointer" 
              />
            </div>
            {/* Number of slots */}
            <div className="mb-4">
              <label htmlFor="slots" className="block text-sm font-medium text-gray-700">
                Number of Slots
              </label>
              <input 
                type="number" 
                id="slots" 
                value={formData.shift.quantity ?? 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shift: {
                      ...formData.shift,
                      quantity: Number.isNaN(parseInt(e.target.value, 10)) ? 1 : parseInt(e.target.value, 10),
                    },
                  }
                )}
                min="1" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2" 
              />
            </div>

            {/* Published checkbox */}
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.shift.published}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shift: {
                        ...formData.shift,
                        published: e.target.checked,
                      },
                    })
                  }
                  className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded
                  focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Publish Shift Now</span>
              </label>
            </div>

            {/* save for  later checkbox */}
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={!formData.shift.published}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shift: {
                        ...formData.shift,
                        published: !e.target.checked, // Invert the value
                      },
                    })
                  }
                  className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded
                  focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Save for Later</span>
              </label>
            </div>

            {/* Error message */}
            {error && <ErrorInterface error={error} />}
            <Button
              type={'submit'}
              text={'Upload Shift'}
              buttonStyle={'bg-primary text-white py-2 my-5 px-4 rounded-lg shadow-md hover:scale-105 transition duration-200 w-full cursor-pointer flex items-center justify-center'}
              loading={loading}
              loadingText={'Uploading...'}
            />
          </form>
        </div>
      </div>

      {/* Success message */}
      {success && (
        <div className='inset-0 bg-black/80 w-full h-full rounded-lg flex items-center justify-center z-5 absolute'>
          <SuccessModal
            title={'Upload Shift'}
            message={'Shift uploaded successfully!'}
            subText={'Your shift has been uploaded successfully. You can now view it in the uploaded shifts list.'}
            onClose={() => setSuccess(false)}
            buttonText={'OK'}
            buttonStyle={`bg-brand-blue text-text-white p-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-200 ease-in-out hover:bg-blue-shadow4 bg-primary text-white cursor-pointer shadow-md hover:scale-105`}
          />
        </div>
      )}
    </div>
  );
};

export default UploadShifts;
