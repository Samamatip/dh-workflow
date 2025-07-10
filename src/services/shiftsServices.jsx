// Book a shift (staff)
export const bookShiftService = async (shiftId, userId) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/book/${shiftId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    if (response.ok) {
      const data = await response.json();
      return { data: data.data };
    } else {
      const errorData = await response.json();
      return { error: errorData.message };
    }
  } catch (error) {
    return { error: 'Internal server error, please try again or contact support' };
  }
};

// Approve a shift (admin)
export const approveShiftService = async (shiftId) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/approve/${shiftId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return { data: data.data };
    } else {
      const errorData = await response.json();
      return { error: errorData.message };
    }
  } catch (error) {
    return { error: 'Internal server error, please try again or contact support' };
  }
};

// Reject a shift (admin)
export const rejectShiftService = async (shiftId, reason) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/reject/${shiftId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (response.ok) {
      const data = await response.json();
      return { data: data.data };
    } else {
      const errorData = await response.json();
      return { error: errorData.message };
    }
  } catch (error) {
    return { error: 'Internal server error, please try again or contact support' };
  }
};
import getToken from '@/utilities/getToken';

// Function to get shifts data by department and year-month
export const getPublishedShiftsByDepartmentAndYearMonthService = async (departmentId, yearMonth) => {
  const token = getToken();
  try {
    console.log('Fetching shifts for department:', departmentId, 'and year-month:', yearMonth);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/${departmentId}?date=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      console.log('Error:', errorMessage);
      return {
        error: errorMessage,
      };
    }
  } catch (error) {
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};

// function to get shifts data by department and year-month for unpublished shifts
export const getUnpublishedShiftsByDepartmentAndYearMonthService = async (departmentId, yearMonth) => {
  const token = getToken();
  try {
    console.log('Fetching shifts for department:', departmentId, 'and year-month:', yearMonth);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/unpublished/${departmentId}?date=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      console.log('Error:', errorMessage);
      return {
        error: errorMessage,
      };
    }
  } catch (error) {
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};


// Function to upload shifts data
export const uploadShiftsService = async (formData) => {
  const token = getToken();
  try {
    console.log('Uploading shifts data:', formData);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      console.log('Error:', errorMessage);
      return {
        error: errorMessage,
      };
    }
  } catch (error) {
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};

//function to get approved shifts by user and date
// function to get shifts data by department and year-month for unpublished shifts
export const getApprovedShiftsByUserAndYearMonthService = async (userId, yearMonth) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/approved/${userId}?date=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      return {
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return {
        error: errorMessage,
      };
    }
  } catch (error) {
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};


//function to get available shifts by user and date
// function to get shifts data by department and year-month for available shifts in user's department
export const getAvailablePublishedShiftsByUserDepartmentService = async (userId, yearMonth) => {
  const token = getToken();
  console.log('user ID:', userId);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/available-my-department/${userId}?date=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      return {
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return {
        error: errorMessage,
      };
    }
  } catch (error) {
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};


//function to get available shifts by user and date
// function to get shifts data by department and year-month for available shifts in other department
export const getAvailablePublishedShiftsByOtherDepartmentService = async (userId, yearMonth) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/available/other-department/${userId}?date=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      return {
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      return {
        error: errorMessage,
      };
    }
  } catch (error) {
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};

// Publish/unpublish a shift (admin)
export const publishShiftService = async (shiftId, published) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/publish/${shiftId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ published }),
    });
    if (response.ok) {
      const data = await response.json();
      return { data: data.data };
    } else {
      const errorData = await response.json();
      return { error: errorData.message };
    }
  } catch (error) {
    return { error: 'Internal server error, please try again or contact support' };
  }
};

// Get pending shifts (admin)
export const getPendingShiftsService = async (yearMonth) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/pending?date=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return { data: data.data };
    } else {
      const errorData = await response.json();
      return { error: errorData.message };
    }
  } catch (error) {
    console.error('Error in getPendingShiftsService:', error);
    return { error: 'Internal server error, please try again or contact support' };
  }
};

// Get pending shifts by user (staff)
export const getPendingShiftsByUserService = async (userId, yearMonth) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/pending-by-user/${userId}?date=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return { data: data.data };
    } else {
      const errorData = await response.json();
      return { error: errorData.message };
    }
  } catch (error) {
    return { error: 'Internal server error, please try again or contact support' };
  }
};

// Get pending shifts and rejection history by user (staff)
export const getPendingShiftsAndRejectionHistoryByUserService = async (userId, yearMonth) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/pending-and-rejected/${userId}?date=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return { data: data.data };
    } else {
      const errorData = await response.json();
      return { error: errorData.message };
    }
  } catch (error) {
    return { error: 'Internal server error, please try again or contact support' };
  }
};

// Get admin dashboard statistics
export const getAdminDashboardStatsService = async (yearMonth) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shifts/admin-dashboard-stats?date=${yearMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return { data: data.data };
    } else {
      const errorData = await response.json();
      return { error: errorData.message };
    }
  } catch (error) {
    return { error: 'Internal server error, please try again or contact support' };
  }
};
