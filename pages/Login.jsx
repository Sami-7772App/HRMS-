import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ onSwitchToSignup, error }) => {
  const { login, sendOTP, verifyOTP, otpSent, otpEmail, resetOTP } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      alert('Please enter your email');
      return;
    }

    setLocalLoading(true);
    const result = await sendOTP(formData.email, 'login');
    setLocalLoading(false);
    
    if (result.success) {
      setCountdown(60);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      alert('Please enter OTP');
      return;
    }

    setLocalLoading(true);
    await verifyOTP(otpEmail, formData.otp, 'login');
    setLocalLoading(false);
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Please fill all fields');
      return;
    }

    setLocalLoading(true);
    await login(formData.email, formData.password);
    setLocalLoading(false);
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLocalLoading(true);
    await sendOTP(otpEmail, 'login');
    setLocalLoading(false);
    setCountdown(60);
  };

  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Enter OTP
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We sent a 6-digit code to {otpEmail}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOTPLogin}>
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength={6}
                pattern="[0-9]{6}"
                inputMode="numeric"
              />
            </div>

            {(error || error) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error || error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={localLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {localLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={resetOTP}
                className="text-amber-600 hover:text-amber-500 text-sm"
              >
                Use different email
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || localLoading}
                className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-amber-600 hover:text-amber-500'}`}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-amber-600 p-12">
        <div className="max-w-md text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Sight In</h1>
            <p className="text-xl font-light mb-8">
              Empowering people through seamless HR management.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg">
              Efficiently manage your workforce, streamline operations effortlessly.
            </p>
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white bg-opacity-10 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-orange-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
             <img src="src/assets/logo.png" className="h-12 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-sm text-gray-600">
              Please enter your details to sign in
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setUseOTP(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !useOTP 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Password Login
            </button>
            <button
              onClick={() => setUseOTP(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                useOTP 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              OTP Login
            </button>
          </div>

          {useOTP ? (
            <form className="space-y-6" onSubmit={handleSendOTP}>
              <div>
                <label htmlFor="email-otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email-otp"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {(error || error) && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error || error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={localLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  {localLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleTraditionalLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember Me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-amber-600 hover:text-amber-500">
                    Forgot Password?
                  </a>
                </div>
              </div>

              {(error || error) && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error || error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={localLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  {localLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="font-medium text-amber-600 hover:text-amber-500"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Copyright © 2024 - Smart HR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;