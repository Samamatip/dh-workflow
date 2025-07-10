import getToken from '../utilities/getToken';

// Create a new shift request (backdoor request)
export const createShiftRequestService = async (requestData) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shift-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      return {
        error: errorData.message || 'Failed to create shift request',
      };
    }
  } catch (error) {
    console.error('Error creating shift request:', error);
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};

// Get all shift requests (for admin)
export const getAllShiftRequestsService = async (status = null, yearMonth = null) => {
  const token = getToken();
  console.log('Token available:', !!token); // Debug log
  
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/shift-requests`;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (yearMonth) params.append('date', yearMonth);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log('Making request to:', url); // Debug log
    console.log('With headers:', {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'No token'
    }); // Debug log (safe token preview)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    console.log('Response status:', response.status); // Debug log
    console.log('Response ok:', response.ok); // Debug log

    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data); // Debug log
      return {
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      console.error('API Error Response:', errorData); // Debug log
      return {
        error: errorData.message || 'Failed to fetch shift requests',
      };
    }
  } catch (error) {
    console.error('Network Error:', error); // Debug log
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};

// Get shift requests by user
export const getShiftRequestsByUserService = async (userId, status = null) => {
  const token = getToken();
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/shift-requests/user/${userId}`;
    if (status) {
      url += `?status=${status}`;
    }

    const response = await fetch(url, {
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
      return {
        error: errorData.message || 'Failed to fetch user shift requests',
      };
    }
  } catch (error) {
    console.error('Error fetching user shift requests:', error);
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};

// Review (approve/reject) a shift request
export const reviewShiftRequestService = async (requestId, status, adminNotes = '', reviewedBy) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shift-requests/${requestId}/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        adminNotes,
        reviewedBy,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      return {
        error: errorData.message || 'Failed to review shift request',
      };
    }
  } catch (error) {
    console.error('Error reviewing shift request:', error);
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};

// Delete a shift request
export const deleteShiftRequestService = async (requestId) => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shift-requests/${requestId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return {
        data: { success: true },
      };
    } else {
      const errorData = await response.json();
      return {
        error: errorData.message || 'Failed to delete shift request',
      };
    }
  } catch (error) {
    console.error('Error deleting shift request:', error);
    return {
      error: 'Internal server error, please try again or contact support',
    };
  }
};
