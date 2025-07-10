import React from 'react';
import Overview from './Overview';
import AdminHeader from '../AdminHeader';

const AdminDashboard = ({ user, logOut }) => {
  return (
    <div className="bg-background h-screen overflow-auto">
      <AdminHeader user={user} logOut={logOut} />
      <div className="p-5 flex justify-center items-start min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-lg">
          <Overview />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
