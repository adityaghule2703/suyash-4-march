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
//   Typography,
//   Box
// } from '@mui/material';
// import { Add as AddIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Color constants matching Users component
// const COLORS = {
//   primary: '#063C3F',
//   primaryLight: '#E8F0F1',
//   primaryDark: '#05292B',
//   text: {
//     primary: '#151C26',
//     secondary: '#4B5568',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF',
//     lightMuted: 'rgba(255, 255, 255, 0.9)'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FFFC',
//     hover: '#F0FDF9',
//     tableHeader: '#063C3F'
//   },
//   border: '#E3E8EF',
//   status: {
//     success: '#9FE2BF',
//     warning: '#FEF3C7',
//     error: '#FEE2E2',
//     info: '#E0F2FE'
//   },
//   chips: {
//     active: '#9FE2BF',
//     inactive: '#F1F5F9',
//     suspended: '#FEF3C7',
//     locked: '#FEE2E2'
//   }
// };

// const AddTax = ({ open, onClose, onAdd }) => {
//   const [formData, setFormData] = useState({
//     HSNCode: '',
//     GSTPercentage: '',
//     Description: '',
//     IsActive: true
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async () => {
//     // Validation
//     if (!formData.HSNCode.trim()) {
//       setError('HSN Code is required');
//       return;
//     }

//     if (!formData.GSTPercentage) {
//       setError('GST Percentage is required');
//       return;
//     }

//     const gstPercentage = parseFloat(formData.GSTPercentage);
//     if (isNaN(gstPercentage) || gstPercentage < 0 || gstPercentage > 100) {
//       setError('GST Percentage must be a number between 0 and 100');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`${BASE_URL}/api/taxes`, {
//         HSNCode: formData.HSNCode,
//         GSTPercentage: gstPercentage,
//         Description: formData.Description,
//         IsActive: formData.IsActive
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         onAdd(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to add tax');
//       }
//     } catch (err) {
//       console.error('Error adding tax:', err);
//       setError(err.response?.data?.message || 'Failed to add tax. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       HSNCode: '',
//       GSTPercentage: '',
//       Description: '',
//       IsActive: true
//     });
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 5,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         mb: 2,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Typography
//           sx={{
//             fontSize: '1.2rem',
//             fontWeight: 700,
//             color: COLORS.text.primary
//           }}
//         >
//           Add New Tax
//         </Typography>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5 }}>
//         <Stack spacing={2}>
//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
//             {/* HSN Code Field */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   HSN CODE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="HSNCode"
//                   value={formData.HSNCode}
//                   onChange={handleChange}
//                   disabled={loading}
//                   placeholder="Enter HSN code"
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* GST Percentage Field */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   GST PERCENTAGE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="GSTPercentage"
//                   value={formData.GSTPercentage}
//                   onChange={handleChange}
//                   disabled={loading}
//                   type="number"
//                   placeholder="Enter GST percentage"
//                   size="small"
//                   variant="outlined"
//                   InputProps={{
//                     inputProps: {
//                       step: "0.01",
//                       min: "0",
//                       max: "100"
//                     },
//                     endAdornment: (
//                       <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, ml: 0.5 }}>
//                         %
//                       </Typography>
//                     )
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//                 <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
//                   Must be between 0 and 100
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Description Field */}
//             <Box sx={{ gridColumn: 'span 2' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   DESCRIPTION
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   name="Description"
//                   value={formData.Description}
//                   onChange={handleChange}
//                   multiline
//                   rows={3}
//                   disabled={loading}
//                   placeholder="Enter tax description..."
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1.5,
//                       fontSize: '0.75rem',
//                       '&:hover fieldset': {
//                         borderColor: COLORS.primary,
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: COLORS.primary,
//                         borderWidth: 1
//                       }
//                     },
//                     '& .MuiInputBase-input': {
//                       py: 1,
//                       px: 1.5,
//                       fontSize: '0.75rem',
//                       color: COLORS.text.primary,
//                       '&::placeholder': {
//                         color: COLORS.text.tertiary,
//                         fontSize: '0.75rem'
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Box>
//           </Box>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{
//                 borderRadius: 1.5,
//                 mt: 1,
//                 '& .MuiAlert-icon': {
//                   fontSize: '1.25rem',
//                   alignItems: 'center'
//                 },
//                 fontSize: '0.75rem',
//                 py: 0.5
//               }}
//             >
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'flex-end',
//         gap: 1
//       }}>
//         <Button
//           onClick={handleClose}
//           disabled={loading}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: COLORS.primary,
//               bgcolor: `${COLORS.primary}10`
//             }
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || !formData.HSNCode || !formData.GSTPercentage}
//           startIcon={loading ? null : <AddIcon sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             bgcolor: COLORS.primary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//             '&:hover': {
//               bgcolor: COLORS.primaryDark,
//             },
//             '&:disabled': {
//               bgcolor: COLORS.border,
//               color: COLORS.text.tertiary
//             }
//           }}
//         >
//           {loading ? 'Adding...' : 'Add Tax'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddTax;



import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  Collapse,
  Alert,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Error as ErrorIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching Users component
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

// Floating Error Alert Component
const FloatingErrorAlert = ({ error, onClose }) => {
  if (!error) return null;
  
  return (
    <Collapse in={!!error}>
      <Alert
        severity="error"
        variant="filled"
        onClose={onClose}
        icon={<ErrorIcon sx={{ fontSize: '1rem' }} />}
        sx={{
          mb: 2,
          borderRadius: 1.5,
          fontSize: '0.75rem',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '& .MuiAlert-icon': {
            fontSize: '1rem',
            alignItems: 'center'
          },
          '& .MuiAlert-message': {
            py: 0.5,
            fontSize: '0.75rem'
          },
          '& .MuiAlert-action': {
            py: 0,
            alignItems: 'center'
          }
        }}
      >
        {error}
      </Alert>
    </Collapse>
  );
};

const AddTax = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    HSNCode: '',
    GSTPercentage: '',
    Description: '',
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const showError = (message) => {
    setError(message);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    let errorMessages = [];

    // HSN Code validation
    if (!formData.HSNCode.trim()) {
      errors.HSNCode = 'HSN Code is required';
      errorMessages.push('HSN Code is required');
      isValid = false;
    } else if (formData.HSNCode.length < 4 || formData.HSNCode.length > 8) {
      errors.HSNCode = 'HSN Code must be between 4 and 8 characters';
      errorMessages.push('HSN Code must be between 4 and 8 characters');
      isValid = false;
    } else if (!/^[0-9]+$/.test(formData.HSNCode)) {
      errors.HSNCode = 'HSN Code must contain only numbers';
      errorMessages.push('HSN Code must contain only numbers');
      isValid = false;
    }

    // GST Percentage validation
    if (!formData.GSTPercentage) {
      errors.GSTPercentage = 'GST Percentage is required';
      errorMessages.push('GST Percentage is required');
      isValid = false;
    } else {
      const gstPercentage = parseFloat(formData.GSTPercentage);
      if (isNaN(gstPercentage)) {
        errors.GSTPercentage = 'GST Percentage must be a valid number';
        errorMessages.push('GST Percentage must be a valid number');
        isValid = false;
      } else if (gstPercentage < 0 || gstPercentage > 100) {
        errors.GSTPercentage = 'GST Percentage must be between 0 and 100';
        errorMessages.push('GST Percentage must be between 0 and 100');
        isValid = false;
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.GSTPercentage)) {
        errors.GSTPercentage = 'GST Percentage can have up to 2 decimal places';
        errorMessages.push('GST Percentage can have up to 2 decimal places');
        isValid = false;
      }
    }

    setFieldErrors(errors);
    
    if (!isValid) {
      // Show first error as floating message
      showError(errorMessages[0]);
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const gstPercentage = parseFloat(formData.GSTPercentage);
      
      const response = await axios.post(`${BASE_URL}/api/taxes`, {
        HSNCode: formData.HSNCode,
        GSTPercentage: gstPercentage,
        Description: formData.Description,
        IsActive: formData.IsActive
      }, {
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
        showError(response.data.message || 'Failed to add tax');
      }
    } catch (err) {
      console.error('Error adding tax:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add tax. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      HSNCode: '',
      GSTPercentage: '',
      Description: '',
      IsActive: true
    });
    setFieldErrors({});
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
          Add New Tax
        </Typography>
      </DialogTitle>

      {/* Floating Error Alert - Positioned at top of dialog content */}
      <Box sx={{ px: 2.5, pt: 1 }}>
        <FloatingErrorAlert error={error} onClose={() => setError('')} />
      </Box>

      <DialogContent sx={{ p: 2.5, pt: error ? 1 : 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* HSN Code Field */}
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
                  HSN CODE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="HSNCode"
                  value={formData.HSNCode}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter HSN code"
                  size="small"
                  variant="outlined"
                  error={!!fieldErrors.HSNCode}
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
                      },
                      '&.Mui-error fieldset': {
                        borderColor: '#EF4444'
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
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                  4-8 digit numeric code
                </Typography>
                {fieldErrors.HSNCode && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                    {fieldErrors.HSNCode}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* GST Percentage Field */}
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
                  GST PERCENTAGE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="GSTPercentage"
                  value={formData.GSTPercentage}
                  onChange={handleChange}
                  disabled={loading}
                  type="number"
                  placeholder="Enter GST percentage"
                  size="small"
                  variant="outlined"
                  error={!!fieldErrors.GSTPercentage}
                  InputProps={{
                    inputProps: {
                      step: "0.01",
                      min: "0",
                      max: "100"
                    },
                    endAdornment: (
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, ml: 0.5 }}>
                        %
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
                      },
                      '&.Mui-error fieldset': {
                        borderColor: '#EF4444'
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
                  Must be between 0 and 100 (up to 2 decimal places)
                </Typography>
                {fieldErrors.GSTPercentage && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444' }}>
                    {fieldErrors.GSTPercentage}
                  </Typography>
                )}
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
                  placeholder="Enter tax description..."
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
          </Box>
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
          disabled={loading}
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
          {loading ? 'Adding...' : 'Add Tax'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTax;