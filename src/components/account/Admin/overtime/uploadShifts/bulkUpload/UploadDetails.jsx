import React, { useState } from 'react';
import { useBulkShiftUpload } from '@/contexts/bulkShiftUploadContext';
import AdminHeader from '../../../AdminHeader';
import Button from '@/components/commons/Button';
import ErrorInterface from '@/components/commons/ErrorInterface';
import { getDepartmentsService } from '@/services/departmentsServices';
import FinalReview from './FinalReview';
import ReviewUpload from './ReviewUpload';
import { useRouter } from 'next/navigation';

const UploadDetails = () => {
    const router = useRouter();
    const { setUploadedShifts, uploadedShifts } = useBulkShiftUpload();
    const [refinedShiftTypes, setRefinedShiftTypes] = React.useState([]);
    const [departments, setDepartments] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [shiftTimes, setShiftTimes] = React.useState({});
    const [finalReview, setFinalReview] = React.useState(false);
    const [showReviewUpload, setShowReviewUpload] = React.useState(false);
    const [formData, setFormData] = React.useState({
        department:'',
        shift:[],
        published: false,
    });

    React.useEffect(()=> {
        //collect all unique shift types
        if (Array.isArray(uploadedShifts)) {
            const uniqueShiftTypes = [
                ...new Set(uploadedShifts.map((shift) => shift.shift.toLowerCase()).filter(Boolean)),
            ];
            setRefinedShiftTypes(uniqueShiftTypes);
        }
    },[uploadedShifts])

    // This effect will update uploadedShifts by adding startTime/endTime fields flatly to each shift object
    React.useEffect(() => {
        if (Array.isArray(uploadedShifts) && refinedShiftTypes.length > 0 && Object.keys(shiftTimes).length > 0) {
            const updatedShifts = uploadedShifts.map(shift => {
                const type = shift.shift?.toLowerCase();
                if (type && shiftTimes[type]) {
                    // Format date to yyyy-mm-dd
                    const dateObj = new Date(shift.date);
                    const yyyy = dateObj.getFullYear();
                    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const dd = String(dateObj.getDate()).padStart(2, '0');
                    const formattedDate = `${yyyy}-${mm}-${dd}`;

                    return {
                        date: formattedDate,
                        quantity: shift.number_of_slots,
                        startTime: shiftTimes[type].startTime || '',
                        endTime: shiftTimes[type].endTime || ''
                    };
                }
                return shift;
            });
            setFormData({
                ...formData,
                shift: updatedShifts
            });
        }
        // Only run when shiftTimes or refinedShiftTypes change
    }, [shiftTimes, refinedShiftTypes]);

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

    const handleSetStartTime = (shift, time) => {
        setShiftTimes(prev => ({
            ...prev,
            [shift]: {
                ...(prev[shift] || {}),
                startTime: time
            }
        }));
    };

    const handleSetEndTime = (shift, time) => {
        setShiftTimes(prev => ({
            ...prev,
            [shift]: {
                ...(prev[shift] || {}),
                endTime: time
            }
        }));
    };

    const goToReview = (e) => {
        e.preventDefault()
        setError(null);
        
        // Check department is set
        if (!formData.department) {
            setError('Please select a department.');
            return;
        }
        
        // Check all shifts in formData.shift have valid start and end times in hh:mm
        if (!Array.isArray(formData.shift) || formData.shift.length === 0) {
            setError('No shifts to review. Please ensure your uploaded file has valid data and try again.');
            return;
        }
        
        
        setFinalReview(true);
    };

  return (
    <div className="max-h-screen overflow-y-auto scrollbar-thin h-screen w-full">
      {/* Header */}
      <div className="sticky top-0 w-full z-10 shadow-md">
        <AdminHeader />
      </div>

       {showReviewUpload ? (
        <div>
            <ReviewUpload 
                shifts={uploadedShifts} 
                back={() => setShowReviewUpload(false)}
                next={() => setShowReviewUpload(false)}
            />
        </div>
       ) : finalReview? (
        <div>
            <FinalReview 
                setUploadedShifts = {setUploadedShifts} 
                formData={formData}
                setFormData={setFormData}
                back={()=>setFinalReview(false)}
                departments = {departments}
            />
        </div>
       ):(
        // Check if there's no uploaded data
        !Array.isArray(uploadedShifts) || uploadedShifts.length === 0 ? (
          <div className='w-full flex justify-center items-center text-text-gray min-h-[60vh]'>
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">No Shifts Uploaded</h2>
              <p className="text-gray-600 mb-6">
                It looks like you haven't uploaded any shifts yet. Please start by uploading a shift file.
              </p>
              <button
                onClick={() => router.push('/overtime/upload-shifts/bulk-upload')}
                className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Go to Bulk Upload
              </button>
            </div>
          </div>
        ) : (
        <div className='w-full flex justify-center items-center text-text-gray relative'>
         <form className="w-full max-w-lg p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto scrollbar-thin">
               {/* Back button */}
               <div className="mb-4">
                 <button
                   type="button"
                   onClick={() => setShowReviewUpload(true)}
                   className="flex items-center gap-2 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                 >
                   <span>←</span>
                   <span>Back to Review Upload</span>
                 </button>
               </div>
               
               {/* Form fields for selecting department/location */}
               <div className="mb-4">
                 <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                   Select Department/Location this shifts are meant for
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
                
                
               {/* select start and end time for shift types */}
               {
                   refinedShiftTypes && refinedShiftTypes.length > 1 &&(
                       <div>
                           <p className='py-5 text-error text-center'>
                               We noticed you have uploaded {refinedShiftTypes.length} shift types. Please set the start and finish times for the shifts
                           </p>
                           <table className='w-full border-1 rounded-md my-5'>
                               <thead className=''>
                                   <tr>
                                       <th className='text-sm w-1/5 font-semibold'>Shift</th>
                                       <th className='text-sm w-1/3 font-semibold'>Start time</th>
                                       <th className='text-sm w-1/3 font-semibold'>End Time</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {refinedShiftTypes.map(shift => (
                                       <tr key={shift}>
                                           <td className='w-1/5 text-center'>{shift.toUpperCase()}</td>
                                    
                                           {/*  start time */}
                                           <td className='w-1/3'>
                                               <input
                                                 type="time"
                                                 id="startTime"
                                                 value={shiftTimes[shift]?.startTime || ''}
                                                 onChange={(e) => handleSetStartTime(shift, e.target.value)}
                                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 cursor-pointer"
                                               />
                                           </td>
                                           {/* end time */}
                                           <td className='w-1/3 mx-1'>
                                               <input
                                                 type="time"
                                                 id="startTime"
                                                 value={shiftTimes[shift]?.endTime || ''}
                                                 onChange={(e) => handleSetEndTime(shift, e.target.value)}
                                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 cursor-pointer"
                                               />
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                                
                           </table>
                       </div>
                   )
               }
    
               {/* Published checkbox */}
               <div className="mb-4">
                 <label className="inline-flex items-center">
                   <input
                     type="checkbox"
                     checked={formData.published || false}
                     onChange={(e) => setFormData({ 
                         ...formData,
                         published: e.target.checked
                     })}
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
                     checked={!formData.published}
                     onChange={(e) => setFormData({ 
                         ...formData,
                         published: !e.target.checked
                     })}
                     className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded
                     focus:ring-primary"
                   />
                   <span className="ml-2 text-sm text-gray-700">Save for Later</span>
                 </label>
               </div>
                    
               {error && <ErrorInterface error={error} />}
                    
               <Button
                 text={'Review Shift details'}
                 buttonStyle={'bg-primary text-white py-2 my-5 px-4 rounded-lg shadow-md hover:scale-105 transition duration-200 w-full cursor-pointer flex items-center justify-center'}
                 onClick={goToReview}
               />
         </form>
        </div>
        )
       )}
    </div>
  )
}

export default UploadDetails;