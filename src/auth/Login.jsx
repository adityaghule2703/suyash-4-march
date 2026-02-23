import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BASE_URL from '../config/Config';
import axios from 'axios';
import {
  Alert,
  Snackbar,
  CircularProgress,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Box
} from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (token && isLoggedIn === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: email.trim(),
        password: password.trim()
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = response.data;

      if (data.success && data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', data.data.Email);
        localStorage.setItem('userName', data.data.Username);
        localStorage.setItem('userRole', data.data.RoleName);
        localStorage.setItem('userId', data.data._id);
        localStorage.setItem('userRoleId', data.data.RoleID._id);
        localStorage.setItem('userData', JSON.stringify(data.data));

        if (response.data.employee?._id) {
          localStorage.setItem("employeeId", response.data.employee._id);
        }

        setSuccess('Login successful! Redirecting...');

        setTimeout(() => {
          navigate('/');
        }, 1000);

      } else {
        setError(data.message || 'Invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);

      if (err.response) {
        const errorMessage = err.response.data?.message ||
          err.response.data?.error ||
          'Login failed. Please check your credentials and try again.';
        setError(errorMessage);
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin(e);
    }
  };

  // Updated color constants to match new gradient
  const GRADIENT_START = '#8ecee9';
  const GRADIENT_END = '#3290e2';
  const PRIMARY_COLOR = '#2c7ab1';
  const PRIMARY_HOVER = '#1e5f8e';
  const LOGO_COLOR = '#3D3181';

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#8ecee9] to-[#3290e2]">
      {/* Modern Geometric Pattern Background - Enhanced Design */}
      
      {/* Pattern 1: Floating Hexagons */}
      <div className="absolute inset-0 opacity-25">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagon-pattern" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="rotate(15)">
              <path d="M40 0 L77.5 20 L77.5 60 L40 80 L2.5 60 L2.5 20 Z" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="1.5" 
                    opacity="0.4" />
              <circle cx="40" cy="40" r="4" fill="white" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
        </svg>
      </div>

      {/* Pattern 2: Intersecting Lines with Dots */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="line-dot-pattern" patternUnits="userSpaceOnUse" width="60" height="60">
              {/* Horizontal lines */}
              <line x1="0" y1="15" x2="60" y2="15" stroke="white" strokeWidth="1" opacity="0.25" />
              <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="1" opacity="0.25" />
              <line x1="0" y1="45" x2="60" y2="45" stroke="white" strokeWidth="1" opacity="0.25" />
              
              {/* Vertical lines */}
              <line x1="15" y1="0" x2="15" y2="60" stroke="white" strokeWidth="1" opacity="0.25" />
              <line x1="30" y1="0" x2="30" y2="60" stroke="white" strokeWidth="1" opacity="0.25" />
              <line x1="45" y1="0" x2="45" y2="60" stroke="white" strokeWidth="1" opacity="0.25" />
              
              {/* Dots at intersections */}
              <circle cx="15" cy="15" r="2" fill="white" opacity="0.6" />
              <circle cx="30" cy="15" r="2" fill="white" opacity="0.6" />
              <circle cx="45" cy="15" r="2" fill="white" opacity="0.6" />
              <circle cx="15" cy="30" r="2" fill="white" opacity="0.6" />
              <circle cx="30" cy="30" r="2" fill="white" opacity="0.6" />
              <circle cx="45" cy="30" r="2" fill="white" opacity="0.6" />
              <circle cx="15" cy="45" r="2" fill="white" opacity="0.6" />
              <circle cx="30" cy="45" r="2" fill="white" opacity="0.6" />
              <circle cx="45" cy="45" r="2" fill="white" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#line-dot-pattern)" />
        </svg>
      </div>

      {/* Pattern 3: Modern Wave Lines */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave-pattern" patternUnits="userSpaceOnUse" width="120" height="60">
              <path d="M0 30 Q30 15, 60 30 T120 30" 
                    stroke="white" 
                    strokeWidth="2" 
                    fill="none" 
                    opacity="0.35" />
              <circle cx="30" cy="22" r="3" fill="white" opacity="0.5" />
              <circle cx="90" cy="38" r="3" fill="white" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      </div>

      {/* Pattern 4: Geometric Triangles */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="triangle-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
              <path d="M0 0 L50 50 L0 100 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
              <path d="M100 0 L50 50 L100 100 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
              <circle cx="50" cy="50" r="3" fill="white" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#triangle-pattern)" />
        </svg>
      </div>

      {/* Pattern 5: Digital Circuit Lines */}
      <div className="absolute inset-0 opacity-25">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
              {/* Circuit lines */}
              <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="1.5" opacity="0.35" />
              <line x1="60" y1="20" x2="100" y2="20" stroke="white" strokeWidth="1.5" opacity="0.35" />
              <line x1="40" y1="20" x2="40" y2="50" stroke="white" strokeWidth="1.5" opacity="0.35" />
              <line x1="60" y1="20" x2="60" y2="50" stroke="white" strokeWidth="1.5" opacity="0.35" />
              <line x1="40" y1="50" x2="60" y2="50" stroke="white" strokeWidth="1.5" opacity="0.35" />
              <line x1="20" y1="70" x2="50" y2="70" stroke="white" strokeWidth="1.5" opacity="0.35" />
              <line x1="70" y1="70" x2="90" y2="70" stroke="white" strokeWidth="1.5" opacity="0.35" />
              
              {/* Circuit nodes */}
              <circle cx="40" cy="20" r="4" fill="white" opacity="0.6" />
              <circle cx="60" cy="20" r="4" fill="white" opacity="0.6" />
              <circle cx="50" cy="50" r="5" fill="white" opacity="0.7" />
              <circle cx="20" cy="70" r="3" fill="white" opacity="0.5" />
              <circle cx="70" cy="70" r="3" fill="white" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#8ecee9] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#3290e2] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-40 right-40 w-96 h-96 bg-[#4fa3e8] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: 0.2 + Math.random() * 0.3,
              animation: `float-particle ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-16 lg:gap-24">
          
          {/* Left Side - Company Info */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="relative">
                {/* Main Logo */}
                <img 
                  src="/se.png" 
                  alt="Suyash Enterprises" 
                  className="w-[450px] object-contain relative z-10"
                />
                
                {/* Always Active Effects */}
                <div className="absolute -inset-8 bg-white/30 rounded-full blur-3xl opacity-70 animate-pulse-slow"></div>
                <div className="absolute -inset-4 bg-white/40 rounded-full blur-2xl opacity-80 animate-pulse"></div>
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-90 animate-ping-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 rounded-full blur-3xl rotate-45 opacity-60 animate-spin-slow"></div>
                
                {/* Sparkle Effects */}
                <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full blur-sm opacity-100 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-white rounded-full blur-sm opacity-100 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-white rounded-full blur-sm opacity-100 animate-ping" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full blur-sm opacity-100 animate-ping" style={{ animationDelay: '1.1s' }}></div>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg tracking-tight">
              Suyash Enterprises
            </h1>
            <p className="text-2xl text-white/90 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Welcome to Your Enterprise Management System
            </p>
            
            <div className="flex items-center gap-3 mt-8 justify-center lg:justify-start">
              <div className="w-16 h-1 bg-white/40 rounded-full"></div>
              <div className="w-3 h-3 bg-white/60 rounded-full"></div>
              <div className="w-16 h-1 bg-white/40 rounded-full"></div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="lg:w-1/3 w-full max-w-md">
            <Paper 
              elevation={24} 
              className="p-10"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 30px 50px rgba(0,0,0,0.3)',
              }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-500 text-base">
                  Please sign in to your account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Email Address
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        height: '52px',
                        '&:hover fieldset': {
                          borderColor: PRIMARY_COLOR,
                          borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: PRIMARY_COLOR,
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        height: '52px',
                        '&:hover fieldset': {
                          borderColor: PRIMARY_COLOR,
                          borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: PRIMARY_COLOR,
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>

                {/* <div className="text-right pt-2">
                  <button
                    type="button"
                    onClick={() => alert('Please contact system administrator to reset your password.')}
                    className="text-sm font-medium hover:underline transition-all"
                    style={{ color: PRIMARY_COLOR }}
                  >
                    Forgot Password?
                  </button>
                </div> */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: PRIMARY_COLOR,
                    borderRadius: '12px',
                    padding: '14px 0',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    height: '52px',
                    mt: 2,
                    boxShadow: `0 8px 16px ${PRIMARY_COLOR}40`,
                    '&:hover': {
                      backgroundColor: PRIMARY_HOVER,
                      boxShadow: `0 12px 24px ${PRIMARY_COLOR}60`,
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#9ca3af',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={26} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              

              <div className="mt-8 pt-6 border-t border-gray-200">
                {/* <p className="text-center text-sm text-gray-500">
                  © 2024 Suyash Enterprises. All rights reserved.
                </p> */}
                <p className="text-center text-xs text-gray-400 mt-2">
                  Design and Developed by Softcrowd Technologies
                </p>
              </div>
            </Paper>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={3000}
        onClose={() => {
          setError('');
          setSuccess('');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={error ? 'error' : 'success'} 
          sx={{ 
            borderRadius: '12px',
            fontWeight: 500,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;