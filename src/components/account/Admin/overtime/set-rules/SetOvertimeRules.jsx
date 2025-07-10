import React from 'react';
import AdminHeader from '../../AdminHeader';

const SetOvertimeRules = () => {
  return (
    <div className="max-h-screen overflow-y-auto scrollbar-thin h-screen text-text-gray">
      {/* Header */}
      <div className="sticky top-0 w-full z-10 shadow-md">
        <AdminHeader />
      </div>
      <h1 className="font-semibold p-5 text-text-gray">In this page, admin would be able to set rules for picking up overtime. </h1>
      <p>For example, admin can set rules like:</p>
      <ul className="list-disc pl-5  text-text-gray">
        <li>Only employees in a specific group can pick up overtime for the first 3days</li>
        <li>After 3 days, any employee in a department can pick up overtime</li>
        <li>Employees can pick specified number of overtime for the first specified days</li>
        <li>After the specified days, any employee can pick up overtime</li>
      </ul>

      <p className="mt-5  text-text-gray">This page is currently under development. Please check back later.</p>
    </div>
  );
};

export default SetOvertimeRules;
