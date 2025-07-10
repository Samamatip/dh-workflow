'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageLoading from '../commons/PageLoading';
import AdminDashboard from './Admin/dashboard/AdminDashboard';
import StaffDashboard from './staff/dashboard/StaffDashboard';

const Dashboard = () => {
  const { user, isAuthenticated, loading, logOut } = useAuth();

  if (loading) return <PageLoading />;

  return <div>{
    isAuthenticated && (
      user?.role === 'admin' ? 
        <AdminDashboard user={user} logOut={logOut} /> : 
        <StaffDashboard user={user} logOut={logOut} />
    )
  }</div>;
};

export default Dashboard;
