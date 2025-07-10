import React from 'react';

const ErrorInterface = ({ error }) => {
  return <div className="text-error text-sm mt-2 text-center bg-red-50 py-2 rounded-md border-1 border-error ">{error}</div>;
};

export default ErrorInterface;
