import getToken from '../utilities/getToken';

export const loginService = async (form) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      const responseData = await response.json();
      return {
        data: responseData.data,
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

// Function to get user data
export const getUserService = async () => {
  const token = getToken();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const userData = await response.json();
      return {
        data: userData.data,
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
