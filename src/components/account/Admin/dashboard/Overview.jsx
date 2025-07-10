import React from 'react';
import { getAdminDashboardStatsService } from '@/services/shiftsServices';

const Overview = () => {
  const [dashboardStats, setDashboardStats] = React.useState({
    totalSlotsUploaded: 0,
    availableSlots: 0,
    totalRequests: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = React.useState(true);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Get current year-month from the state
  const getCurrentYearMonth = () => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  // Format month for display
  const getDisplayMonth = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Refresh current month data
  const refreshData = () => {
    // Force refresh by incrementing trigger
    setRefreshTrigger(prev => prev + 1);
  };

  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      const currentYearMonth = getCurrentYearMonth();
      
      try {
        const response = await getAdminDashboardStatsService(currentYearMonth);
        if (response.data) {
          setDashboardStats(response.data);
        } else if (response.error) {
          console.error('Error fetching admin dashboard stats:', response.error);
        }
      } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [currentDate, refreshTrigger]); // Add refreshTrigger as dependency

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (loading) return;
      
      if (event.key === 'ArrowLeft' && event.ctrlKey) {
        event.preventDefault();
        goToPreviousMonth();
      } else if (event.key === 'ArrowRight' && event.ctrlKey) {
        event.preventDefault();
        goToNextMonth();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [loading]);
  return (
    <div className="p-5 shadow-lg rounded-lg h-auto bg-gray-50 hover:scale-102 transition-all duration-300 ease-in-out">
      {/* Month Navigation Header */}
      <div className="flex justify-between items-center mb-3">
        <button 
          onClick={goToPreviousMonth}
          className="text-gray-600 hover:text-secondary p-1 rounded transition-colors"
          disabled={loading}
          title="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="font-semibold text-text-gray">Admin Overview</h2>
          <p className="text-secondary text-sm font-medium">{getDisplayMonth()}</p>
        </div>
        
        <button 
          onClick={goToNextMonth}
          className="text-gray-600 hover:text-secondary p-1 rounded transition-colors"
          disabled={loading}
          title="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-2">
        <button 
          onClick={refreshData}
          className="text-secondary hover:text-secondary-dark text-xs underline"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Dashboard Statistics */}
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-secondary transition-colors">
            <span className="text-text-gray font-medium">Overtime slots uploaded</span>
            <span className={`text-lg font-bold ${loading ? 'text-yellow-500 animate-pulse' : 'text-secondary'}`}>
              {loading ? '...' : dashboardStats.totalSlotsUploaded}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-secondary transition-colors">
            <span className="text-text-gray font-medium">Available overtime slots</span>
            <span className={`text-lg font-bold ${loading ? 'text-yellow-500 animate-pulse' : 'text-green-600'}`}>
              {loading ? '...' : dashboardStats.availableSlots}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-secondary transition-colors">
            <span className="text-text-gray font-medium">Total requests made</span>
            <span className={`text-lg font-bold ${loading ? 'text-yellow-500 animate-pulse' : 'text-blue-600'}`}>
              {loading ? '...' : dashboardStats.totalRequests}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-secondary transition-colors">
            <span className="text-text-gray font-medium">Pending approvals</span>
            <span className={`text-lg font-bold ${loading ? 'text-yellow-500 animate-pulse' : 'text-orange-600'}`}>
              {loading ? '...' : dashboardStats.pendingApprovals}
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <span 
            onClick={() => (window.location.href = '/overtime')} 
            className="text-sm cursor-pointer text-secondary hover:text-secondary-dark font-semibold transition-colors inline-flex items-center"
          >
            View details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Overview;
