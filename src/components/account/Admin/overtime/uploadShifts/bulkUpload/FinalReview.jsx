import Button from '@/components/commons/Button';
import ErrorInterface from '@/components/commons/ErrorInterface';
import { uploadShiftsService } from '@/services/shiftsServices';
import SuccessModal from '@/utilities/SuccessModal';
import React, { useState } from 'react';

const FinalReview = ({ formData, setUploadedShifts, setFormData, back, departments }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [department, setDepartment] = useState('');
  const [success, setSuccess] = React.useState(false);
  const [removedShifts, setRemovedShifts] = React.useState([]);
  const [validShifts, setValidShifts] = React.useState([]);

  React.useEffect(() => {
    if (Array.isArray(formData.shift)) {
      const valids = formData.shift.filter(s => Number(s.quantity) > 0);
      const removed = formData.shift.filter(s => Number(s.quantity) <= 0);
      setValidShifts(valids);
      setRemovedShifts(removed);
    }
  }, [formData]);

  React.useEffect(() => {
    const dept = departments.find(d => d._id === formData.department);
    setDepartment(dept ? dept.name : '');
  }, [formData, departments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const body = {
      department: formData.department,
      published: formData.published,
      shift: validShifts,
    };

    if (
      !body.department ||
      !Array.isArray(body.shift) ||
      body.shift.length === 0 ||
      body.shift.some(
        s =>
          !s.date ||
          !s.startTime ||
          !s.endTime ||
          !s.quantity ||
          Number(s.quantity) <= 0
      )
    ) {
      setError('Please fill in all fields correctly for all shifts.');
      return;
    }
    const now = new Date();
    if (
      validShifts.some(s => new Date(s.date) < now.setHours(0, 0, 0, 0))
    ) {
      setError('One or more shift dates are in the past, please check and correct them.');
      return;
    }
    try {
      setLoading(true);
      const response = await uploadShiftsService(body);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error uploading shifts:', error);
      setError('Internal server error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setUploadedShifts([]);
    setFormData({
      department: '',
      shift: [],
      published: false,
    });
    setSuccess(false);
  };

  const renderDate = (date) => {
    if (!date) return '-';
    if (typeof date === 'object' && date !== null && date.toLocaleDateString) {
      return date.toLocaleDateString('en-GB');
    }
    const d = new Date(date);
    return isNaN(d) ? String(date) : d.toLocaleDateString('en-GB');
  };
  const renderTime = (time) => {
    if (!time) return '-';
    if (typeof time === 'object' && time !== null && time.toLocaleTimeString) {
      return time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    const t = new Date(`1970-01-01T${time}`);
    return isNaN(t) ? String(time) : t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className='flex flex-col gap-5 justify-center items-center text-text-gray h-full w-full'>
      <h2>
        <span
          onClick={back}
          className='py-3 bg-primary rounded-md px-5 cursor-pointer hover:scale-110 text-white absolute top-16 left-5'
        >
          Back
        </span>
      </h2>
      <div className='flex flex-col gap-5 justify-center items-center h-full w-full'>
        <h2>Review your upload before submitting</h2>
        <div className='h-full'>
          <h2>Department: <strong>{department}</strong></h2>
          <h2>Publish Now?: <strong>{formData.published ? 'YES' : 'NO'}</strong></h2>
          {removedShifts.length > 0 && (
            <div className="my-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
              <p>
                <strong>Note:</strong> The following shifts were removed because their number of slots was zero or negative. Please review and correct them if needed.
              </p>
              <div className='max-h-[20vh] overflow-y-auto scrollbar-thin relative'>
                <table className="mt-2 w-full text-sm">
                  <thead className='sticky top-0'>
                    <tr className="bg-yellow-200">
                      <th className="px-2 py-1 border">S/No</th>
                      <th className="px-2 py-1 border">Date</th>
                      <th className="px-2 py-1 border">Start Time</th>
                      <th className="px-2 py-1 border">End Time</th>
                      <th className="px-2 py-1 border">Number of slots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {removedShifts.map((shift, idx) => (
                      <tr key={idx}>
                        <td className="text-center px-2 py-1 border">{idx + 1}</td>
                        <td className="text-center px-2 py-1 border">{renderDate(shift.date)}</td>
                        <td className="text-center px-2 py-1 border">{renderTime(shift.startTime)}</td>
                        <td className="text-center px-2 py-1 border">{renderTime(shift.endTime)}</td>
                        <td className="text-center px-2 py-1 border">{shift.quantity || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <span className='font-semibold text-center mt-5'>Shifts to upload</span>
          <div className='max-h-[70vh] overflow-y-auto scrollbar-thin relative'>
            <table className='w-full mt-2 text-sm'>
              <thead className='sticky top-0'>
                <tr className='bg-success text-white'>
                  <th className="px-2 py-1 border">S/No</th>
                  <th className="px-2 py-1 border">Date</th>
                  <th className="px-2 py-1 border">Start Time</th>
                  <th className="px-2 py-1 border">End Time</th>
                  <th className="px-2 py-1 border">Number of slots</th>
                </tr>
              </thead>
              <tbody className=''>
                {Array.isArray(validShifts) && validShifts.length > 0 ? (
                  validShifts?.map((shift, idx) => (
                    <tr key={idx} className={`${idx % 2 === 0 ? 'bg-green-100' : 'bg-green-300'}`}>
                      <td className="text-center px-2 py-1 border border-white">{idx + 1}</td>
                      <td className="text-center px-2 py-1 border border-white">{renderDate(shift.date)}</td>
                      <td className="text-center px-2 py-1 border border-white">{renderTime(shift.startTime)}</td>
                      <td className="text-center px-2 py-1 border border-white">{renderTime(shift.endTime)}</td>
                      <td className="text-center px-2 py-1 border border-white">{shift.quantity || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-2 border text-center" colSpan={5}>
                      No shifts to review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {error && <ErrorInterface error={error} />}
        <div className='flex flex-row justify-center items-center gap-10'>
            <Button 
              type={'Submit'}
              text={'Re-try upload'}
              onClick={reset}
              buttonStyle={`bg-amber-600 mb-10 cursor-pointer hover:scale-105 px-5`}
            />
            <Button
              type={'submit'}
              loading={loading}
              loadingText={`...submitting`}
              text={'Submit'}
              onClick={handleSubmit}
              buttonStyle={`bg-primary mb-10 cursor-pointer hover:scale-105 px-5`}
            />
        </div>
        
      </div>
      {success && (
        <div className='inset-0 bg-black/90 w-full h-full rounded-lg flex items-center justify-center z-5 absolute'>
          <SuccessModal
            title={'Upload Shift'}
            message={'Shift uploaded successfully!'}
            subText={'Your shifts has been uploaded successfully. You can now view it in the uploaded shifts list.'}
            onClose={reset}
            buttonText={'OK'}
            buttonStyle={`bg-brand-blue text-text-white p-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-200 ease-in-out hover:bg-blue-shadow4 bg-primary text-white cursor-pointer shadow-md hover:scale-105`}
          />
        </div>
      )}
    </div>
  );
};

export default FinalReview;