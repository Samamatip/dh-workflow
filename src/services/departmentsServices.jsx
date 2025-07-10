import getToken from '../utilities/getToken';

// Function to get departments data
export const getDepartmentsService = async () => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments`, {
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
