// import React, { useState } from 'react';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     TextField,
//     Stack,
//     Alert,
//     FormControlLabel,
//     Switch,
//     MenuItem,
//     Box
// } from '@mui/material';
// import { Add as AddIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// const AddHoliday = ({ open, onClose, onAdd }) => {
//     const [formData, setFormData] = useState({
//         Name: '',
//         Date: '',
//         Type: '',
//         Description: '',
//         Year: new Date().getFullYear(),
//         IsRecurring: false,
//         IsActive: true
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     // Handle Input Change
//     const handleChange = (e) => {
//         const { name, value, checked, type } = e.target;

//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     // Submit
//     const handleSubmit = async () => {
//         if (!formData.Name.trim()) {
//             setError('Holiday name is required');
//             return;
//         }

//         if (!formData.Date) {
//             setError('Holiday date is required');
//             return;
//         }

//         setLoading(true);
//         setError('');

//         try {
//             const token = localStorage.getItem('token');

//             const response = await axios.post(
//                 `${BASE_URL}/api/holidays`,
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             console.log('Holiday response:', response.data);

//             // Check if response is successful
//             if (response.data.success) {
//                 // Only call onAdd if it exists and is a function
//                 if (onAdd && typeof onAdd === 'function') {
//                     onAdd(response.data.data);
//                 }
                
//                 resetForm();
//                 onClose(true); // Pass true to indicate success
//             } else {
//                 setError(response.data.message || 'Failed to add holiday');
//             }

//         } catch (err) {
//             console.error('Error adding holiday:', err);
            
//             // Better error handling
//             if (err.response) {
//                 setError(err.response.data?.message || 
//                         err.response.data?.error || 
//                         `Server error: ${err.response.status}`);
//             } else if (err.request) {
//                 setError('No response from server. Please check your connection.');
//             } else {
//                 setError('Error setting up request. Please try again.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             Name: '',
//             Date: '',
//             Type: '',
//             Description: '',
//             Year: new Date().getFullYear(),
//             IsRecurring: false,
//             IsActive: true
//         });
//         setError('');
//     };

//     const handleClose = () => {
//         resetForm();
//         onClose(false); // Pass false when cancelled
//     };

//     return (
//         <Dialog
//             open={open}
//             onClose={handleClose}
//             maxWidth="sm"
//             fullWidth
//             PaperProps={{
//                 sx: { borderRadius: 2 }
//             }}
//         >
//             <DialogTitle
//                 sx={{
//                     borderBottom: '1px solid #E0E0E0',
//                     pb: 2,
//                     backgroundColor: '#F8FAFC'
//                 }}
//             >
//                 <div style={{ fontSize: 20, fontWeight: 600 }}>
//                     Add New Holiday
//                 </div>
//             </DialogTitle>

//             <DialogContent sx={{ pt: 3 }}>
//                 <Stack spacing={3} sx={{ mt: 2 }}>

//                     <TextField
//                         fullWidth
//                         label="Holiday Name"
//                         name="Name"
//                         value={formData.Name}
//                         onChange={handleChange}
//                         required
//                         disabled={loading}
//                     />
// <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                     <TextField
//                         fullWidth
//                         type="date"
//                         label="Holiday Date"
//                         name="Date"
//                         InputLabelProps={{ shrink: true }}
//                         value={formData.Date}
//                         onChange={handleChange}
//                         required
//                         disabled={loading}
//                     />

//                     <TextField
//                         fullWidth
//                         select
//                         label="Holiday Type"
//                         name="Type"
//                         value={formData.Type}
//                         onChange={handleChange}
//                         disabled={loading}
//                     >
//                         <MenuItem value="National">National</MenuItem>
//                         <MenuItem value="Festival">Festival</MenuItem>
//                         <MenuItem value="Company">Company</MenuItem>
//                         <MenuItem value="Optional">Optional</MenuItem>
//                     </TextField>

//                     <TextField
//                         fullWidth
//                         label="Year"
//                         name="Year"
//                         type="number"
//                         value={formData.Year}
//                         onChange={handleChange}
//                         disabled={loading}
//                     />
// </Stack>
//                     <TextField
//                         fullWidth
//                         label="Description"
//                         name="Description"
//                         value={formData.Description}
//                         onChange={handleChange}
//                         multiline
//                         rows={3}
//                         disabled={loading}
//                     />

//                     <Box
//                         sx={{
//                             display: "flex",
//                             gap: 10,
//                             alignItems: "center",
//                             flexWrap: "wrap",
//                         }}
//                     >
//                         <FormControlLabel
//                             control={
//                                 <Switch
//                                     checked={formData.IsRecurring}
//                                     onChange={handleChange}
//                                     name="IsRecurring"
//                                     disabled={loading}
//                                 />
//                             }
//                             label="Recurring Every Year"
//                         />

//                         {/* <FormControlLabel
//                             control={
//                                 <Switch
//                                     checked={formData.IsActive}
//                                     onChange={handleChange}
//                                     name="IsActive"
//                                     disabled={loading}
//                                 />
//                             }
//                             label="Active"
//                         /> */}
//                     </Box>

//                     {error && <Alert severity="error">{error}</Alert>}

//                 </Stack>
//             </DialogContent>

//             <DialogActions
//                 sx={{
//                     px: 3,
//                     pb: 3,
//                     borderTop: '1px solid #E0E0E0',
//                     pt: 2,
//                     backgroundColor: '#F8FAFC'
//                 }}
//             >
//                 <Button onClick={handleClose} disabled={loading}>
//                     Cancel
//                 </Button>

//                 <Button
//                     variant="contained"
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     startIcon={loading ? null : <AddIcon />}
//                 >
//                     {loading ? 'Adding...' : 'Add Holiday'}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default AddHoliday;

import React, { useState } from 'react';
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
  Box,
  Switch,
  FormControlLabel,
  MenuItem
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching AddLeaveType component
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

// Holiday type options
const holidayTypes = [
  { value: 'National', label: 'National' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Company', label: 'Company' },
  { value: 'Optional', label: 'Optional' }
];

const AddHoliday = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Date: '',
    Type: '',
    Description: '',
    Year: new Date().getFullYear(),
    IsRecurring: false,
    IsActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.Name.trim()) {
      setError('Holiday name is required');
      return;
    }

    if (formData.Name.trim().length < 2) {
      setError('Holiday name must be at least 2 characters');
      return;
    }

    if (!formData.Date) {
      setError('Holiday date is required');
      return;
    }

    // Validate date is valid
    const selectedDate = new Date(formData.Date);
    if (isNaN(selectedDate.getTime())) {
      setError('Please enter a valid date');
      return;
    }

    if (!formData.Type) {
      setError('Holiday type is required');
      return;
    }

    if (!formData.Year) {
      setError('Year is required');
      return;
    }

    const year = parseInt(formData.Year);
    if (isNaN(year) || year < 2000 || year > 2100) {
      setError('Year must be between 2000 and 2100');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${BASE_URL}/api/holidays`,
        {
          ...formData,
          Year: parseInt(formData.Year)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add holiday');
      }
    } catch (err) {
      console.error('Error adding holiday:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Failed to add holiday. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Date: '',
      Type: '',
      Description: '',
      Year: new Date().getFullYear(),
      IsRecurring: false,
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
          Add New Holiday
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* Holiday Name Field */}
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
                  HOLIDAY NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter holiday name"
                  size="small"
                  variant="outlined"
                  error={!!error && (error.includes('Holiday name') || error.includes('name must be'))}
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

            {/* Holiday Date Field */}
            <Box sx={{ gridColumn: 'span 1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  HOLIDAY DATE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  name="Date"
                  value={formData.Date}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={!!error && error.includes('date')}
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
                      color: COLORS.text.primary
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Year Field */}
            <Box sx={{ gridColumn: 'span 1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: COLORS.text.secondary,
                    letterSpacing: '0.5px'
                  }}
                >
                  YEAR <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Year"
                  type="number"
                  value={formData.Year}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter year"
                  size="small"
                  variant="outlined"
                  error={!!error && error.includes('Year')}
                  InputProps={{
                    inputProps: {
                      min: 2000,
                      max: 2100,
                      step: 1
                    }
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
                  Must be between 2000 and 2100
                </Typography>
              </Box>
            </Box>

            {/* Holiday Type Field */}
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
                  HOLIDAY TYPE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  select
                  name="Type"
                  value={formData.Type}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                  placeholder="Select holiday type"
                  error={!!error && error.includes('Type')}
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
                      color: COLORS.text.primary
                    }
                  }}
                >
                  <MenuItem value="" disabled>Select type</MenuItem>
                  {holidayTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Typography sx={{ fontSize: '0.75rem' }}>
                        {option.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </TextField>
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
                  placeholder="Enter holiday description..."
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

            {/* Switches */}
            <Box sx={{ gridColumn: 'span 2', mt: 1, display: 'flex', gap: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.IsRecurring}
                    onChange={handleChange}
                    name="IsRecurring"
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
                    Recurring Every Year
                  </Typography>
                }
              />

              {/* <FormControlLabel
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
              /> */}
            </Box>
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
          disabled={loading || !formData.Name.trim() || !formData.Date || !formData.Type || !formData.Year}
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
          {loading ? 'Adding...' : 'Add Holiday'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHoliday;