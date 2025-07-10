'use client';
import React, { createContext, useState, useContext } from 'react';

// Create a context for bulk shift upload
const BulkShiftUploadContext = createContext(null);

export const BulkShiftUploadProvider = ({ children }) => {
  const [uploadedShifts, setUploadedShifts] = useState([]); // Array of parsed shift objects
  const [uploadErrors, setUploadErrors] = useState([]); // Array of error messages or rows with issues

  return (
    <BulkShiftUploadContext.Provider value={{
      uploadedShifts,
      setUploadedShifts,
      uploadErrors,
      setUploadErrors
    }}>
      {children}
    </BulkShiftUploadContext.Provider>
  );
};

// Custom hook to use the BulkShiftUploadContext
export const useBulkShiftUpload = () => useContext(BulkShiftUploadContext);