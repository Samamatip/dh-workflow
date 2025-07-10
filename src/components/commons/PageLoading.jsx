import React from 'react';

const PageLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <span className="ml-3 text-lg">Loading...</span>
    </div>
  );
};

export default PageLoading;
