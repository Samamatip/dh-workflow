'use client';
import React from 'react';
import Button from './commons/Button';
import ErrorInterface from './commons/ErrorInterface';
import { verifyEmail } from '@/utilities/verifyInput';
import { loginService } from '@/services/authServices';

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password');
      return;
    }

    const passedEmailValidation = verifyEmail(formData.email, setError);
    if (!passedEmailValidation) {
      return;
    }

    try {
      setError(null);
      setLoading(true);

      //api call to login
      const response = await loginService(formData);

      if (response.error) {
        setError(response.error || 'An error occurred during login, please try again');
        return;
      }

      // If login is successful
      if (response.data) {
        // Store token in local storage
        localStorage.setItem('token', response.data.token);
        // set user data in local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Redirect to dashboard or home page
        window.location.href = '/';
      } else {
        setError('Login failed, please try again');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: "url('https://www.discoverhannahs.org/assets/images/full-logo-white.png?v=1751565577')",
        backgroundSize: '',
        backgroundPosition: 'center',
        minHeight: '',
        width: ''
      }}
    >
      <div className="bg-white/70 shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Login</h1>
        <div className="space-y-4">
          <p className="text-base text-text-gray">Please enter your credentials to login.</p>
          {/*login form here */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg overflow-hidden"
            
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-black">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
              <div className="text-sm w-full flex justify-between items-center mt-1 px-1">
                <a href="#" className="font-medium text-primary hover:text-primary-hover">
                  Forgot your password?
                </a>
                <span
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-primary hover:text-primary-hover cursor-pointer mt-1"
                  style={{
                    textAlign: 'right',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rememberMe: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-black">
                  keep me logged in on this device
                </label>
              </div>
            </div>

            {error && <ErrorInterface error={error} />}
            <div>
              <Button
                text={'Login'}
                type={'submit'}
                loading={loading}
                loadingText={'Logging in...'}
                buttonStyle={
                  'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer'
                }
              />
            </div>
          </form>

          <p className="text-sm text-text-gray mt-4">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-primary hover:text-primary-hover">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
