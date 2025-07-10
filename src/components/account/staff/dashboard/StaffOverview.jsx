import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getApprovedShiftsByUserAndYearMonthService,
  getPendingShiftsByUserService,
  getAvailablePublishedShiftsByUserDepartmentService,
  getAvailablePublishedShiftsByOtherDepartmentService 
} from '@/services/shiftsServices';

const StaffOverview = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = React.useState({
        approvedOvertimes: 0,
        pendingOvertimes: 0,
        availableInMyLocation: 0,
        availableInOtherLocations: 0
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
        const fetchDashboardData = async () => {
            if (!user?.id) return;
            
            setLoading(true);
            const currentYearMonth = getCurrentYearMonth();
            
            try {
                // Fetch all data in parallel
                const [
                    approvedResponse,
                    pendingResponse,
                    availableMyDeptResponse,
                    availableOtherDeptResponse
                ] = await Promise.all([
                    getApprovedShiftsByUserAndYearMonthService(user.id, currentYearMonth),
                    getPendingShiftsByUserService(user.id, currentYearMonth),
                    getAvailablePublishedShiftsByUserDepartmentService(user.id, currentYearMonth),
                    getAvailablePublishedShiftsByOtherDepartmentService(user.id, currentYearMonth)
                ]);

                setDashboardData({
                    approvedOvertimes: approvedResponse.data?.length || 0,
                    pendingOvertimes: pendingResponse.data?.length || 0,
                    availableInMyLocation: availableMyDeptResponse.data?.length || 0,
                    availableInOtherLocations: availableOtherDeptResponse.data?.length || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, currentDate, refreshTrigger]); // Add refreshTrigger as dependency

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

    const dashboardItems = [
        {
            text: 'Approved overtimes',
            value: loading ? '...' : dashboardData.approvedOvertimes.toString()
        },
        {
            text: 'Overtimes pending approval',
            value: loading ? '...' : dashboardData.pendingOvertimes.toString()
        },
        {
            text: 'Available overtime in my location',
            value: loading ? '...' : dashboardData.availableInMyLocation.toString()
        },
        {
            text: 'Overtimes in other locations',
            value: loading ? '...' : dashboardData.availableInOtherLocations.toString()
        },
    ];


  return (
    <div className='bg-secondary shadow-md p-5 rounded-md'>
        {/* Month Navigation Header */}
        <div className="flex justify-between items-center mb-4">
            <button 
                onClick={goToPreviousMonth}
                className="text-white hover:text-yellow-300 p-1 rounded transition-colors"
                disabled={loading}
                title="Previous month (Ctrl + ←)"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <div className="text-center">
                <h3 className="text-white font-semibold text-lg">Dashboard Overview</h3>
                <p className="text-black text-sm font-medium">{getDisplayMonth()}</p>
            </div>
            
            <button 
                onClick={goToNextMonth}
                className="text-white hover:text-yellow-300 p-1 rounded transition-colors"
                disabled={loading}
                title="Next month (Ctrl + →)"
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
                className="text-white hover:text-yellow-300 text-xs underline"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Refresh'}
            </button>
        </div>

        {/* Dashboard Items */}
        <div className="space-y-3">
            {dashboardItems?.map((item, idx) => (
                <div key={idx} className='flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200'>
                    <span className="text-text-gray font-medium">{item.text}</span>
                    <span className={`text-xl font-bold ${loading ? 'text-black animate-pulse' : 'text-black'}`}>
                        {item.value}
                    </span>
                </div>
            ))}
        </div>
        
        <div className="pt-3 mt-4 border-t border-white/20">
            <p 
                onClick={()=>window.location.href = `/staff/overtime`}
                className='text-white hover:text-yellow-300 cursor-pointer font-semibold transition-colors inline-flex items-center'
            >
                See details
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </p>
        </div>
    </div>
  )
}

export default StaffOverview;