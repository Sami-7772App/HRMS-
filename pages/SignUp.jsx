/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Signup = ({ onSwitchToLogin }) => {
  const { 
    sendOTP, 
    verifyOTP, 
    otpSent, 
    otpEmail, 
    resetOTP, 
    error: authError,
    register,
    completeRegistration 
  } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    position: '',
    department: '',
    otp: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');

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
    setLocalError('');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (!agreedToTerms) {
      setLocalError('Please agree to the Terms & Privacy');
      return;
    }

    setLocalLoading(true);
    setLocalError('');
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      position: formData.position,
      department: formData.department
    });
    
    setLocalLoading(false);
    
    if (result.success) {
      setCountdown(60);
    } else {
      setLocalError(result.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setLocalError('Please enter OTP');
      return;
    }

    setLocalLoading(true);
    setLocalError('');
    
    const result = await completeRegistration(formData.otp);
    
    setLocalLoading(false);
    
    if (!result.success) {
      setLocalError(result.error || 'OTP verification failed');
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLocalLoading(true);
    setLocalError('');
    
    const result = await sendOTP(otpEmail, 'signup');
    
    setLocalLoading(false);
    
    if (result.success) {
      setCountdown(60);
    } else {
      setLocalError(result.error || 'Failed to resend OTP');
    }
  };

  if (otpSent) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-amber-600 p-12">
          <div className="max-w-md text-white">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">SmartHR</h1>
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
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Verify Your Email
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We sent a 6-digit code to {otpEmail}
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  inputMode="numeric"
                />
              </div>

              {(authError || localError) && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{authError || localError}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={localLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  {localLoading ? 'Verifying...' : 'Verify & Create Account'}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-amber-600 p-12">
        <div className="max-w-md text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">SmartHR</h1>
            <p className="text-xl font-light mb-8">
              Empowering people through seamless HR management.
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg">
              Efficiently manage your workforce, streamline operations effortlessly.
            </p>
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200 bg-opacity-10 rounded-full"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white bg-opacity-10 rounded-full"></div>
          </div>
        </div>
      </div>
       
      <div className="flex-1 flex items-center justify-center bg-orange-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img src="/src/assets/logo.png" alt="SmartHR Logo" className="h-12 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h2>
            <p className="text-sm text-gray-600">
              Please enter your details to sign up
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSendOTP}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                Agree to Terms & Privacy
              </label>
            </div>

            {(authError || localError) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{authError || localError}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={localLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {localLoading ? 'Sending OTP...' : 'Sign Up'}
              </button>
            </div>
          </form>

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
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="font-medium text-amber-600 hover:text-amber-500"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Copyright © 2024 - SmartHR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;