// // import React, { useState, useEffect } from 'react';
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// //   Stack,
// //   Alert,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Grid,
// //   CircularProgress
// // } from '@mui/material';
// // import { CloseSharp, Edit as EditIcon } from '@mui/icons-material';
// // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // import axios from 'axios';
// // import BASE_URL from '../../../config/Config';

// // const EditLeave = ({ open, onClose, leaveData, onUpdate }) => {
// //   const [formData, setFormData] = useState({
// //     leaveTypeId: '',
// //     startDate: null,
// //     endDate: null,
// //     reason: '',
// //     contactNumber: '',
// //     addressDuringLeave: ''
// //   });
  
// //   const [leaveTypes, setLeaveTypes] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [fetchLoading, setFetchLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [dateError, setDateError] = useState('');

// //   // Fetch leave types when component mounts
// //   useEffect(() => {
// //     fetchLeaveTypes();
// //   }, []);

// //   // Set form data when leaveData changes
// //   useEffect(() => {
// //     if (leaveData) {
// //       setFormData({
// //         leaveTypeId: leaveData.LeaveTypeID?._id || leaveData.leaveTypeId || '',
// //         startDate: leaveData.StartDate ? new Date(leaveData.StartDate) : null,
// //         endDate: leaveData.EndDate ? new Date(leaveData.EndDate) : null,
// //         reason: leaveData.Reason || leaveData.reason || '',
// //         contactNumber: leaveData.ContactNumber || leaveData.contactNumber || '',
// //         addressDuringLeave: leaveData.AddressDuringLeave || leaveData.addressDuringLeave || ''
// //       });
// //     }
// //   }, [leaveData]);

// //   const fetchLeaveTypes = async () => {
// //     setFetchLoading(true);
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await axios.get(`${BASE_URL}/api/leavetypes`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });
      
// //       if (response.data.success) {
// //         setLeaveTypes(response.data.data || []);
// //       }
// //     } catch (err) {
// //       console.error('Error fetching leave types:', err);
// //     } finally {
// //       setFetchLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
    
// //     // Clear field-specific errors
// //     if (error && (error.includes('contact') || error.includes('address'))) {
// //       setError('');
// //     }
// //   };

// //   const handleDateChange = (field, date) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       [field]: date
// //     }));
    
// //     // Clear date error when dates are modified
// //     setDateError('');
    
// //     // Validate date range
// //     if (field === 'startDate' && formData.endDate && date) {
// //       if (date > formData.endDate) {
// //         setDateError('Start date cannot be after end date');
// //       }
// //     } else if (field === 'endDate' && formData.startDate && date) {
// //       if (formData.startDate > date) {
// //         setDateError('End date cannot be before start date');
// //       }
// //     }
// //   };

// //   const validatePhoneNumber = (phone) => {
// //     const phoneRegex = /^[0-9]{10}$/;
// //     return phoneRegex.test(phone);
// //   };

// //   const handleSubmit = async () => {
// //     // Validation
// //     if (!formData.leaveTypeId) {
// //       setError('Please select a leave type');
// //       return;
// //     }

// //     if (!formData.startDate) {
// //       setError('Start date is required');
// //       return;
// //     }

// //     if (!formData.endDate) {
// //       setError('End date is required');
// //       return;
// //     }

// //     if (formData.startDate > formData.endDate) {
// //       setDateError('Start date cannot be after end date');
// //       setError('Please fix the date range');
// //       return;
// //     }

// //     if (!formData.reason.trim()) {
// //       setError('Reason is required');
// //       return;
// //     }

// //     // if (formData.reason.trim().length < 10) {
// //     //   setError('Reason must be at least 10 characters');
// //     //   return;
// //     // }

// //     if (!formData.contactNumber.trim()) {
// //       setError('Contact number is required');
// //       return;
// //     }

// //     if (!validatePhoneNumber(formData.contactNumber)) {
// //       setError('Please enter a valid 10-digit contact number');
// //       return;
// //     }

// //     if (!formData.addressDuringLeave.trim()) {
// //       setError('Address during leave is required');
// //       return;
// //     }

// //     if (formData.addressDuringLeave.trim().length < 10) {
// //       setError('Address must be at least 10 characters');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');
// //     setDateError('');

// //     try {
// //       const token = localStorage.getItem('token');
      
// //       // Format dates to YYYY-MM-DD
// //       const formatDate = (date) => {
// //         const d = new Date(date);
// //         const year = d.getFullYear();
// //         const month = String(d.getMonth() + 1).padStart(2, '0');
// //         const day = String(d.getDate()).padStart(2, '0');
// //         return `${year}-${month}-${day}`;
// //       };

// //       // Prepare data for API
// //       const submitData = {
// //         leaveTypeId: formData.leaveTypeId,
// //         startDate: formatDate(formData.startDate),
// //         endDate: formatDate(formData.endDate),
// //         reason: formData.reason.trim(),
// //         contactNumber: formData.contactNumber.trim(),
// //         addressDuringLeave: formData.addressDuringLeave.trim()
// //       };

// //       const response = await axios.put(
// //         `${BASE_URL}/api/leaves/${leaveData._id || leaveData.id}`,
// //         submitData,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       if (response.data.success) {
// //         if (onUpdate && typeof onUpdate === 'function') {
// //           onUpdate(response.data.data);
// //         }
// //         onClose(true); // Pass true to indicate success
// //       } else {
// //         setError(response.data.message || 'Failed to update leave request');
// //       }
// //     } catch (err) {
// //       console.error('Error updating leave:', err);
      
// //       if (err.response) {
// //         // Server responded with error
// //         setError(err.response.data?.message || 
// //                 err.response.data?.error || 
// //                 `Server error: ${err.response.status}`);
// //       } else if (err.request) {
// //         // Request made but no response
// //         setError('No response from server. Please check your connection.');
// //       } else {
// //         // Something else happened
// //         setError('Error setting up request. Please try again.');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleClose = () => {
// //     // Reset form and errors when closing
// //     setError('');
// //     setDateError('');
// //     onClose(false); // Pass false when cancelled
// //   };

// //   return (
// //     <Dialog 
// //       open={open} 
// //       onClose={handleClose} 
// //       maxWidth="md" 
// //       fullWidth
// //       PaperProps={{
// //         sx: { borderRadius: 2 }
// //       }}
// //     >
// //       <DialogTitle sx={{ 
// //         borderBottom: '1px solid #E0E0E0', 
// //         pb: 2,
// //         backgroundColor: '#F8FAFC'
// //       }}>
// //         <div style={{ 
// //           fontSize: '20px', 
// //           fontWeight: '600', 
// //           color: '#101010',
// //           paddingTop: '8px'
// //         }}>
// //           Edit Leave Request
// //         </div>
// //       </DialogTitle>
      
// //       <DialogContent sx={{ pt: 3 }}>
// //         <LocalizationProvider dateAdapter={AdapterDateFns}>
// //           <Stack spacing={3}>
// //             {/* Add padding from top for the first field */}
// //             <div style={{ marginTop: '16px' }}>
// //               <FormControl fullWidth required>
// //                 <InputLabel id="leave-type-label">Leave Type</InputLabel>
// //                 <Select
// //                   labelId="leave-type-label"
// //                   name="leaveTypeId"
// //                   value={formData.leaveTypeId}
// //                   onChange={handleChange}
// //                   label="Leave Type"
// //                   disabled={loading || fetchLoading}
// //                   sx={{
// //                     borderRadius: 1,
// //                   }}
// //                 >
// //                   {fetchLoading ? (
// //                     <MenuItem disabled>
// //                       <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
// //                     </MenuItem>
// //                   ) : (
// //                     leaveTypes.map((type) => (
// //                       <MenuItem key={type._id} value={type._id}>
// //                         {type.Name} (Max: {type.MaxDaysPerYear} days)
// //                       </MenuItem>
// //                     ))
// //                   )}
// //                 </Select>
// //               </FormControl>
// //             </div>
            
// //             <Grid container spacing={2}>
// //               <Grid item xs={12} sm={6}>
// //                 <DatePicker
// //                   label="Start Date *"
// //                   value={formData.startDate}
// //                   onChange={(date) => handleDateChange('startDate', date)}
// //                   disabled={loading}
// //                   slotProps={{
// //                     textField: {
// //                       fullWidth: true,
// //                       required: true,
// //                       error: !!dateError,
// //                       sx: {
// //                         '& .MuiOutlinedInput-root': {
// //                           borderRadius: 1,
// //                         }
// //                       }
// //                     }
// //                   }}
// //                 />
// //               </Grid>
              
// //               <Grid item xs={12} sm={6}>
// //                 <DatePicker
// //                   label="End Date *"
// //                   value={formData.endDate}
// //                   onChange={(date) => handleDateChange('endDate', date)}
// //                   disabled={loading}
// //                   slotProps={{
// //                     textField: {
// //                       fullWidth: true,
// //                       required: true,
// //                       error: !!dateError,
// //                       sx: {
// //                         '& .MuiOutlinedInput-root': {
// //                           borderRadius: 1,
// //                         }
// //                       }
// //                     }
// //                   }}
// //                 />
// //               </Grid>
// //             </Grid>
            
// //             {dateError && (
// //               <Alert severity="warning" sx={{ borderRadius: 1 }}>
// //                 {dateError}
// //               </Alert>
// //             )}
            
// //             <TextField
// //               fullWidth
// //               label="Reason for Leave *"
// //               name="reason"
// //               value={formData.reason}
// //               onChange={handleChange}
// //               multiline
// //               rows={1}
// //               required
// //               error={!!error && (error.includes('Reason') || error.includes('reason'))}
// //               helperText={error && (error.includes('Reason') || error.includes('reason')) ? error : ''}
// //               disabled={loading}
// //               size="medium"
// //               variant="outlined"
// //               placeholder="Please provide detailed reason for leave"
// //               sx={{
// //                 '& .MuiOutlinedInput-root': {
// //                   borderRadius: 1,
// //                 }
// //               }}
// //             />
            
// //             <Grid container spacing={2}>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   fullWidth
// //                   label="Contact Number *"
// //                   name="contactNumber"
// //                   value={formData.contactNumber}
// //                   onChange={handleChange}
// //                   required
// //                   error={!!error && error.includes('contact')}
// //                   helperText={error && error.includes('contact') ? error : 'Enter 10-digit mobile number'}
// //                   disabled={loading}
// //                   size="medium"
// //                   variant="outlined"
// //                   placeholder="9876543210"
// //                   inputProps={{
// //                     maxLength: 10,
// //                     pattern: '[0-9]*'
// //                   }}
// //                   sx={{
// //                     '& .MuiOutlinedInput-root': {
// //                       borderRadius: 1,
// //                     }
// //                   }}
// //                 />
// //               </Grid>
              
// //               <Grid item xs={12} sm={6}>
// //                 {/* Empty grid item for spacing if needed */}
// //               </Grid>
// //             </Grid>

// //             {/* Address field - Full width */}
// //             <TextField
// //               fullWidth
// //               label="Address During Leave *"
// //               name="addressDuringLeave"
// //               value={formData.addressDuringLeave}
// //               onChange={handleChange}
// //               multiline
// //               rows={1}
// //               required
// //               error={!!error && error.includes('Address')}
// //               helperText={error && error.includes('Address') ? error : 'Enter your complete address during leave'}
// //               disabled={loading}
// //               size="medium"
// //               variant="outlined"
// //               placeholder="House/Flat No., Street, Area, City, State - PIN Code"
// //               sx={{
// //                 '& .MuiOutlinedInput-root': {
// //                   borderRadius: 1,
// //                 },
// //                 mt: 1
// //               }}
// //             />
            
// //             {error && !error.includes('Reason') && !error.includes('contact') && !error.includes('Address') && !dateError && (
// //               <Alert 
// //                 severity="error" 
// //                 sx={{ 
// //                   borderRadius: 1,
// //                   '& .MuiAlert-icon': {
// //                     alignItems: 'center'
// //                   }
// //                 }}
// //               >
// //                 {error}
// //               </Alert>
// //             )}
// //           </Stack>
// //         </LocalizationProvider>
// //       </DialogContent>
      
// //       <DialogActions sx={{ 
// //         px: 3, 
// //         pb: 3, 
// //         borderTop: '1px solid #E0E0E0', 
// //         pt: 2,
// //         backgroundColor: '#F8FAFC'
// //       }}>
// //         <Button 
// //           variant="contained"
// //           onClick={handleClose}
// //           disabled={loading}
// //           startIcon={<CloseSharp />}
// //           sx={{
// //             borderRadius: 1,
// //             px: 3,
// //             py: 1,
// //             textTransform: 'none',
// //             fontWeight: 500,
// //             backgroundColor: '#9e9e9e',
// //             '&:hover': {
// //               backgroundColor: '#757575'
// //             }
// //           }}
// //         >
// //           Cancel
// //         </Button>
        
// //         <Button
// //           variant="contained"
// //           onClick={handleSubmit}
// //           disabled={loading || fetchLoading}
// //           startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
// //           sx={{
// //             borderRadius: 1,
// //             px: 3,
// //             py: 1,
// //             textTransform: 'none',
// //             fontWeight: 500,
// //             backgroundColor: '#1976D2',
// //             '&:hover': {
// //               backgroundColor: '#1565C0'
// //             },
// //             minWidth: '140px'
// //           }}
// //         >
// //           {loading ? 'Updating...' : 'Update Leave'}
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default EditLeave;

// import React, { useState, useEffect } from 'react';
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
//   Box,
//   Autocomplete,
//   CircularProgress
// } from '@mui/material';
// import { Edit as EditIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Color constants matching EditProcess.jsx
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

// const EditLeave = ({ open, onClose, leaveData, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     leaveTypeId: '',
//     startDate: '',
//     endDate: '',
//     reason: '',
//     contactNumber: '',
//     addressDuringLeave: ''
//   });
  
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [selectedLeaveType, setSelectedLeaveType] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [contactError, setContactError] = useState('');

//   // Fetch leave types when component mounts
//   useEffect(() => {
//     if (open) {
//       fetchLeaveTypes();
//     }
//   }, [open]);

//   // Set form data when leaveData changes
//   useEffect(() => {
//     if (leaveData) {
//       // Format dates to YYYY-MM-DD for input fields
//       const formatDateForInput = (date) => {
//         if (!date) return '';
//         const d = new Date(date);
//         const year = d.getFullYear();
//         const month = String(d.getMonth() + 1).padStart(2, '0');
//         const day = String(d.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//       };

//       const startDate = leaveData.StartDate || leaveData.startDate;
//       const endDate = leaveData.EndDate || leaveData.endDate;
//       const leaveType = leaveData.LeaveTypeID || leaveData.leaveTypeId;
      
//       setFormData({
//         leaveTypeId: leaveType?._id || leaveType || '',
//         startDate: startDate ? formatDateForInput(startDate) : '',
//         endDate: endDate ? formatDateForInput(endDate) : '',
//         reason: leaveData.Reason || leaveData.reason || '',
//         contactNumber: leaveData.ContactNumber || leaveData.contactNumber || '',
//         addressDuringLeave: leaveData.AddressDuringLeave || leaveData.addressDuringLeave || ''
//       });

//       // Set selected leave type
//       if (leaveType) {
//         const leaveTypeObj = leaveTypes.find(type => type._id === (leaveType._id || leaveType));
//         setSelectedLeaveType(leaveTypeObj || null);
//       }
//     }
//   }, [leaveData, leaveTypes]);

//   const fetchLeaveTypes = async () => {
//     setFetchLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/leavetypes`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.data.success) {
//         const activeTypes = (response.data.data || []).filter(t => t.IsActive);
//         setLeaveTypes(activeTypes);
//       }
//     } catch (err) {
//       console.error('Error fetching leave types:', err);
//       setError('Failed to load leave types');
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   /* ================= CONTACT NUMBER VALIDATION ================= */
//   const validateContactNumber = (number) => {
//     // Remove any non-digit characters for validation
//     const cleaned = number.toString().replace(/\D/g, '');
    
//     if (cleaned.length === 0) {
//       setContactError("Contact number is required");
//       return false;
//     }
    
//     // Check if it's exactly 10 digits and contains only numbers
//     const isValid = /^\d{10}$/.test(cleaned);
    
//     if (!isValid) {
//       setContactError("Contact number must be exactly 10 digits");
//       return false;
//     } else {
//       setContactError("");
//       return true;
//     }
//   };

//   const handleContactChange = (e) => {
//     const value = e.target.value;
//     // Allow only numeric input
//     const numericValue = value.replace(/[^\d]/g, '');
    
//     // Limit to 10 digits
//     const limitedValue = numericValue.slice(0, 10);
    
//     setFormData({ ...formData, contactNumber: limitedValue });
//     if (limitedValue) {
//       validateContactNumber(limitedValue);
//     } else {
//       setContactError("Contact number is required");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear general error when user starts typing
//     if (error) {
//       setError('');
//     }
//   };

//   const handleLeaveTypeChange = (event, newValue) => {
//     setSelectedLeaveType(newValue);
//     setFormData(prev => ({
//       ...prev,
//       leaveTypeId: newValue?._id || ''
//     }));
//     if (error) setError('');
//   };

//   const calculateDays = () => {
//     if (formData.startDate && formData.endDate) {
//       const from = new Date(formData.startDate);
//       const to = new Date(formData.endDate);
//       const diffTime = Math.abs(to - from);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//       return diffDays;
//     }
//     return null;
//   };

//   const validate = () => {
//     if (!formData.leaveTypeId) {
//       setError('Leave Type is required');
//       return false;
//     }

//     if (!formData.startDate) {
//       setError('Start Date is required');
//       return false;
//     }

//     if (!formData.endDate) {
//       setError('End Date is required');
//       return false;
//     }

//     // Compare dates
//     const fromDateParts = formData.startDate.split('-').map(Number);
//     const toDateParts = formData.endDate.split('-').map(Number);
    
//     const fromDateObj = new Date(fromDateParts[0], fromDateParts[1] - 1, fromDateParts[2]);
//     const toDateObj = new Date(toDateParts[0], toDateParts[1] - 1, toDateParts[2]);
    
//     if (fromDateObj > toDateObj) {
//       setError("End Date must be after Start Date");
//       return false;
//     }

//     if (!formData.reason.trim()) {
//       setError('Reason is required');
//       return false;
//     }

//     if (formData.reason.trim().length < 10) {
//       setError('Reason must be at least 10 characters');
//       return false;
//     }

//     if (!formData.contactNumber.trim()) {
//       setError('Contact number is required');
//       return false;
//     }

//     if (!validateContactNumber(formData.contactNumber)) {
//       setError('Please enter a valid 10-digit contact number');
//       return false;
//     }

//     if (!formData.addressDuringLeave.trim()) {
//       setError('Address during leave is required');
//       return false;
//     }

//     if (formData.addressDuringLeave.trim().length < 10) {
//       setError('Address must be at least 10 characters');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');

//       const submitData = {
//         leaveTypeId: formData.leaveTypeId,
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//         reason: formData.reason.trim(),
//         contactNumber: formData.contactNumber.trim(),
//         addressDuringLeave: formData.addressDuringLeave.trim()
//       };

//       const response = await axios.put(
//         `${BASE_URL}/api/leaves/${leaveData._id || leaveData.id}`,
//         submitData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         if (onUpdate && typeof onUpdate === 'function') {
//           onUpdate(response.data.data);
//         }
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to update leave request');
//       }
//     } catch (err) {
//       console.error('Error updating leave:', err);
      
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

//   const handleClose = () => {
//     setError('');
//     setContactError('');
//     onClose();
//   };

//   const today = new Date().toISOString().split("T")[0];

//   const getMinToDate = () => {
//     if (formData.startDate) {
//       return formData.startDate;
//     }
//     return today;
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
//         mb: 1.5,
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
//           Edit Leave Request
//         </Typography>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5 }}>
//         <Stack spacing={2}>
//           <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
//             {/* Leave Type Field - Using Autocomplete */}
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
//                   LEAVE TYPE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <Autocomplete
//                   fullWidth
//                   options={leaveTypes}
//                   getOptionLabel={(option) => option.Name || ""}
//                   value={selectedLeaveType}
//                   onChange={handleLeaveTypeChange}
//                   disabled={loading || fetchLoading}
//                   loading={fetchLoading}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Select leave type"
//                       required
//                       error={!!error && error.includes('Leave Type')}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                           '&:hover fieldset': { borderColor: COLORS.primary },
//                           '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
//                         },
//                         '& .MuiInputBase-input': {
//                           py: 1,
//                           px: 1.5,
//                           fontSize: '0.75rem',
//                           color: COLORS.text.primary
//                         }
//                       }}
//                     />
//                   )}
//                   renderOption={(props, option) => (
//                     <li {...props}>
//                       <Box>
//                         <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                           {option.Name}
//                         </Typography>
//                         <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                           Max: {option.MaxDaysPerYear} days/year
//                         </Typography>
//                       </Box>
//                     </li>
//                   )}
//                   ListboxProps={{
//                     sx: {
//                       '& .MuiAutocomplete-option': {
//                         fontSize: '0.75rem',
//                         py: 1,
//                         px: 1.5
//                       }
//                     }
//                   }}
//                   noOptionsText="No leave types available"
//                 />
//               </Box>
//             </Box>

//             {/* Start Date Field */}
//             <Box sx={{ gridColumn: 'span 1' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   START DATE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   type="date"
//                   fullWidth
//                   value={formData.startDate}
//                   onChange={(e) => {
//                     setFormData({ ...formData, startDate: e.target.value });
//                     if (error) setError('');
//                   }}
//                   disabled={loading}
//                   size="small"
//                   variant="outlined"
//                   InputLabelProps={{ shrink: true }}
//                   inputProps={{
//                     min: today
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
//               </Box>
//             </Box>

//             {/* End Date Field */}
//             <Box sx={{ gridColumn: 'span 1' }}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '0.7rem',
//                     fontWeight: 600,
//                     color: COLORS.text.secondary,
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   END DATE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   type="date"
//                   fullWidth
//                   value={formData.endDate}
//                   onChange={(e) => {
//                     setFormData({ ...formData, endDate: e.target.value });
//                     if (error) setError('');
//                   }}
//                   disabled={loading}
//                   size="small"
//                   variant="outlined"
//                   InputLabelProps={{ shrink: true }}
//                   inputProps={{
//                     min: getMinToDate()
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
//               </Box>
//             </Box>

//             {/* Reason Field */}
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
//                   REASON <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={3}
//                   name="reason"
//                   value={formData.reason}
//                   onChange={handleChange}
//                   disabled={loading}
//                   placeholder="Please provide detailed reason for leave (minimum 10 characters)"
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

//             {/* Contact Number Field with Validation */}
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
//                   CONTACT NUMBER <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   value={formData.contactNumber}
//                   onChange={handleContactChange}
//                   disabled={loading}
//                   placeholder="Enter 10-digit mobile number"
//                   size="small"
//                   variant="outlined"
//                   error={!!contactError}
//                   helperText={contactError || "Required field - 10 digits only"}
//                   inputProps={{
//                     maxLength: 10,
//                     pattern: "[0-9]*"
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
//               </Box>
//             </Box>

//             {/* Address During Leave Field */}
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
//                   ADDRESS DURING LEAVE <span style={{ color: '#EF4444' }}>*</span>
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={2}
//                   name="addressDuringLeave"
//                   value={formData.addressDuringLeave}
//                   onChange={handleChange}
//                   disabled={loading}
//                   placeholder="Enter your complete address during leave (minimum 10 characters)"
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

//             {/* Leave Information Preview */}
//             {(formData.startDate || formData.endDate || selectedLeaveType) && (
//               <Box sx={{ 
//                 gridColumn: 'span 2',
//                 p: 2, 
//                 bgcolor: COLORS.primaryLight, 
//                 borderRadius: 1.5,
//                 border: `1px solid ${COLORS.primary}`,
//                 mt: 1
//               }}>
//                 <Typography 
//                   variant="subtitle2" 
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: COLORS.primaryDark, 
//                     mb: 1.5,
//                     fontSize: '0.8rem'
//                   }}
//                 >
//                   Leave Information
//                 </Typography>
//                 <Stack spacing={1}>
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Leave Type:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {selectedLeaveType?.Name || 'Not selected'}
//                     </Typography>
//                   </Stack>
                  
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Leave Period:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {formData.startDate && formData.endDate 
//                         ? `${formData.startDate} to ${formData.endDate}`
//                         : formData.startDate 
//                           ? `From ${formData.startDate}`
//                           : formData.endDate 
//                             ? `Until ${formData.endDate}`
//                             : 'Not specified'}
//                     </Typography>
//                   </Stack>
                  
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Days:</Typography>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                       {calculateDays() ? `${calculateDays()} day(s)` : 'Not calculated'}
//                     </Typography>
//                   </Stack>

//                   {selectedLeaveType && selectedLeaveType.MaxDaysPerYear && (
//                     <Stack direction="row" justifyContent="space-between">
//                       <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Max Days/Year:</Typography>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                         {selectedLeaveType.MaxDaysPerYear} days
//                       </Typography>
//                     </Stack>
//                   )}

//                   {formData.contactNumber && !contactError && (
//                     <Stack direction="row" justifyContent="space-between">
//                       <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Contact Number:</Typography>
//                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
//                         {formData.contactNumber}
//                       </Typography>
//                     </Stack>
//                   )}
//                 </Stack>
//               </Box>
//             )}
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
//           disabled={loading || fetchLoading || !formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason || !!contactError || !formData.contactNumber || !formData.addressDuringLeave}
//           startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
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
//           {loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : 'Update Leave'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditLeave;







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
  Box,
  Autocomplete,
  CircularProgress,
  Tooltip,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import AddLeaveType from '../leavetypemaster/AddLeaveTypes';


// Color constants matching EditProcess.jsx
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

const EditLeave = ({ open, onClose, leaveData, onUpdate }) => {
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
    contactNumber: '',
    addressDuringLeave: ''
  });
  
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactError, setContactError] = useState('');
  
  // State for Add Leave Type dialog
  const [addLeaveTypeOpen, setAddLeaveTypeOpen] = useState(false);

  // Fetch leave types when component mounts
  useEffect(() => {
    if (open) {
      fetchLeaveTypes();
    }
  }, [open]);

  // Set form data when leaveData changes
  useEffect(() => {
    if (leaveData && leaveTypes.length > 0) {
      // Format dates to YYYY-MM-DD for input fields
      const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDate = leaveData.StartDate || leaveData.startDate;
      const endDate = leaveData.EndDate || leaveData.endDate;
      const leaveType = leaveData.LeaveTypeID || leaveData.leaveTypeId;
      
      setFormData({
        leaveTypeId: leaveType?._id || leaveType || '',
        startDate: startDate ? formatDateForInput(startDate) : '',
        endDate: endDate ? formatDateForInput(endDate) : '',
        reason: leaveData.Reason || leaveData.reason || '',
        contactNumber: leaveData.ContactNumber || leaveData.contactNumber || '',
        addressDuringLeave: leaveData.AddressDuringLeave || leaveData.addressDuringLeave || ''
      });

      // Set selected leave type
      if (leaveType) {
        const leaveTypeObj = leaveTypes.find(type => type._id === (leaveType._id || leaveType));
        setSelectedLeaveType(leaveTypeObj || null);
      }
    }
  }, [leaveData, leaveTypes]);

  const fetchLeaveTypes = async () => {
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/leavetypes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const activeTypes = (response.data.data || []).filter(t => t.IsActive !== false);
        setLeaveTypes(activeTypes);
      }
    } catch (err) {
      console.error('Error fetching leave types:', err);
      setError('Failed to load leave types');
    } finally {
      setFetchLoading(false);
    }
  };

  /* ================= CONTACT NUMBER VALIDATION ================= */
  const validateContactNumber = (number) => {
    // Remove any non-digit characters for validation
    const cleaned = number.toString().replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      setContactError("Contact number is required");
      return false;
    }
    
    // Check if it's exactly 10 digits and contains only numbers
    const isValid = /^\d{10}$/.test(cleaned);
    
    if (!isValid) {
      setContactError("Contact number must be exactly 10 digits");
      return false;
    } else {
      setContactError("");
      return true;
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value;
    // Allow only numeric input
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Limit to 10 digits
    const limitedValue = numericValue.slice(0, 10);
    
    setFormData({ ...formData, contactNumber: limitedValue });
    if (limitedValue) {
      validateContactNumber(limitedValue);
    } else {
      setContactError("Contact number is required");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleLeaveTypeChange = (event, newValue) => {
    setSelectedLeaveType(newValue);
    setFormData(prev => ({
      ...prev,
      leaveTypeId: newValue?._id || ''
    }));
    if (error) setError('');
  };

  const handleLeaveTypeAdded = (newLeaveType) => {
    setLeaveTypes(prev => [...prev, newLeaveType]);
    // Auto-select the newly added leave type
    setSelectedLeaveType(newLeaveType);
    setFormData(prev => ({
      ...prev,
      leaveTypeId: newLeaveType._id
    }));
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const from = new Date(formData.startDate);
      const to = new Date(formData.endDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return null;
  };

  const validate = () => {
    if (!formData.leaveTypeId) {
      setError('Leave Type is required');
      return false;
    }

    if (!formData.startDate) {
      setError('Start Date is required');
      return false;
    }

    if (!formData.endDate) {
      setError('End Date is required');
      return false;
    }

    // Compare dates
    const fromDateParts = formData.startDate.split('-').map(Number);
    const toDateParts = formData.endDate.split('-').map(Number);
    
    const fromDateObj = new Date(fromDateParts[0], fromDateParts[1] - 1, fromDateParts[2]);
    const toDateObj = new Date(toDateParts[0], toDateParts[1] - 1, toDateParts[2]);
    
    if (fromDateObj > toDateObj) {
      setError("End Date must be after Start Date");
      return false;
    }

    if (!formData.reason.trim()) {
      setError('Reason is required');
      return false;
    }

    if (formData.reason.trim().length < 10) {
      setError('Reason must be at least 10 characters');
      return false;
    }

    if (!formData.contactNumber.trim()) {
      setError('Contact number is required');
      return false;
    }

    if (!validateContactNumber(formData.contactNumber)) {
      setError('Please enter a valid 10-digit contact number');
      return false;
    }

    if (!formData.addressDuringLeave.trim()) {
      setError('Address during leave is required');
      return false;
    }

    if (formData.addressDuringLeave.trim().length < 10) {
      setError('Address must be at least 10 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const submitData = {
        leaveTypeId: formData.leaveTypeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
        contactNumber: formData.contactNumber.trim(),
        addressDuringLeave: formData.addressDuringLeave.trim()
      };

      const response = await axios.put(
        `${BASE_URL}/api/leaves/${leaveData._id || leaveData.id}`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        if (onUpdate && typeof onUpdate === 'function') {
          onUpdate(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || 'Failed to update leave request');
      }
    } catch (err) {
      console.error('Error updating leave:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 
                err.response.data?.error || 
                `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error setting up request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setContactError('');
    onClose();
  };

  // Input styles
  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      backgroundColor: COLORS.background.white,
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
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const today = new Date().toISOString().split("T")[0];

  const getMinToDate = () => {
    if (formData.startDate) {
      return formData.startDate;
    }
    return today;
  };

  return (
    <>
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
          mb: 1.5,
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
            Edit Leave Request
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {/* Leave Type Field with Add Button */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={labelStyle}>
                      LEAVE TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Tooltip title="Add New Leave Type">
                      <IconButton
                        size="small"
                        onClick={() => setAddLeaveTypeOpen(true)}
                        disabled={loading}
                        sx={{
                          color: COLORS.primary,
                          '&:hover': {
                            bgcolor: COLORS.primaryLight
                          }
                        }}
                      >
                        <AddIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Autocomplete
                    fullWidth
                    options={leaveTypes}
                    getOptionLabel={(option) => option.Name || ""}
                    value={selectedLeaveType}
                    onChange={handleLeaveTypeChange}
                    loading={fetchLoading}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Search leave type..."
                        required
                        error={!!error && error.includes('Leave Type')}
                        sx={inputStyle}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <>
                              {fetchLoading && <CircularProgress size={16} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {option.Name}
                          </Typography>
                          {option.MaxDaysPerYear && (
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Max: {option.MaxDaysPerYear} days/year
                            </Typography>
                          )}
                        </Box>
                      </li>
                    )}
                    ListboxProps={{
                      sx: {
                        maxHeight: 250,
                        '& .MuiAutocomplete-option': {
                          fontSize: '0.75rem',
                          py: 1,
                          px: 1.5
                        }
                      }
                    }}
                    noOptionsText="No leave types available. Click + to add."
                  />
                </Box>
              </Box>

              {/* Start Date Field */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    START DATE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    value={formData.startDate}
                    onChange={(e) => {
                      setFormData({ ...formData, startDate: e.target.value });
                      if (error) setError('');
                    }}
                    disabled={loading}
                    size="small"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: today
                    }}
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* End Date Field */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    END DATE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData({ ...formData, endDate: e.target.value });
                      if (error) setError('');
                    }}
                    disabled={loading}
                    size="small"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: getMinToDate()
                    }}
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* Reason Field */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    REASON <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Please provide detailed reason for leave (minimum 10 characters)"
                    size="small"
                    variant="outlined"
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* Contact Number Field with Validation */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    CONTACT NUMBER <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.contactNumber}
                    onChange={handleContactChange}
                    disabled={loading}
                    placeholder="Enter 10-digit mobile number"
                    size="small"
                    variant="outlined"
                    error={!!contactError}
                    helperText={contactError || "Required field - 10 digits only"}
                    inputProps={{
                      maxLength: 10,
                      pattern: "[0-9]*"
                    }}
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* Address During Leave Field */}
              <Box sx={{ gridColumn: 'span 2' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={labelStyle}>
                    ADDRESS DURING LEAVE <span style={{ color: '#EF4444' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    name="addressDuringLeave"
                    value={formData.addressDuringLeave}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter your complete address during leave (minimum 10 characters)"
                    size="small"
                    variant="outlined"
                    sx={inputStyle}
                  />
                </Box>
              </Box>

              {/* Leave Information Preview */}
              {(formData.startDate || formData.endDate || selectedLeaveType) && (
                <Box sx={{ 
                  gridColumn: 'span 2',
                  p: 2, 
                  bgcolor: COLORS.primaryLight, 
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.primary}`,
                  mt: 1
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: COLORS.primaryDark, 
                      mb: 1.5,
                      fontSize: '0.8rem'
                    }}
                  >
                    Leave Information
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Leave Type:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {selectedLeaveType?.Name || 'Not selected'}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Leave Period:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {formData.startDate && formData.endDate 
                          ? `${formData.startDate} to ${formData.endDate}`
                          : formData.startDate 
                            ? `From ${formData.startDate}`
                            : formData.endDate 
                              ? `Until ${formData.endDate}`
                              : 'Not specified'}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Total Days:</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {calculateDays() ? `${calculateDays()} day(s)` : 'Not calculated'}
                      </Typography>
                    </Stack>

                    {selectedLeaveType && selectedLeaveType.MaxDaysPerYear && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Max Days/Year:</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {selectedLeaveType.MaxDaysPerYear} days
                        </Typography>
                      </Stack>
                    )}

                    {formData.contactNumber && !contactError && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Contact Number:</Typography>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {formData.contactNumber}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              )}
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
            disabled={loading || fetchLoading || !formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason || !!contactError || !formData.contactNumber || !formData.addressDuringLeave}
            startIcon={loading ? null : <EditIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : 'Update Leave'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Leave Type Dialog */}
      <AddLeaveType
        open={addLeaveTypeOpen}
        onClose={() => setAddLeaveTypeOpen(false)}
        onAdd={handleLeaveTypeAdded}
      />
    </>
  );
};

export default EditLeave;