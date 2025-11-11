/* eslint-disable no-unused-vars */
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
    const initializeAuth = () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('currentUser');

      console.log('🔄 [AUTH] Initializing auth, token found:', !!token);
      
      if (token && savedUser) {
        try {
          if (isValidToken(token)) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('✅ [AUTH] Axios header set with token length:', token.length);
          } else {
            console.warn('❌ [AUTH] Invalid token found during init, auto-logout');
            logout();
          }
        } catch (error) {
          console.error('❌ [AUTH] Error parsing user data:', error);
          logout();
        }
      } else {
        console.log('ℹ️ [AUTH] No token found, user not logged in');
        // Ensure no Authorization header is set
        delete axios.defaults.headers.common['Authorization'];
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const generateToken = (userData) => {

    if (userData.email === 'admin@hrms.com') {
      return 'demo-jwt-token'; 
    }
    if (userData.email === 'employee@hrms.com') {
      return 'demo-token-2'; 
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
    if (!token || typeof token !== 'string' || token.length < 10) {
      console.log('❌ [AUTH] Token validation failed:', {
        exists: !!token,
        type: typeof token,
        length: token?.length
      });
      return false;
    }
    
    if (token === 'demo-jwt-token' || token === 'demo-token-2') {
      console.log('✅ [AUTH] Valid demo token');
      return true;
    }
    
    try {
      const parts = token.split('.');
      const isValid = parts.length === 3 && parts.every(part => part.length > 0);
      console.log('✅ [AUTH] JWT token validation:', isValid);
      return isValid;
    } catch {
      console.log('❌ [AUTH] JWT token validation failed');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log('🔐 [AUTH] Login attempt for:', email);

      if (email === 'admin@hrms.com' || email === 'employee@hrms.com') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demoUser = email === 'admin@hrms.com' 
          ? {
              id: '1',
              name: 'Super Admin',
              email: 'admin@hrms.com',
              role: 'super_admin',
              position: 'Super Administrator',
              department: 'Management'
            }
          : {
              id: '2',
              name: 'Faizan Sami',
              email: 'employee@hrms.com',
              role: 'employee',
              position: 'Software Developer',
              department: 'IT',
              company: '65f1a2b3c4d5e6f7a8b9c0d1'
            };

        const token = generateToken(demoUser);
        
        console.log('🎫 [AUTH] Generated token:', token);
        
        if (!isValidToken(token)) {
          setError('Token generation failed');
          return { success: false, error: 'Token generation failed' };
        }

        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('✅ [AUTH] Axios header set after login');
        
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
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userResponse);
        
        return { success: true, user: userResponse };
      } else {
        setError(data.message || 'Login failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('❌ [AUTH] Login error:', error);
      const message = 'Failed to connect to server';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🛡️ [AUTH] Performing logout');
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    delete axios.defaults.headers.common['Authorization'];
    console.log('✅ [AUTH] Axios header cleared');
    
    setUser(null);
    setOtpSent(false);
    setOtpEmail('');
    setPendingUser(null);
    setError(null);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    if (token && isValidToken(token)) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (axiosError) => {
        if (axiosError.response?.status === 401) {
          console.log('🛡️ [AUTH] Auto-logout due to 401 error');
          logout();
          setError('Session expired. Please login again.');
        }
        return Promise.reject(axiosError);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const sendOTP = async (email, purpose = 'signup') => {
    setError(null);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      setOtpEmail(email);
      
      if (email === 'admin@hrms.com' || email === 'employee@hrms.com') {
        setPendingUser({
          email,
          id: email === 'admin@hrms.com' ? '1' : '2',
          name: email === 'admin@hrms.com' ? 'Super Admin' : 'Faizan Sami',
          role: email === 'admin@hrms.com' ? 'super_admin' : 'employee'
        });
      }
      
      console.log(`📧 [AUTH] OTP sent to ${email}`);
      return { success: true };
    } catch {
      setError('Failed to send OTP');
      return { success: false, error: 'Failed to send OTP' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp, purpose = 'login') => {
    setError(null);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
     
      if (email === 'admin@hrms.com' || email === 'employee@hrms.com') {
        const demoUser = email === 'admin@hrms.com' 
          ? {
              id: '1',
              name: 'Super Admin',
              email: 'admin@hrms.com',
              role: 'super_admin',
              position: 'Super Administrator',
              department: 'Management'
            }
          : {
              id: '2',
              name: 'Faizan Sami',
              email: 'employee@hrms.com',
              role: 'employee',
              position: 'Software Developer',
              department: 'IT',
              company: '65f1a2b3c4d5e6f7a8b9c0d1'
            };

        const token = generateToken(demoUser);
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(demoUser);
        setOtpSent(false);
        setOtpEmail('');
        setPendingUser(null);
        
        return { success: true, user: demoUser };
      }
      
      setError('OTP verification failed');
      return { success: false, error: 'OTP verification failed' };
    } catch {
      setError('OTP verification failed');
      return { success: false, error: 'OTP verification failed' };
    } finally {
      setLoading(false);
    }
  };

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
    logout,
    resetOTP: () => {
      setOtpSent(false);
      setOtpEmail('');
      setPendingUser(null);
      setError(null);
    },
    resendOTP: async () => {
      if (otpEmail) {
        return await sendOTP(otpEmail, 'login');
      }
      return { success: false, error: 'No email found for OTP' };
    },
    setError,
    getAuthHeader,
    isValidToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;