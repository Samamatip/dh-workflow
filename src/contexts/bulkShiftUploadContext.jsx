'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for bulk shift upload
const BulkShiftUploadContext = createContext(null);

export const BulkShiftUploadProvider = ({ children }) => {
  const [uploadedShifts, setUploadedShifts] = useState([]); // Array of parsed shift objects
  const [uploadErrors, setUploadErrors] = useState([]); // Array of error messages or rows with issues

  // Load data from sessionStorage on component mount
  useEffect(() => {
    const savedShifts = sessionStorage.getItem('bulkUploadShifts');
    const savedErrors = sessionStorage.getItem('bulkUploadErrors');
    
    if (savedShifts) {
      try {
        const parsedShifts = JSON.parse(savedShifts);
        setUploadedShifts(parsedShifts);
      } catch (error) {
        console.error('Error parsing saved shifts:', error);
      }
    }
    
    if (savedErrors) {
      try {
        setUploadErrors(JSON.parse(savedErrors));
      } catch (error) {
        console.error('Error parsing saved errors:', error);
      }
    }
  }, []);

  // Save uploaded shifts to sessionStorage whenever they change
  const updateUploadedShifts = (shifts) => {
    setUploadedShifts(shifts);
    if (shifts.length > 0) {
      sessionStorage.setItem('bulkUploadShifts', JSON.stringify(shifts));
    } else {
      sessionStorage.removeItem('bulkUploadShifts');
    }
  };

  // Save upload errors to sessionStorage whenever they change
  const updateUploadErrors = (errors) => {
    setUploadErrors(errors);
    if (errors.length > 0) {
      sessionStorage.setItem('bulkUploadErrors', JSON.stringify(errors));
    } else {
      sessionStorage.removeItem('bulkUploadErrors');
    }
  };

  // Clear all stored data
  const clearUploadData = () => {
    setUploadedShifts([]);
    setUploadErrors([]);
    sessionStorage.removeItem('bulkUploadShifts');
    sessionStorage.removeItem('bulkUploadErrors');
  };

  return (
    <BulkShiftUploadContext.Provider value={{
      uploadedShifts,
      setUploadedShifts: updateUploadedShifts,
      uploadErrors,
      setUploadErrors: updateUploadErrors,
      clearUploadData
    }}>
      {children}
    </BulkShiftUploadContext.Provider>
  );
};

// Custom hook to use the BulkShiftUploadContext
export const useBulkShiftUpload = () => useContext(BulkShiftUploadContext);