import React from 'react';
import * as XLSX from 'xlsx';
import { useBulkShiftUpload } from '@/contexts/bulkShiftUploadContext';
import ReviewUpload from './ReviewUpload';

const BulkShiftUploadInterface = () => {
  const [file, setFile] = React.useState(null);
  const [error, setError] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [reviewUpload, setReviewUpload] = React.useState(false);

  const { setUploadedShifts, uploadedShifts } = useBulkShiftUpload();

  const validateFile = (file) => {
    if (!file) return false;

    const validFormats = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];

    if (!validFormats.includes(file.type)) {
      setError('Invalid file format. Please upload an Excel file.');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return false;
    }

    const validFileName = 'dh_shift_Upload_template.xlsx';
    if(!file.name.includes(validFileName)){
        setError('please upload the approved template');
    }

    return true;
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (validateFile(uploadedFile)) {
      setFile(uploadedFile);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleBack = () => {
    setReviewUpload(false);
    setFile(null);
  }

  const handleUpload = (e) => {
      e.preventDefault();
      try {
        setError('');
        setUploading(true); 
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName]; 
          // Convert the sheet data to JSON with the first row as headers
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 0, defval: '' });  
          // Now we will reshape the data and map it accordingly to remove empty spaces
          if(jsonData.length < 1){
              setError('No data found in the uploaded file, please check the file and try again.');
          }
          //check sampleData to be sure all headings are present
          const dataSample = jsonData[0];
          const requiredHeadings = [ 'date', 'day', 'shift', 'number_of_slots' ]
          const hasRequiredHeadings = requiredHeadings.every((heading) =>
            Object.keys(dataSample).includes(heading)
          );

          const validFileName = 'dh_shift_Upload_template.xlsx';

          if (!hasRequiredHeadings) {
            setError(`Please upload the correct Excel file we have provided: "${validFileName}"`);
            return;
          };
          const transformedData = [];   
          // Loop through each row of data
          jsonData.forEach((row) => {
            const date = row['date'];  // Extract the date value from the 'date' column
            const day = row['day'];    // Extract the day value from the 'day' column
            const shift = row['shift'];  // Extract the shift value from the 'shift' column
            const number_of_slots = row['number_of_slots'];  // Extract the number of slots value   
            // Function to convert Excel date serial number to JavaScript Date
            const excelDateToJSDate = (serial) => {
              if (serial <= 0) return null;  // Return null for invalid or empty serials
              const epoch = new Date(1900, 0, 1);  // Excel's epoch is 1900-01-01
              const millis = (serial -2) * 86400000;  // Excel date serial to milliseconds
              return new Date(epoch.getTime() + millis);
            };  
            // Create an object for each row entry
            transformedData.push({
              date: excelDateToJSDate(date),
              day,
              shift,
              number_of_slots: number_of_slots
            });
          });   
          console.log('Data:', transformedData) 
          // Set the transformed data for further use
          setUploadedShifts(transformedData);
          setUploading(false);
          setReviewUpload(true);
        };  
        reader.readAsArrayBuffer(file);
      } catch (error) {
        setError('An error occurred while uploading the file. Please try again.');
        setUploading(false);
      } finally {
        setUploading(false); // Always reset the uploading state
      }
  };

  return (<>
    {reviewUpload? (
      <div className='w-full'>
        <ReviewUpload shifts={uploadedShifts} back={handleBack}/>
      </div>
    ):
      <div className='flex justify-center items-center w-full text-text-gray'>
      <div>
        <h1 className="text-xl text-text-gray font-semibold mb-4 text-center">Bulk shift upload</h1>
        <span>Please ensure your upload is for one location</span>
        <p className='text-amber-700'>Please choose the correct template by clicking the space below. Or dragging the template into the space</p>
        <div className='flex gap-5 justify-center items-center py-5'>
          <input
            type="file"
            className="border-2 p-2 cursor-pointer rounded-md"
            onChange={handleFileChange}
            onDrop={handleDrop}
            accept=".xls,.xlsx"
            placeholder='Drop your file here. or Click to select file'
          />
         
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
         {error && <p className="text-error text-center">{error}</p>}
      </div>
    </div>
  }
  </>);
};

export default BulkShiftUploadInterface;
