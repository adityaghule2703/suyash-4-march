// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   FormControlLabel,
//   Switch
// } from '@mui/material';
// import { Add as AddIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const AddLeaveTypes = ({ open, onClose, onAdd }) => {
//   const [formData, setFormData] = useState({
//     Name: '',
//     MaxDaysPerYear: '',
//     Description: '',
//     IsActive: true
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'IsActive' ? checked : 
//                name === 'MaxDaysPerYear' ? parseInt(value) || '' : 
//                value
//     }));
//   };

//   const handleSubmit = async () => {
//     // Validation
//     if (!formData.Name.trim()) {
//       setError('Leave type name is required');
//       return;
//     }

//     if (formData.Name.trim().length < 2) {
//       setError('Leave type name must be at least 2 characters');
//       return;
//     }

//     if (!formData.MaxDaysPerYear || formData.MaxDaysPerYear < 1) {
//       setError('Maximum days per year must be at least 1');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
      
//       // Prepare data - ensure MaxDaysPerYear is a number
//       const submitData = {
//         ...formData,
//         MaxDaysPerYear: parseInt(formData.MaxDaysPerYear)
//       };

//       const response = await axios.post(`${BASE_URL}/api/leavetypes`, submitData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Response:', response.data);

//       // Check if response is successful
//       if (response.data.success) {
//         // Only call onAdd if it exists and is a function
//         if (onAdd && typeof onAdd === 'function') {
//           onAdd(response.data.data);
//         }
        
//         resetForm();
//         onClose(true); // Pass true to indicate success
//       } else {
//         setError(response.data.message || 'Failed to add leave type');
//       }
//     } catch (err) {
//       console.error('Error adding leave type:', err);
      
//       // Handle specific error cases
//       if (err.response) {
//         setError(err.response.data?.message || 
//                 err.response.data?.error || 
//                 `Server error: ${err.response.status}`);
//       } else if (err.request) {
//         setError('No response from server. Please check your connection.');
//       } else {
//         setError('Error setting up request. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       Name: '',
//       MaxDaysPerYear: '',
//       Description: '',
//       // IsActive: true
//     });
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose(false); // Pass false when cancelled
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={handleClose} 
//       maxWidth="sm" 
//       fullWidth
//       PaperProps={{
//         sx: { borderRadius: 2 }
//       }}
//     >
//       <DialogTitle sx={{ 
//         borderBottom: '1px solid #E0E0E0', 
//         pb: 2,
//         backgroundColor: '#F8FAFC'
//       }}>
//         <div style={{ 
//           fontSize: '20px', 
//           fontWeight: '600', 
//           color: '#101010',
//           paddingTop: '8px'
//         }}>
//           Add New Leave Type
//         </div>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3 }}>
//         <Stack spacing={3}>
//           {/* Add padding from top for the first field */}
//           <div style={{ marginTop: '16px' }}>
//             <TextField
//               fullWidth
//               label="Leave Type Name"
//               name="Name"
//               value={formData.Name}
//               onChange={handleChange}
//               required
//               error={!!error && (error.includes('Leave type name') || error.includes('name must be'))}
//               helperText={error && (error.includes('Leave type name') || error.includes('name must be')) ? error : ''}
//               disabled={loading}
//               size="medium"
//               variant="outlined"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1,
//                 }
//               }}
//             />
//           </div>
          
//           <TextField
//             fullWidth
//             label="Maximum Days Per Year"
//             name="MaxDaysPerYear"
//             value={formData.MaxDaysPerYear}
//             onChange={handleChange}
//             required
//             type="number"
//             inputProps={{ 
//               min: 1,
//               max: 365,
//               step: 1
//             }}
//             error={!!error && error.includes('Maximum days')}
//             helperText={error && error.includes('Maximum days') ? error : 'Enter maximum number of days allowed per year'}
//             disabled={loading}
//             size="medium"
//             variant="outlined"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 1,
//               }
//             }}
//           />
          
//           <TextField
//             fullWidth
//             label="Description"
//             name="Description"
//             value={formData.Description}
//             onChange={handleChange}
//             multiline
//             rows={4}
//             disabled={loading}
//             size="medium"
//             variant="outlined"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 1,
//               }
//             }}
//           />
          
//           {/* <FormControlLabel
//             control={
//               <Switch
//                 checked={formData.IsActive}
//                 onChange={handleChange}
//                 name="IsActive"
//                 color="primary"
//                 disabled={loading}
//               />
//             }
//             label="Active"
//             sx={{ mt: 1 }}
//           /> */}
          
//           {error && !error.includes('Leave type name') && !error.includes('name must be') && !error.includes('Maximum days') && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 borderRadius: 1,
//                 '& .MuiAlert-icon': {
//                   alignItems: 'center'
//                 }
//               }}
//             >
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         px: 3, 
//         pb: 3, 
//         borderTop: '1px solid #E0E0E0', 
//         pt: 2,
//         backgroundColor: '#F8FAFC'
//       }}>
//         <Button 
//           onClick={handleClose} 
//           disabled={loading}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           startIcon={loading ? null : <AddIcon />}
//           sx={{
//             borderRadius: 1,
//             px: 3,
//             py: 1,
//             textTransform: 'none',
//             fontWeight: 500,
//             backgroundColor: '#1976D2',
//             '&:hover': {
//               backgroundColor: '#1565C0'
//             }
//           }}
//         >
//           {loading ? 'Adding...' : 'Add Leave Type'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddLeaveTypes;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
  CircularProgress,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching AddTax component
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  status: {
    success: '#9FE2BF',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#E0F2FE'
  },
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9',
    suspended: '#FEF3C7',
    locked: '#FEE2E2'
  }
};

const AddLeaveType = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    Name: '',
    MaxDaysPerYear: '',
    Description: '',
 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'IsActive' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.Name.trim()) {
      setError('Leave type name is required');
      return;
    }

    if (formData.Name.trim().length < 2) {
      setError('Leave type name must be at least 2 characters');
      return;
    }

    if (!formData.MaxDaysPerYear) {
      setError('Maximum days per year is required');
      return;
    }

    const maxDays = parseInt(formData.MaxDaysPerYear);
    if (isNaN(maxDays) || maxDays < 1 || maxDays > 365) {
      setError('Maximum days per year must be a number between 1 and 365');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare data - ensure MaxDaysPerYear is a number
      const submitData = {
        ...formData,
        MaxDaysPerYear: parseInt(formData.MaxDaysPerYear)
      };

      const response = await axios.post(`${BASE_URL}/api/leavetypes`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add leave type');
      }
    } catch (err) {
      console.error('Error adding leave type:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Failed to add leave type. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      MaxDaysPerYear: '',
      Description: '',
      IsActive: true
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Add New Leave Type
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Leave Type Name Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  LEAVE TYPE NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter leave type name"
                  size="small"
                  variant="outlined"
                  error={!!error && (error.includes('Leave type name') || error.includes('name must be'))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Maximum Days Per Year Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  MAXIMUM DAYS PER YEAR <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="MaxDaysPerYear"
                  value={formData.MaxDaysPerYear}
                  onChange={handleChange}
                  disabled={loading}
                  type="number"
                  placeholder="Enter maximum days"
                  size="small"
                  variant="outlined"
                  error={!!error && error.includes('Maximum days')}
                  InputProps={{
                    inputProps: {
                      step: "1",
                      min: "1",
                      max: "365"
                    },
                    endAdornment: (
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, ml: 0.5 }}>
                        days
                      </Typography>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                  Must be between 1 and 365 days
                </Typography>
              </Box>
            </Box>

            {/* Description Field */}
            <Box sx={{ gridColumn: 'span 2' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  DESCRIPTION
                </Typography>
                <TextField
                  fullWidth
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  disabled={loading}
                  placeholder="Enter leave type description..."
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      '&:hover fieldset': {
                        borderColor: COLORS.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary,
                        borderWidth: 1
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.tertiary,
                        fontSize: '0.75rem'
                      }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Status Switch */}
            {/* <Box sx={{ gridColumn: 'span 2', mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.IsActive}
                    onChange={handleChange}
                    name="IsActive"
                    disabled={loading}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: COLORS.primary,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: COLORS.primary,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    Active
                  </Typography>
                }
              />
            </Box> */}
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 1.5,
                mt: 1,
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem',
                  alignItems: 'center'
                },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.Name.trim() || !formData.MaxDaysPerYear}
          startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            },
            '&:disabled': {
              bgcolor: COLORS.border,
              color: COLORS.text.tertiary
            }
          }}
        >
          {loading ? 'Adding...' : 'Add Leave Type'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLeaveType;