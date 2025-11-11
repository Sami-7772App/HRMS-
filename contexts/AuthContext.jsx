/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [pendingUser, setPendingUser] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
    
    setLoading(false);
  }, []);

  const generateToken = (userData) => {
    if (userData.email === 'admin@hrms.com' || userData.email === 'employee@hrms.com') {
      return userData.id === '1' ? 'demo-jwt-token' : `demo-token-${userData.id}`;
    }
    
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      id: userData.id,
      email: userData.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }));
    const signature = btoa('hrms-mock-signature');
    return `${header}.${payload}.${signature}`;
  };

  const isValidToken = (token) => {
    if (!token || token.length < 10) return false;
    
    if (token.startsWith('demo-token-') || token === 'demo-jwt-token') {
      return true;
    }
    
    try {
      const parts = token.split('.');
      return parts.length === 3 && parts.every(part => part.length > 0);
    } catch {
      return false;
    }
  };

  const sendOTP = async (email, purpose = 'signup') => {
    try {
      setError(null);
      setLoading(true);

      if (email === 'admin@hrms.com' || email === 'employee@hrms.com') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOtpSent(true);
        setOtpEmail(email);
        setPendingUser({
          email,
          id: email === 'admin@hrms.com' ? '1' : '2',
          name: email === 'admin@hrms.com' ? 'Super Admin' : 'Faizan Sami',
          role: email === 'admin@hrms.com' ? 'super_admin' : 'employee'
        });
        return { success: true };
      }

      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose })
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setOtpEmail(email);
        return { success: true };
      } else {
        setError(data.message || 'Failed to send OTP');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      const message = 'Failed to connect to server';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp, purpose, userData = null) => {
    try {
      setError(null);
      setLoading(true);

      if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
        setError('Please enter a valid 6-digit OTP');
        return { success: false, error: 'Invalid OTP format' };
      }

      if (email === 'admin@hrms.com' || email === 'employee@hrms.com') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demoUser = {
          id: email === 'admin@hrms.com' ? '1' : '2',
          name: email === 'admin@hrms.com' ? 'Super Admin' : 'Faizan Sami',
          email: email,
          role: email === 'admin@hrms.com' ? 'super_admin' : 'employee',
          position: email === 'admin@hrms.com' ? 'Super Administrator' : 'Software Developer',
          department: email === 'admin@hrms.com' ? 'Management' : 'IT'
        };

        const token = generateToken(demoUser);
        
        if (!isValidToken(token)) {
          setError('Token generation failed');
          return { success: false, error: 'Token generation failed' };
        }

        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        setUser(demoUser);
        setOtpSent(false);
        setOtpEmail('');
        setPendingUser(null);
        
        return { success: true, user: demoUser };
      }

      let requestBody = { 
        email, 
        otp, 
        purpose
      };

      if (purpose === 'signup') {
        const registrationData = userData || pendingUser;
        
        if (!registrationData) {
          setError('Registration data not found. Please register again.');
          return { success: false, error: 'Registration data missing' };
        }

        if (!registrationData.name || !registrationData.password) {
          setError('Name and password are required for registration');
          return { success: false, error: 'Name and password are required' };
        }

        requestBody = {
          ...requestBody,
          name: registrationData.name,
          email: registrationData.email,
          password: registrationData.password,
          ...(registrationData.role && { role: registrationData.role }),
          ...(registrationData.position && { position: registrationData.position }),
          ...(registrationData.department && { department: registrationData.department }),
          ...(registrationData.phone && { phone: registrationData.phone })
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        const { token, user: userResponse } = data;
        
        if (!isValidToken(token)) {
          setError('Invalid token received from server');
          return { success: false, error: 'Invalid token received' };
        }

        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(userResponse));
        
        setUser(userResponse);
        setOtpSent(false);
        setOtpEmail('');
        setPendingUser(null);
        
        return { success: true, user: userResponse };
      } else {
        setError(data.message || 'OTP verification failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      const message = 'Failed to connect to server';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      if (email === 'admin@hrms.com' || email === 'employee@hrms.com') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demoUser = {
          id: email === 'admin@hrms.com' ? '1' : '2',
          name: email === 'admin@hrms.com' ? 'Super Admin' : 'Faizan Sami',
          email: email,
          role: email === 'admin@hrms.com' ? 'super_admin' : 'employee',
          position: email === 'admin@hrms.com' ? 'Super Administrator' : 'Software Developer',
          department: email === 'admin@hrms.com' ? 'Management' : 'IT'
        };

        const token = generateToken(demoUser);
        
        if (!isValidToken(token)) {
          setError('Token generation failed');
          return { success: false, error: 'Token generation failed' };
        }

        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        setUser(demoUser);
        
        return { success: true, user: demoUser };
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        const { token, user: userResponse } = data;
        
        if (!isValidToken(token)) {
          setError('Invalid token received from server');
          return { success: false, error: 'Invalid token received' };
        }

        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(userResponse));
        setUser(userResponse);
        
        return { success: true, user: userResponse };
      } else {
        setError(data.message || 'Login failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = 'Failed to connect to server';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      if (!userData.name || !userData.email || !userData.password) {
        setError('Name, email and password are required');
        return { success: false, error: 'Name, email and password are required' };
      }

      setPendingUser(userData);

      const result = await sendOTP(userData.email, 'signup');
      return result;

    } catch (error) {
      console.error('Register error:', error);
      const message = 'Failed to connect to server';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (otp) => {
    if (!pendingUser) {
      setError('No pending registration. Please register first.');
      return { success: false, error: 'No pending registration' };
    }
    
    return await verifyOTP(pendingUser.email, otp, 'signup', pendingUser);
  };

  const completeLogin = async (otp) => {
    if (!pendingUser) {
      setError('No pending login');
      return { success: false, error: 'No pending login' };
    }
    
    return await verifyOTP(pendingUser.email, otp, 'login');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    setUser(null);
    setOtpSent(false);
    setOtpEmail('');
    setPendingUser(null);
    setError(null);
    
    if (typeof axios !== 'undefined') {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const resetOTP = () => {
    setOtpSent(false);
    setOtpEmail('');
    setPendingUser(null);
    setError(null);
  };

  const resendOTP = async () => {
    if (otpEmail) {
      const purpose = pendingUser ? 'signup' : 'login';
      return await sendOTP(otpEmail, purpose);
    }
    return { success: false, error: 'No email found for OTP' };
  };

  const handleTokenError = (errorMessage) => {
    console.error('Token error detected:', errorMessage);
    setError('Session expired. Please login again.');
    
    setTimeout(() => {
      logout();
    }, 2000);
  };

  useEffect(() => {
    const setupInterceptor = () => {
      if (typeof axios !== 'undefined') {
        axios.interceptors.response.use(
          (response) => response,
          (axiosError) => {
            if (axiosError.response?.status === 401) {
              handleTokenError(axiosError.message);
            }
            return Promise.reject(axiosError);
          }
        );
      }
    };

    setupInterceptor();
  }, []);

  const value = {
    user,
    loading,
    error,
    otpSent,
    otpEmail,
    pendingUser,
    sendOTP,
    verifyOTP,
    login,
    register,
    completeRegistration,
    completeLogin,
    logout,
    resetOTP,
    resendOTP,
    setError,
    handleTokenError,
    isValidToken,
    generateToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;