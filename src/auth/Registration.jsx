import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/Config'; // Adjust the path based on your config file location

const Registration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    phone: '', // Note: This might not be in your API schema
    RoleID: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await axios.get(`${BASE_URL}/api/roles`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setRoles(response.data.data || []);
      } else {
        setError('Failed to load roles. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Unable to load roles. Please refresh the page.');
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    if (!formData.Username || !formData.Email) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Username validation (optional)
    if (formData.Username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.Password || !confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }

    // Password validation (enhanced)
    if (formData.Password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Optional: Add stronger password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(formData.Password)) {
      setError('Password must contain at least one letter, one number, and one special character');
      return false;
    }

    if (formData.Password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    setError('');
    return true;
  };

  const validateStep3 = () => {
    if (!formData.RoleID) {
      setError('Please select a role');
      return false;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation for step 3
    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare the data for API
      const registrationData = {
        Username: formData.Username.trim(),
        Email: formData.Email.trim(),
        Password: formData.Password,
        RoleID: formData.RoleID
        // Note: phone is not included as it's not in your API schema
      };

      const response = await axios.post(
        `${BASE_URL}/api/auth/register`,
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;

      if (data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        
        // Optional: Auto-login after registration
        // If your API returns a token, you could auto-login here
        // Otherwise, redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with an error status (4xx, 5xx)
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            'Registration failed. Please try again.';
        setError(errorMessage);
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please check your network connection.');
      } else {
        // Something else happened
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const ProgressSteps = () => (
    <div className="mb-8">
      <div className="relative flex items-center justify-between">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > stepNumber ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="font-semibold">{stepNumber}</span>
              )}
            </div>
            <span className={`text-xs mt-2 ${step >= stepNumber ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
              {stepNumber === 1 ? 'Personal' : stepNumber === 2 ? 'Security' : 'Review'}
            </span>
          </div>
        ))}
        <div className="absolute top-5 left-1/4 right-1/4 h-1 bg-gray-200 -z-10">
          <div className={`h-full ${step >= 2 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : ''}`} style={{ width: step === 2 ? '50%' : step === 3 ? '100%' : '0%' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl flex overflow-hidden shadow-2xl">
        {/* Left Column - Registration Form */}
        <div className="w-full md:w-1/2 p-10 text-gray-800">
          <h2 className="text-2xl font-semibold mb-2">
            Create Account
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 cursor-pointer font-medium hover:underline">
              Log in
            </Link>
          </p>

          <ProgressSteps />

          {/* Google Sign Up Button (Optional) */}
          {step === 1 && (
            <>
              <button 
                type="button"
                className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 mb-6 text-sm font-medium hover:bg-gray-50 transition"
                disabled={loading}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google"
                  className="w-4 h-4"
                />
                Sign up with Google
              </button>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-xs text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
            </>
          )}

          <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="Username"
                    value={formData.Username}
                    onChange={handleChange}
                    placeholder="john_doe"
                    className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    placeholder="At least 6 characters with letter, number & special character"
                    className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must contain at least one letter, one number, and one special character
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review & Role Selection */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-amber-800 mb-3">Review Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Username:</span>
                      <span className="text-sm font-medium">{formData.Username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium">{formData.Email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Role <span className="text-red-500">*</span>
                  </label>
                  {loadingRoles ? (
                    <div className="flex items-center justify-center p-4">
                      <svg className="animate-spin h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">Loading roles...</span>
                    </div>
                  ) : roles.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role) => (
                        <div key={role._id} className="flex items-center">
                          <input
                            type="radio"
                            id={`role-${role._id}`}
                            name="RoleID"
                            value={role._id}
                            checked={formData.RoleID === role._id}
                            onChange={handleChange}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                            required
                          />
                          <label htmlFor={`role-${role._id}`} className="ml-2 text-sm text-gray-700">
                            {role.RoleName}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">No roles available. Please contact administrator.</p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                      I agree to Suyash Enterprises's{" "}
                      <span className="text-orange-600 font-medium hover:underline cursor-pointer">Privacy Policy</span> and{" "}
                      <span className="text-orange-600 font-medium hover:underline cursor-pointer">Terms of Service</span>.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-green-600">{success}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-md py-2 font-medium text-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className={`flex-1 ${step > 1 ? '' : 'md:flex-none md:w-32'} bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition rounded-md py-2 font-semibold text-sm text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || loadingRoles || !formData.RoleID}
                  className={`flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition rounded-md py-2 font-semibold text-sm text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </div>
                  ) : 'Create Account'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column - Branding/Info */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 p-8">
          <div className="text-center max-w-md">
            {/* Visual representation based on step */}
            <div className="mb-8">
              <div className="w-full h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-amber-200 via-orange-100 to-yellow-100 border border-amber-200 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-3 gap-8 h-full p-4">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-amber-400 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    {step === 1 ? (
                      <div className="w-40 h-32 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-300 p-4 shadow-sm">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="h-3 bg-amber-300/50 rounded mb-2"></div>
                        <div className="h-3 bg-amber-400/60 rounded mb-2"></div>
                        <div className="h-3 bg-amber-300/50 rounded"></div>
                      </div>
                    ) : step === 2 ? (
                      <div className="w-40 h-32 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-300 p-4 shadow-sm">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex justify-center gap-1 mb-2">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-2 h-6 bg-amber-400/60 rounded"></div>
                          ))}
                        </div>
                        <div className="h-3 bg-amber-300/50 rounded mb-1"></div>
                        <div className="h-3 bg-amber-400/60 rounded"></div>
                      </div>
                    ) : (
                      <div className="w-40 h-32 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-300 p-4 shadow-sm">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="h-3 bg-amber-300/50 rounded mb-1"></div>
                        <div className="h-3 bg-amber-400/60 rounded mb-1"></div>
                        <div className="h-3 bg-amber-300/50 rounded mb-1"></div>
                        <div className="h-3 bg-amber-400/60 rounded"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {step === 1 ? 'Personal Information' : step === 2 ? 'Security Setup' : 'Review & Complete'}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step === 1 
                  ? 'Enter your username and email to get started with your account.' 
                  : step === 2 
                  ? 'Set up a strong password to protect your account.'
                  : 'Review your information and select your role to complete registration.'
                }
              </p>
            </div>

            {/* Progress indicators */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-amber-100 border border-amber-200' : 'bg-gray-100'}`}>
                  <span className="text-xs font-medium">1</span>
                </div>
                <span className="text-sm text-gray-700">Personal Details</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-amber-100 border border-amber-200' : 'bg-gray-100'}`}>
                  <span className="text-xs font-medium">2</span>
                </div>
                <span className="text-sm text-gray-700">Security Setup</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-amber-100 border border-amber-200' : 'bg-gray-100'}`}>
                  <span className="text-xs font-medium">3</span>
                </div>
                <span className="text-sm text-gray-700">Review & Submit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;