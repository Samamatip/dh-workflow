import React from 'react';
import StaffOverview from './StaffOverview';
import StaffHeader from '../StaffHeader';

const StaffDashboard = ({ user, logOut }) => {
  return (
    <div className="bg-background h-screen overflow-auto">
      <StaffHeader user={user} logOut={logOut} />
      <div className="p-5 flex justify-center items-start min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <StaffOverview />
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
