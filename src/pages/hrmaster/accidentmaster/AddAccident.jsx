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
//   MenuItem,
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   Typography,
//   Autocomplete,
//   Paper,
//   InputAdornment,
//   styled
// } from '@mui/material';
// import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Custom styled Paper component for dropdown without scrollbars
// const CustomPaper = styled(Paper)({
//   maxHeight: 200,
//   overflow: 'auto',
//   '&::-webkit-scrollbar': {
//     display: 'none'  // Hide scrollbar for Chrome/Safari/Edge
//   },
//   scrollbarWidth: 'none',  // Hide scrollbar for Firefox
//   '-ms-overflow-style': 'none',  // Hide scrollbar for IE
//   // Ensure no nested elements create scrollbars
//   '& .MuiAutocomplete-listbox': {
//     '&::-webkit-scrollbar': {
//       display: 'none'
//     },
//     scrollbarWidth: 'none',
//     '-ms-overflow-style': 'none'
//   }
// });

// // Custom styled MenuProps for Select components
// const selectMenuProps = {
//   PaperProps: {
//     sx: {
//       maxHeight: 200,
//       overflow: 'auto',
//       '&::-webkit-scrollbar': {
//         display: 'none'
//       },
//       scrollbarWidth: 'none',
//       '-ms-overflow-style': 'none'
//     }
//   }
// };

// const AddAccident = ({ open, onClose, onAdd }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     employee: '',
//     date: '',
//     location: '',
//     department: '',
//     machineId: '',
//     machineName: '',
//     injuryType: 'Cut',
//     bodyPartAffected: '',
//     severity: 'Minor',
//     description: '',
//     immediateAction: '',
//     rootCause: '',
//     reportedBy: '',
//     lostDays: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // Data fetching states
//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [fetchingData, setFetchingData] = useState(false);

//   // Search states for dropdowns
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [departmentSearch, setDepartmentSearch] = useState('');
//   const [userSearch, setUserSearch] = useState('');

//   // Enum options
//   const injuryTypeOptions = [
//     'Cut', 'Burn', 'Fracture', 'Sprain', 'Electric Shock', 
//     'Eye Injury', 'Hearing Loss', 'Respiratory', 'Chemical Exposure', 'Other'
//   ];

//   const severityOptions = ['Minor', 'Moderate', 'Major', 'Fatal'];

//   const steps = [
//     'Basic Information',
//     'Incident Details',
//     'Actions & Follow-up'
//   ];

//   // Fetch employees, departments, and users when dialog opens
//   useEffect(() => {
//     if (open) {
//       fetchEmployees();
//       fetchDepartments();
//       fetchUsers();
//     }
//   }, [open]);

//   const fetchEmployees = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/employees`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setEmployees(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching employees:', err);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/departments`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setDepartments(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching departments:', err);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/users`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         const usersData = response.data.data.users || [];
//         setUsers(usersData);
//       }
//     } catch (err) {
//       console.error('Error fetching users:', err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Custom handler for Autocomplete components
//   const handleAutocompleteChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async () => {
//     // Validation
//     if (!formData.employee) return setError('Employee is required');
//     if (!formData.date) return setError('Date is required');
//     if (!formData.location.trim()) return setError('Location is required');
//     if (!formData.department) return setError('Department is required');
//     if (!formData.injuryType) return setError('Injury type is required');
//     if (!formData.severity) return setError('Severity is required');

//     const lostDaysNum = parseInt(formData.lostDays || 0, 10);
//     if (isNaN(lostDaysNum) || lostDaysNum < 0) {
//       return setError('Lost days must be 0 or positive number');
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const lostDaysNum = parseInt(formData.lostDays || 0, 10);

//       const response = await axios.post(
//         `${BASE_URL}/api/safety/accidents`,
//         {
//           ...formData,
//           lostDays: lostDaysNum
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         onAdd(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         setError(response.data.message || 'Failed to add accident');
//       }
//     } catch (err) {
//       console.error('Error adding accident:', err);
//       setError(
//         err.response?.data?.message ||
//         'Failed to add accident. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       employee: '',
//       date: '',
//       location: '',
//       department: '',
//       machineId: '',
//       machineName: '',
//       injuryType: 'Cut',
//       bodyPartAffected: '',
//       severity: 'Minor',
//       description: '',
//       immediateAction: '',
//       rootCause: '',
//       reportedBy: '',
//       lostDays: ''
//     });
//     setError('');
//     setActiveStep(0);
//     setEmployeeSearch('');
//     setDepartmentSearch('');
//     setUserSearch('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const handleNext = () => {
//     // Basic validation for step 1
//     if (activeStep === 0) {
//       if (!formData.employee) return setError('Employee is required');
//       if (!formData.date) return setError('Date is required');
//       if (!formData.location.trim()) return setError('Location is required');
//       if (!formData.department) return setError('Department is required');
//     }
    
//     // Validation for step 2
//     if (activeStep === 1) {
//       if (!formData.injuryType) return setError('Injury type is required');
//       if (!formData.severity) return setError('Severity is required');
      
//       const lostDaysNum = parseInt(formData.lostDays || 0, 10);
//       if (isNaN(lostDaysNum) || lostDaysNum < 0) {
//         return setError('Lost days must be 0 or positive number');
//       }
//     }

//     setError('');
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setError('');
//     setActiveStep((prev) => prev - 1);
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={3} sx={{ mt: 2 }}>
//             {/* First Row - Employee and Date/Time */}
//             <Stack direction="row" spacing={2}>
//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={employees}
//                   getOptionLabel={(option) => {
//                     if (typeof option === 'string') return option;
//                     return `${option.FirstName || ''} ${option.LastName || ''} (${option.EmployeeID || ''})`;
//                   }}
//                   value={employees.find(emp => emp._id === formData.employee) || null}
//                   onChange={(event, newValue) => {
//                     handleAutocompleteChange('employee', newValue?._id || '');
//                   }}
//                   onInputChange={(event, newInputValue) => {
//                     setEmployeeSearch(newInputValue);
//                   }}
//                   loading={fetchingData}
//                   disabled={loading}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Employee *"
//                       required
//                       InputProps={{
//                         ...params.InputProps,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <SearchIcon />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   )}
//                   PaperComponent={CustomPaper}
//                   ListboxProps={{
//                     style: {
//                       maxHeight: 200,
//                       overflow: 'auto',
//                       scrollbarWidth: 'none',
//                       msOverflowStyle: 'none',
//                       '&::-webkit-scrollbar': {
//                         display: 'none'
//                       }
//                     }
//                   }}
//                   noOptionsText="No employees found"
//                   isOptionEqualToValue={(option, value) => option._id === value._id}
//                 />
//               </FormControl>

//               <TextField
//                 fullWidth
//                 label="Date & Time *"
//                 name="date"
//                 type="datetime-local"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//                 InputLabelProps={{ shrink: true }}
//                 disabled={loading}
//               />
//             </Stack>

//             {/* Second Row - Location and Department */}
//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Location *"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />

//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={departments}
//                   getOptionLabel={(option) => {
//                     if (typeof option === 'string') return option;
//                     return option.DepartmentName || '';
//                   }}
//                   value={departments.find(dept => dept._id === formData.department) || null}
//                   onChange={(event, newValue) => {
//                     handleAutocompleteChange('department', newValue?._id || '');
//                   }}
//                   onInputChange={(event, newInputValue) => {
//                     setDepartmentSearch(newInputValue);
//                   }}
//                   loading={fetchingData}
//                   disabled={loading}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Department *"
//                       required
//                       InputProps={{
//                         ...params.InputProps,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <SearchIcon />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   )}
//                   PaperComponent={CustomPaper}
//                   ListboxProps={{
//                     style: {
//                       maxHeight: 200,
//                       overflow: 'auto',
//                       scrollbarWidth: 'none',
//                       msOverflowStyle: 'none',
//                       '&::-webkit-scrollbar': {
//                         display: 'none'
//                       }
//                     }
//                   }}
//                   noOptionsText="No departments found"
//                   isOptionEqualToValue={(option, value) => option._id === value._id}
//                 />
//               </FormControl>
//             </Stack>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={3} sx={{ mt: 2 }}>
//             {/* First Row - Machine ID and Machine Name */}
//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Machine ID"
//                 name="machineId"
//                 value={formData.machineId}
//                 onChange={handleChange}
//                 disabled={loading}
//               />
//               <TextField
//                 fullWidth
//                 label="Machine Name"
//                 name="machineName"
//                 value={formData.machineName}
//                 onChange={handleChange}
//                 disabled={loading}
//               />
//             </Stack>

//             {/* Second Row - Injury Type and Severity */}
//             <Stack direction="row" spacing={2}>
//               <FormControl fullWidth>
//                 <InputLabel>Injury Type *</InputLabel>
//                 <Select
//                   name="injuryType"
//                   value={formData.injuryType}
//                   onChange={handleChange}
//                   label="Injury Type *"
//                   required
//                   disabled={loading}
//                   MenuProps={selectMenuProps}
//                 >
//                   {injuryTypeOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl fullWidth>
//                 <InputLabel>Severity *</InputLabel>
//                 <Select
//                   name="severity"
//                   value={formData.severity}
//                   onChange={handleChange}
//                   label="Severity *"
//                   required
//                   disabled={loading}
//                   MenuProps={selectMenuProps}
//                 >
//                   {severityOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Stack>

//             {/* Third Row - Description (full width) */}
//             <TextField
//               fullWidth
//               label="Description"
//               name="description"
//               multiline
//               rows={4}
//               value={formData.description}
//               onChange={handleChange}
//               disabled={loading}
//             />

//             {/* Fourth Row - Body Part Affected and Lost Days */}
//             <Stack direction="row" spacing={2}>
//               <TextField
//                 fullWidth
//                 label="Body Part Affected"
//                 name="bodyPartAffected"
//                 value={formData.bodyPartAffected}
//                 onChange={handleChange}
//                 disabled={loading}
//               />
//               <TextField
//                 fullWidth
//                 label="Lost Days"
//                 name="lostDays"
//                 type="number"
//                 inputProps={{ min: 0 }}
//                 value={formData.lostDays}
//                 onChange={handleChange}
//                 disabled={loading}
//               />
//             </Stack>
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={3} sx={{ mt: 2 }}>
//             {/* First Row - Immediate Action (full width) */}
//             <TextField
//               fullWidth
//               label="Immediate Action Taken"
//               name="immediateAction"
//               multiline
//               rows={3}
//               value={formData.immediateAction}
//               onChange={handleChange}
//               disabled={loading}
//             />

//             {/* Second Row - Root Cause (full width) */}
//             <TextField
//               fullWidth
//               label="Root Cause"
//               name="rootCause"
//               multiline
//               rows={3}
//               value={formData.rootCause}
//               onChange={handleChange}
//               disabled={loading}
//             />

//             {/* Third Row - Reported By (full width) */}
//             <FormControl fullWidth>
//               <Autocomplete
//                 options={users}
//                 getOptionLabel={(option) => {
//                   if (typeof option === 'string') return option;
//                   const employeeInfo = option.EmployeeID 
//                     ? ` - ${option.EmployeeID.FirstName || ''} ${option.EmployeeID.LastName || ''}`
//                     : '';
//                   return `${option.Username || ''}${employeeInfo}`;
//                 }}
//                 value={users.find(user => user._id === formData.reportedBy) || null}
//                 onChange={(event, newValue) => {
//                   handleAutocompleteChange('reportedBy', newValue?._id || '');
//                 }}
//                 onInputChange={(event, newInputValue) => {
//                   setUserSearch(newInputValue);
//                 }}
//                 loading={fetchingData}
//                 disabled={loading}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Reported By (User)"
//                     InputProps={{
//                       ...params.InputProps,
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 )}
//                 PaperComponent={CustomPaper}
//                 ListboxProps={{
//                   style: {
//                     maxHeight: 200,
//                     overflow: 'auto',
//                     scrollbarWidth: 'none',
//                     msOverflowStyle: 'none',
//                     '&::-webkit-scrollbar': {
//                       display: 'none'
//                     }
//                   }
//                 }}
//                 noOptionsText="No users found"
//                 isOptionEqualToValue={(option, value) => option._id === value._id}
//               />
//             </FormControl>
//           </Stack>
//         );

//       default:
//         return 'Unknown step';
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 2 } }}
//     >
//       <DialogTitle sx={{
//         borderBottom: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC'
//       }}>
//         <div style={{
//           fontSize: '20px',
//           fontWeight: 600,
//           paddingTop: '8px'
//         }}>
//           Report New Accident / Incident
//         </div>
//       </DialogTitle>

//       <DialogContent sx={{ pt: 3 }}>
//         <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 1 }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
//             {error}
//           </Alert>
//         )}

//         <Box>
//           {getStepContent(activeStep)}
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 3,
//         py: 2,
//         borderTop: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC'
//       }}>
//         <Button onClick={handleClose} disabled={loading}>
//           Cancel
//         </Button>

//         <Box sx={{ flex: 1 }} />

//         <Button
//           disabled={activeStep === 0 || loading}
//           onClick={handleBack}
//         >
//           Back
//         </Button>

//         {activeStep === steps.length - 1 ? (
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//             startIcon={!loading && <AddIcon />}
//             sx={{
//               backgroundColor: '#1976D2',
//               '&:hover': { backgroundColor: '#1565C0' }
//             }}
//           >
//             {loading ? 'Submitting...' : 'Report Accident'}
//           </Button>
//         ) : (
//           <Button
//             variant="contained"
//             onClick={handleNext}
//             disabled={loading}
//           >
//             Next
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddAccident;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  InputAdornment,
  styled
} from '@mui/material';
import { 
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching AddVendor component
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

// Custom Paper component for Autocomplete without scrollbars
const CustomPaper = styled(Paper)({
  maxHeight: 200,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none',
  '& .MuiAutocomplete-listbox': {
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none'
  }
});

// Modern Stepper Connector with Primary Color
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: COLORS.primary,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const steps = ['Basic Information', 'Incident Details', 'Actions & Follow-up'];

// Validation helper functions
const validateDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const now = new Date();
  return selectedDate <= now; // Date cannot be in future
};

const validateLostDays = (days) => {
  if (!days) return true; // Optional field
  const numDays = Number(days);
  return !isNaN(numDays) && numDays >= 0 && Number.isInteger(numDays);
};

const AddAccident = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    employee: '',
    date: '',
    location: '',
    department: '',
    machineId: '',
    machineName: '',
    injuryType: 'Cut',
    bodyPartAffected: '',
    severity: 'Minor',
    description: '',
    immediateAction: '',
    rootCause: '',
    reportedBy: '',
    lostDays: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data fetching states
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Enum options
  const injuryTypeOptions = [
    'Cut', 'Burn', 'Fracture', 'Sprain', 'Electric Shock', 
    'Eye Injury', 'Hearing Loss', 'Respiratory', 'Chemical Exposure', 'Other'
  ];

  const severityOptions = ['Minor', 'Moderate', 'Major', 'Fatal'];

  // Fetch employees, departments, and users when dialog opens
  useEffect(() => {
    if (open) {
      fetchEmployees();
      fetchDepartments();
      fetchUsers();
    }
  }, [open]);

  const fetchEmployees = async () => {
    setFetchingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchDepartments = async () => {
    setFetchingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchUsers = async () => {
    setFetchingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const usersData = response.data.data.users || [];
        setUsers(usersData);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    // Handle specific field types
    if (name === 'lostDays') {
      // Only allow digits for lost days
      if (value === '' || /^\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAutocompleteChange = (name, value) => {
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    setFormData(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'employee':
        if (!value) {
          return 'Employee is required';
        }
        break;
      case 'date':
        if (!value) {
          return 'Date & time is required';
        } else if (!validateDate(value)) {
          return 'Date cannot be in the future';
        }
        break;
      case 'location':
        if (!value?.trim()) {
          return 'Location is required';
        }
        break;
      case 'department':
        if (!value) {
          return 'Department is required';
        }
        break;
      case 'injuryType':
        if (!value) {
          return 'Injury type is required';
        }
        break;
      case 'severity':
        if (!value) {
          return 'Severity is required';
        }
        break;
      case 'lostDays':
        if (value && !validateLostDays(value)) {
          return 'Lost days must be a positive whole number';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    switch (step) {
      case 0: // Basic Information
        // Employee
        if (!formData.employee) {
          errors.employee = 'Employee is required';
          isValid = false;
        }

        // Date
        if (!formData.date) {
          errors.date = 'Date & time is required';
          isValid = false;
        } else if (!validateDate(formData.date)) {
          errors.date = 'Date cannot be in the future';
          isValid = false;
        }

        // Location
        if (!formData.location?.trim()) {
          errors.location = 'Location is required';
          isValid = false;
        }

        // Department
        if (!formData.department) {
          errors.department = 'Department is required';
          isValid = false;
        }
        break;
      
      case 1: // Incident Details
        // Injury Type
        if (!formData.injuryType) {
          errors.injuryType = 'Injury type is required';
          isValid = false;
        }

        // Severity
        if (!formData.severity) {
          errors.severity = 'Severity is required';
          isValid = false;
        }

        // Lost Days (optional)
        if (formData.lostDays && !validateLostDays(formData.lostDays)) {
          errors.lostDays = 'Lost days must be a positive whole number';
          isValid = false;
        }
        break;
      
      case 2: // Actions & Follow-up
        // No required fields in this step
        break;
      
      default:
        return true;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fill in this section');
    }
    return isValid;
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    // Employee
    if (!formData.employee) {
      errors.employee = 'Employee is required';
      isValid = false;
    }

    // Date
    if (!formData.date) {
      errors.date = 'Date & time is required';
      isValid = false;
    } else if (!validateDate(formData.date)) {
      errors.date = 'Date cannot be in the future';
      isValid = false;
    }

    // Location
    if (!formData.location?.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }

    // Department
    if (!formData.department) {
      errors.department = 'Department is required';
      isValid = false;
    }

    // Injury Type
    if (!formData.injuryType) {
      errors.injuryType = 'Injury type is required';
      isValid = false;
    }

    // Severity
    if (!formData.severity) {
      errors.severity = 'Severity is required';
      isValid = false;
    }

    // Lost Days (optional)
    if (formData.lostDays && !validateLostDays(formData.lostDays)) {
      errors.lostDays = 'Lost days must be a positive whole number';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix all validation errors');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const lostDaysNum = formData.lostDays ? parseInt(formData.lostDays, 10) : 0;

      const submissionData = {
        employee: formData.employee,
        date: formData.date,
        location: formData.location,
        department: formData.department,
        machineId: formData.machineId || '',
        machineName: formData.machineName || '',
        injuryType: formData.injuryType,
        bodyPartAffected: formData.bodyPartAffected || '',
        severity: formData.severity,
        description: formData.description || '',
        immediateAction: formData.immediateAction || '',
        rootCause: formData.rootCause || '',
        reportedBy: formData.reportedBy || '',
        lostDays: lostDaysNum
      };

      const response = await axios.post(`${BASE_URL}/api/safety/accidents`, submissionData, {
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
        setError(response.data.message || 'Failed to add accident');
      }
    } catch (err) {
      console.error('Error adding accident:', err);
      setError(err.response?.data?.message || 'Failed to add accident. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employee: '',
      date: '',
      location: '',
      department: '',
      machineId: '',
      machineName: '',
      injuryType: 'Cut',
      bodyPartAffected: '',
      severity: 'Minor',
      description: '',
      immediateAction: '',
      rootCause: '',
      reportedBy: '',
      lostDays: ''
    });
    setFieldErrors({});
    setError('');
    setActiveStep(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <Stack spacing={2}>
            {/* Employee Information */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      EMPLOYEE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        const firstName = option.FirstName || '';
                        const lastName = option.LastName || '';
                        const employeeId = option.EmployeeID || '';
                        return `${firstName} ${lastName} (${employeeId})`.trim();
                      }}
                      value={employees.find(emp => emp._id === formData.employee) || null}
                      onChange={(event, newValue) => {
                        handleAutocompleteChange('employee', newValue?._id || '');
                      }}
                      loading={fetchingData}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search employee..."
                          error={!!fieldErrors.employee}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                              '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                      )}
                      PaperComponent={CustomPaper}
                      noOptionsText="No employees found"
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                    />
                    {fieldErrors.employee && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.employee}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={departments}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        return option.DepartmentName || '';
                      }}
                      value={departments.find(dept => dept._id === formData.department) || null}
                      onChange={(event, newValue) => {
                        handleAutocompleteChange('department', newValue?._id || '');
                      }}
                      loading={fetchingData}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search department..."
                          error={!!fieldErrors.department}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                              '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                      )}
                      PaperComponent={CustomPaper}
                      noOptionsText="No departments found"
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                    />
                    {fieldErrors.department && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.department}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DATE & TIME <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      disabled={loading}
                      error={!!fieldErrors.date}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
                        },
                        '& .MuiInputBase-input': {
                          py: 1,
                          px: 1.5,
                          fontSize: '0.75rem',
                          color: COLORS.text.primary
                        }
                      }}
                    />
                    {fieldErrors.date && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.date}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      LOCATION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Production Floor, Section A"
                      error={!!fieldErrors.location}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                    {fieldErrors.location && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.location}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DEPARTMENT <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <Autocomplete
                      options={departments}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        return option.DepartmentName || '';
                      }}
                      value={departments.find(dept => dept._id === formData.department) || null}
                      onChange={(event, newValue) => {
                        handleAutocompleteChange('department', newValue?._id || '');
                      }}
                      loading={fetchingData}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search department..."
                          error={!!fieldErrors.department}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                              '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                      )}
                      PaperComponent={CustomPaper}
                      noOptionsText="No departments found"
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                    />
                    {fieldErrors.department && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.department}
                      </Typography>
                    )}
                  </Box>
                </Grid> */}
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 1: // Incident Details
        return (
          <Stack spacing={2}>
            {/* Incident Details */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Incident Details
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MACHINE ID
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="machineId"
                      value={formData.machineId}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., MCH-001"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      MACHINE NAME
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="machineName"
                      value={formData.machineName}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., CNC Machine"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      INJURY TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.injuryType}>
                      <Select
                        name="injuryType"
                        value={formData.injuryType}
                        onChange={handleSelectChange}
                        disabled={loading}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': {
                            py: 1,
                            px: 1.5,
                            fontSize: '0.75rem',
                            color: COLORS.text.primary
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                            borderWidth: 1
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: fieldErrors.injuryType ? '#EF4444' : COLORS.border
                          }
                        }}
                      >
                        {injuryTypeOptions.map((option) => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.injuryType && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.injuryType}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      SEVERITY <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.severity}>
                      <Select
                        name="severity"
                        value={formData.severity}
                        onChange={handleSelectChange}
                        disabled={loading}
                        sx={{
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': {
                            py: 1,
                            px: 1.5,
                            fontSize: '0.75rem',
                            color: COLORS.text.primary
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                            borderWidth: 1
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: fieldErrors.severity ? '#EF4444' : COLORS.border
                          }
                        }}
                      >
                        {severityOptions.map((option) => (
                          <MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {fieldErrors.severity && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.severity}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DESCRIPTION
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      disabled={loading}
                      placeholder="Describe what happened..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      BODY PART AFFECTED
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="bodyPartAffected"
                      value={formData.bodyPartAffected}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Left hand, Right eye"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      LOST DAYS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="lostDays"
                      value={formData.lostDays}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Number of days"
                      error={!!fieldErrors.lostDays}
                      inputProps={{ 
                        min: 0,
                        onWheel: (e) => e.target.blur()
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
                          '&.Mui-error fieldset': { borderColor: '#EF4444' }
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
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield'
                        },
                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0
                        }
                      }}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.25 }}>
                      Number of work days lost (0 if none)
                    </Typography>
                    {fieldErrors.lostDays && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                        {fieldErrors.lostDays}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      case 2: // Actions & Follow-up
        return (
          <Stack spacing={2}>
            {/* Actions and Follow-up */}
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: COLORS.primary, 
                mb: 1.5 
              }}>
                Actions & Follow-up
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      IMMEDIATE ACTION TAKEN
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="immediateAction"
                      value={formData.immediateAction}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      disabled={loading}
                      placeholder="What immediate action was taken?"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
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
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      ROOT CAUSE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="rootCause"
                      value={formData.rootCause}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      disabled={loading}
                      placeholder="What was the root cause of the incident?"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.primary },
                          '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
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
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      REPORTED BY
                    </Typography>
                    <Autocomplete
                      options={users}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        const username = option.Username || '';
                        const employeeInfo = option.EmployeeID 
                          ? ` - ${option.EmployeeID.FirstName || ''} ${option.EmployeeID.LastName || ''}`
                          : '';
                        return `${username}${employeeInfo}`;
                      }}
                      value={users.find(user => user._id === formData.reportedBy) || null}
                      onChange={(event, newValue) => {
                        handleAutocompleteChange('reportedBy', newValue?._id || '');
                      }}
                      loading={fetchingData}
                      disabled={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search user..."
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              '&:hover fieldset': { borderColor: COLORS.primary },
                              '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 }
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
                      )}
                      PaperComponent={CustomPaper}
                      noOptionsText="No users found"
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Report New Accident / Incident
        </Typography>
      </DialogTitle>

      {/* Modern Stepper with Primary Color */}
      <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<ColorConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.secondary }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        {renderStepContent(activeStep)}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              fontSize: '0.75rem',
              py: 0.5,
              '& .MuiAlert-icon': { fontSize: '1.25rem' }
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          size="small"
          startIcon={<NavigateBeforeIcon sx={{ fontSize: '1rem' }} />}
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
          Back
        </Button>
        <Box>
          <Button
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{
              height: 32,
              px: 2,
              mr: 1,
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
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="small"
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
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
                }
              }}
            >
              {loading ? 'Submitting...' : 'Report Accident'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              size="small"
              endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
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
                }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccident;