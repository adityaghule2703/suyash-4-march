// import React, { useState, useEffect } from 'react';
// import {
//   // Layout components
//   Box,
//   Paper,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
//   Grid,
  
//   // Form components
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormHelperText,
//   Autocomplete,
  
//   // Feedback components
//   Alert,
//   CircularProgress,
  
//   // Data display
//   Typography,
//   Chip,
//   Divider,
  
//   // Buttons and actions
//   Button,
  
//   // Navigation
//   styled,
  
//   // Utils
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
  
// } from '@mui/material';
// import { 
//   Add as AddIcon, 
//   Close as CloseIcon, 
//   NavigateNext as NavigateNextIcon, 
//   NavigateBefore as NavigateBeforeIcon,
//   Schedule as ScheduleIcon,
//   Person as PersonIcon,
//   VideoCall as VideoCallIcon,
//   LocationOn as LocationIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // 🔥 Modern Stepper Connector with Gradient
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient(135deg, #164e63 0%, #00B4D8 50%, #0e7490 100%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const ScheduleInterview = ({ open, onClose, onAdd }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     applicationId: '',
//     round: '',
//     interviewers: [],
//     scheduledAt: '',
//     duration: 60,
//     type: 'video',
//     meetingLink: '',
//     location: '',
//     notes: ''
//   });

//   // Dropdown states
//   const [applications, setApplications] = useState([]);
//   const [applicationsLoading, setApplicationsLoading] = useState(false);
//   const [applicationsSearch, setApplicationsSearch] = useState('');
//   const [applicationsOpen, setApplicationsOpen] = useState(false);
//   const [applicationsPage, setApplicationsPage] = useState(1);
//   const [applicationsTotalPages, setApplicationsTotalPages] = useState(1);
//   const [applicationsInputValue, setApplicationsInputValue] = useState('');

//   const [interviewers, setInterviewers] = useState([]);
//   const [interviewersLoading, setInterviewersLoading] = useState(false);
//   const [interviewersSearch, setInterviewersSearch] = useState('');
//   const [interviewersOpen, setInterviewersOpen] = useState(false);
//   const [interviewersPage, setInterviewersPage] = useState(1);
//   const [interviewersTotalPages, setInterviewersTotalPages] = useState(1);
//   const [interviewersInputValue, setInterviewersInputValue] = useState('');

//   const [selectedInterviewers, setSelectedInterviewers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});

//   // Steps definition
//   const steps = ['Select Application', 'Interview Details', 'Review & Schedule'];

//   // Interview rounds
//   const interviewRounds = [
//    'Telephonic',  // Changed from 'teliphonic'
//   'Technical',
//   'HR',
//   'Managerial',
//   'Final'
//   ];

//   // Interview types
//  const interviewTypes = [
//   { value: 'video', label: 'Video Call', icon: <VideoCallIcon /> },
//   { value: 'telephonic', label: 'Phone Call', icon: <ScheduleIcon /> }, // Changed from 'phone' to 'telephonic'
//   { value: 'in-person', label: 'In Person', icon: <LocationIcon /> }
// ];

//   // Fetch applications from API
//   // const fetchApplications = async (search = '', page = 1) => {
//   //   setApplicationsLoading(true);
//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     const response = await axios.get(`${BASE_URL}/api/candidates`, {
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`
//   //       },
//   //       params: {
//   //         page: page,
//   //         limit: 10,
//   //         search: search
//   //       }
//   //     });

//   //     if (response.data.success) {
//   //       // Adjust based on your actual API response structure for candidates
//   //       const newData = response.data.data || response.data.data?.candidates || [];
//   //       if (page === 1) {
//   //         setApplications(Array.isArray(newData) ? newData : []);
//   //       } else {
//   //         setApplications(prev => Array.isArray(prev) ? [...prev, ...(Array.isArray(newData) ? newData : [])] : []);
//   //       }
//   //       setApplicationsTotalPages(response.data.pagination?.totalPages || response.data.data?.pagination?.totalPages || 1);
//   //     }
//   //   } catch (err) {
//   //     console.error('Error fetching applications:', err);
//   //     setApplications([]); // Reset to empty array on error
//   //   } finally {
//   //     setApplicationsLoading(false);
//   //   }
//   // };
// const fetchApplications = async (search = '', page = 1) => {
//   setApplicationsLoading(true);
//   try {
//     const token = localStorage.getItem('token');
    
//     const response = await axios.get(`${BASE_URL}/api/candidates`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       },
//       params: {
       
//         status: ['shortlisted', 'onHold'] // Include relevant statuses
//       },
//       paramsSerializer: params => {
//         const searchParams = new URLSearchParams();
//         if (params.search) searchParams.append('search', params.search);
//         if (params.status) {
//           params.status.forEach(status => searchParams.append('status', status));
//         }
//         return searchParams.toString();
//       }
//     });

//     console.log('Candidates API Response:', response.data);

//     if (response.data.success) {
//       // Data is directly in response.data.data array
//       const candidatesData = response.data.data || [];
      
//       // Filter candidates that have a latestApplication (they've applied to a job)
//       const candidatesWithApplication = candidatesData.filter(
//         candidate => candidate.latestApplication && candidate.latestApplication._id
//       );
      
//       console.log('Candidates with applications:', candidatesWithApplication);
      
//       if (page === 1) {
//         setApplications(candidatesWithApplication);
//       } else {
//         setApplications(prev => [...prev, ...candidatesWithApplication]);
//       }
      
//       setApplicationsTotalPages(response.data.pagination?.totalPages || 1);
//     }
//   } catch (err) {
//     console.error('Error fetching candidates:', err);
//     if (err.response) {
//       console.error('Error details:', err.response.data);
//     }
//     setApplications([]);
//   } finally {
//     setApplicationsLoading(false);
//   }
// };

//   // Fetch interviewers from API
//   const fetchInterviewers = async (search = '', page = 1) => {
//     setInterviewersLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/users`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         params: {
//           page: page,
//           limit: 10,
//           search: search
//         }
//       });

//       console.log('Interviewers API Response:', response.data); // Debug log

//       if (response.data.success) {
//         // ✅ Fix: Access users from response.data.data.users
//         const usersData = response.data.data?.users || [];
//         const pagination = response.data.data?.pagination || {};
        
//         console.log('Users Data:', usersData); // Debug log
        
//         if (page === 1) {
//           setInterviewers(Array.isArray(usersData) ? usersData : []);
//         } else {
//           setInterviewers(prev => Array.isArray(prev) ? [...prev, ...(Array.isArray(usersData) ? usersData : [])] : []);
//         }
        
//         setInterviewersTotalPages(pagination.totalPages || 1);
//       }
//     } catch (err) {
//       console.error('Error fetching interviewers:', err);
//       setInterviewers([]); // Reset to empty array on error
//     } finally {
//       setInterviewersLoading(false);
//     }
//   };

//   // Load applications when dropdown opens
//   useEffect(() => {
//     if (applicationsOpen) {
//       fetchApplications(applicationsSearch, 1);
//     }
//   }, [applicationsOpen]);

//   // Search applications with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (applicationsOpen) {
//         setApplicationsPage(1);
//         fetchApplications(applicationsSearch, 1);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [applicationsSearch, applicationsOpen]);

//   // Load interviewers when dropdown opens
//   useEffect(() => {
//     if (interviewersOpen) {
//       fetchInterviewers(interviewersSearch, 1);
//     }
//   }, [interviewersOpen]);

//   // Search interviewers with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (interviewersOpen) {
//         setInterviewersPage(1);
//         fetchInterviewers(interviewersSearch, 1);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [interviewersSearch, interviewersOpen]);

//   // Handle scroll load more for applications
//   const handleApplicationsScroll = (event) => {
//     const listboxNode = event.currentTarget;
//     if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50) {
//       if (applicationsPage < applicationsTotalPages && !applicationsLoading) {
//         const nextPage = applicationsPage + 1;
//         setApplicationsPage(nextPage);
//         fetchApplications(applicationsSearch, nextPage);
//       }
//     }
//   };

//   // Handle scroll load more for interviewers
//   const handleInterviewersScroll = (event) => {
//     const listboxNode = event.currentTarget;
//     if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50) {
//       if (interviewersPage < interviewersTotalPages && !interviewersLoading) {
//         const nextPage = interviewersPage + 1;
//         setInterviewersPage(nextPage);
//         fetchInterviewers(interviewersSearch, nextPage);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleNumberChange = (e) => {
//     const { name, value } = e.target;
//     if (value === '' || /^\d+$/.test(value)) {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));

//       if (fieldErrors[name]) {
//         setFieldErrors(prev => ({
//           ...prev,
//           [name]: ''
//         }));
//       }
//     }
//   };

//   const handleAddInterviewer = (event, newValue) => {
//     if (newValue) {
//       // Check if interviewer already added
//       const exists = selectedInterviewers.some(
//         interviewer => interviewer.interviewerId === newValue._id
//       );
      
//       if (!exists) {
//         // Get proper name from user object
//         let interviewerName = newValue.Username || 'Interviewer';
//         if (newValue.EmployeeID?.FirstName && newValue.EmployeeID?.LastName) {
//           interviewerName = `${newValue.EmployeeID.FirstName} ${newValue.EmployeeID.LastName}`;
//         }
        
//         const newInterviewer = {
//           interviewerId: newValue._id,
//           name: interviewerName,
//           email: newValue.Email,
//           username: newValue.Username,
//           role: newValue.RoleID?.RoleName
//         };
        
//         setSelectedInterviewers([...selectedInterviewers, newInterviewer]);
//         setFormData(prev => ({
//           ...prev,
//           interviewers: [...prev.interviewers, newInterviewer]
//         }));
//       }
      
//       // Clear the autocomplete input
//       setInterviewersInputValue('');
//     }
//   };

//   const handleRemoveInterviewer = (interviewerToRemove) => {
//     setSelectedInterviewers(prev => 
//       prev.filter(interviewer => interviewer.interviewerId !== interviewerToRemove.interviewerId)
//     );
//     setFormData(prev => ({
//       ...prev,
//       interviewers: prev.interviewers.filter(
//         interviewer => interviewer.interviewerId !== interviewerToRemove.interviewerId
//       )
//     }));
//   };

//   const validateStep = (step) => {
//     const errors = {};

//     if (step === 0) {
//       if (!formData.applicationId) {
//         errors.applicationId = 'Please select an application';
//       }
//     } else if (step === 1) {
//       if (!formData.round) {
//         errors.round = 'Interview round is required';
//       }
//       if (selectedInterviewers.length === 0) {
//         errors.interviewers = 'At least one interviewer is required';
//       }
//       if (!formData.scheduledAt) {
//         errors.scheduledAt = 'Scheduled date and time is required';
//       } else {
//         const selectedDate = new Date(formData.scheduledAt);
//         const now = new Date();
//         if (selectedDate < now) {
//           errors.scheduledAt = 'Scheduled time must be in the future';
//         }
//       }
//       if (!formData.duration) {
//         errors.duration = 'Duration is required';
//       } else if (formData.duration < 15) {
//         errors.duration = 'Duration must be at least 15 minutes';
//       }
//       if (!formData.type) {
//         errors.type = 'Interview type is required';
//       }
//       if (formData.type === 'video' && !formData.meetingLink) {
//         errors.meetingLink = 'Meeting link is required for video interviews';
//       }
//       if (formData.type === 'in-person' && !formData.location) {
//         errors.location = 'Location is required for in-person interviews';
//       }
//     }

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setActiveStep((prevStep) => prevStep + 1);
//       setError('');
//     } else {
//       setError('Please fill in all required fields in this section');
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//     setError('');
//   };

// const handleSubmit = async () => {
//   if (!validateStep(1)) {
//     setError('Please fill in all required fields correctly');
//     return;
//   }

//   setLoading(true);
//   setError('');

//   try {
//     const token = localStorage.getItem('token');

//     // IMPORTANT: Use the application ID from latestApplication._id
//     const applicationId = formData.applicationId?.latestApplication?._id;
    
//     if (!applicationId) {
//       setError('Invalid application selected. Please select a candidate with a valid application.');
//       setLoading(false);
//       return;
//     }

//     // Prepare data according to API expectations
//     const submitData = {
//       applicationId: applicationId, // This should be the application _id
//       round: formData.round,
//       interviewers: selectedInterviewers.map(interviewer => ({
//         interviewerId: interviewer.interviewerId,
//         name: interviewer.name,
//         email: interviewer.email
//       })),
//       scheduledAt: formData.scheduledAt,
//       duration: parseInt(formData.duration),
//       type: formData.type,
//       meetingLink: formData.meetingLink || '',
//       location: formData.location || '',
//       notes: formData.notes || ''
//     };

//     console.log('Submitting interview data:', submitData);

//     const response = await axios.post(`${BASE_URL}/api/interviews`, submitData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (response.data.success) {
//       onAdd(response.data.data);
//       resetForm();
//       onClose();
//     } else {
//       setError(response.data.message || 'Failed to schedule interview');
//     }
//   } catch (err) {
//     console.error('Error scheduling interview:', err);
//     if (err.response) {
//       console.error('Error response:', err.response.data);
//       setError(err.response.data?.message || 'Failed to schedule interview. Please try again.');
//     } else {
//       setError('Failed to schedule interview. Please try again.');
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   const resetForm = () => {
//     setFormData({
//       applicationId: null,
//       round: '',
//       interviewers: [],
//       scheduledAt: '',
//       duration: 60,
//       type: 'video',
//       meetingLink: '',
//       location: '',
//       notes: ''
//     });
//     setSelectedInterviewers([]);
//     setError('');
//     setFieldErrors({});
//     setActiveStep(0);
//     setApplicationsSearch('');
//     setApplicationsInputValue('');
//     setInterviewersSearch('');
//     setInterviewersInputValue('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return 'Not set';
//     return new Date(dateTimeString).toLocaleString('en-US', {
//       dateStyle: 'medium',
//       timeStyle: 'short'
//     });
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={2}>
//             {/* Select Application */}
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Select Application
//               </Typography>

//               <Autocomplete
//                 size="small"
//                 id="application-autocomplete"
//                 open={applicationsOpen}
//                 onOpen={() => setApplicationsOpen(true)}
//                 onClose={() => setApplicationsOpen(false)}
//                 options={Array.isArray(applications) ? applications : []}
//                 loading={applicationsLoading}
//                 value={formData.applicationId}
//                 onChange={(event, newValue) => {
//                   setFormData(prev => ({ ...prev, applicationId: newValue }));
//                   if (fieldErrors.applicationId) setFieldErrors(prev => ({ ...prev, applicationId: '' }));
//                 }}
//                 inputValue={applicationsInputValue}
//                 onInputChange={(event, newInputValue) => {
//                   setApplicationsInputValue(newInputValue);
//                   setApplicationsSearch(newInputValue);
//                 }}
//                 getOptionLabel={(option) => {
//                   if (!option) return '';
//                   const name = option.name || `${option.firstName || ''} ${option.lastName || ''}`.trim() || 'Unknown';
//                   const jobTitle = option.jobTitle || option.position || 'Position';
//                   return `${name} - ${jobTitle}`;
//                 }}
//                 isOptionEqualToValue={(option, value) => {
//                   return option?._id === value?._id;
//                 }}
//                 fullWidth
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Search Application"
//                     required
//                     error={!!fieldErrors.applicationId}
//                     helperText={fieldErrors.applicationId}
//                     size="small"
//                     placeholder="Search by candidate name or position"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1
//                       }
//                     }}
//                     InputProps={{
//                       ...params.InputProps,
//                       endAdornment: (
//                         <>
//                           {applicationsLoading ? <CircularProgress size={16} /> : null}
//                           {params.InputProps.endAdornment}
//                         </>
//                       ),
//                     }}
//                   />
//                 )}
//                 renderOption={(props, option) => {
//                   if (!option) return null;
//                   const name = option.name || `${option.firstName || ''} ${option.lastName || ''}`.trim() || 'Unknown';
//                   const email = option.email || '';
//                   const jobTitle = option.jobTitle || option.position || 'Position';
//                   return (
//                     <MenuItem {...props} key={option._id} sx={{ py: 0.5 }}>
//                       <Box>
//                         <Typography variant="body2" fontWeight={500}>{name}</Typography>
//                         <Typography variant="caption" color="textSecondary">
//                           {jobTitle} • {email}
//                         </Typography>
//                       </Box>
//                     </MenuItem>
//                   );
//                 }}
//                 ListboxProps={{ 
//                   onScroll: handleApplicationsScroll, 
//                   style: { maxHeight: 200 } 
//                 }}
//               />

//               {formData.applicationId && (
//                 <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#F8FAFC', borderRadius: 1 }}>
//                   <Typography variant="caption" color="textSecondary" display="block">
//                     Selected Application
//                   </Typography>
//                   <Typography variant="body2" fontWeight={500}>
//                     {formData.applicationId.name || `${formData.applicationId.firstName || ''} ${formData.applicationId.lastName || ''}`.trim()}
//                   </Typography>
//                   <Typography variant="caption" color="textSecondary">
//                     {formData.applicationId.email} • {formData.applicationId.jobTitle || formData.applicationId.position}
//                   </Typography>
//                 </Box>
//               )}
//             </Paper>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={2}>
//             {/* Interview Details */}
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Interview Details
//               </Typography>

//               <Grid container spacing={1.5}>
//                 {/* Interview Round */}
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
//                     <InputLabel>Interview Round *</InputLabel>
//                     <Select
//                       name="round"
//                       value={formData.round}
//                       onChange={handleChange}
//                       label="Interview Round *"
//                       required
//                       error={!!fieldErrors.round}
//                     >
//                       {interviewRounds.map(round => (
//                         <MenuItem key={round} value={round}>{round}</MenuItem>
//                       ))}
//                     </Select>
//                     {fieldErrors.round && (
//                       <FormHelperText error>{fieldErrors.round}</FormHelperText>
//                     )}
//                   </FormControl>
//                 </Grid>

//                 {/* Interview Type */}
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}>
//                     <InputLabel>Interview Type *</InputLabel>
//                     <Select
//                       name="type"
//                       value={formData.type}
//                       onChange={handleChange}
//                       label="Interview Type *"
//                       required
//                       error={!!fieldErrors.type}
//                     >
//                       {interviewTypes.map(type => (
//                         <MenuItem key={type.value} value={type.value}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             {type.icon}
//                             <Typography variant="body2">{type.label}</Typography>
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {fieldErrors.type && (
//                       <FormHelperText error>{fieldErrors.type}</FormHelperText>
//                     )}
//                   </FormControl>
//                 </Grid>

//                 {/* Date & Time */}
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Scheduled Date & Time"
//                     name="scheduledAt"
//                     type="datetime-local"
//                     value={formData.scheduledAt}
//                     onChange={handleChange}
//                     required
//                     error={!!fieldErrors.scheduledAt}
//                     helperText={fieldErrors.scheduledAt}
//                     InputLabelProps={{ shrink: true }}
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>

//                 {/* Duration */}
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Duration (minutes)"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleNumberChange}
//                     required
//                     type="number"
//                     inputProps={{ min: 15, step: 15 }}
//                     error={!!fieldErrors.duration}
//                     helperText={fieldErrors.duration || 'Minimum 15 minutes'}
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                   />
//                 </Grid>

//                 {/* Meeting Link (for video) */}
//                 {formData.type === 'video' && (
//                   <Grid size={{ xs: 12 }}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       label="Meeting Link"
//                       name="meetingLink"
//                       value={formData.meetingLink}
//                       onChange={handleChange}
//                       required
//                       error={!!fieldErrors.meetingLink}
//                       helperText={fieldErrors.meetingLink || 'e.g., Google Meet, Zoom, Teams link'}
//                       placeholder="https://meet.google.com/abc-defg-hij"
//                       sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                     />
//                   </Grid>
//                 )}

//                 {/* Location (for in-person) */}
//                 {formData.type === 'in-person' && (
//                   <Grid size={{ xs: 12 }}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       label="Location"
//                       name="location"
//                       value={formData.location}
//                       onChange={handleChange}
//                       required
//                       error={!!fieldErrors.location}
//                       helperText={fieldErrors.location || 'Room number, building, address'}
//                       placeholder="e.g., Conference Room A, Building 2"
//                       sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//                     />
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>

//             {/* Interviewers */}
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Add Interviewers
//               </Typography>

//               <Box sx={{ mb: 2 }}>
//                 <Autocomplete
//                   size="small"
//                   id="interviewer-autocomplete"
//                   open={interviewersOpen}
//                   onOpen={() => setInterviewersOpen(true)}
//                   onClose={() => setInterviewersOpen(false)}
//                   options={Array.isArray(interviewers) ? interviewers : []}
//                   loading={interviewersLoading}
//                   value={null}
//                   onChange={handleAddInterviewer}
//                   inputValue={interviewersInputValue}
//                   onInputChange={(event, newInputValue) => {
//                     setInterviewersInputValue(newInputValue);
//                     setInterviewersSearch(newInputValue);
//                   }}
//                   getOptionLabel={(option) => {
//                     if (!option) return '';
//                     // Try to get name from different possible locations
//                     if (option.EmployeeID?.FirstName && option.EmployeeID?.LastName) {
//                       return `${option.EmployeeID.FirstName} ${option.EmployeeID.LastName}`;
//                     }
//                     return option.Username || option.Email || '';
//                   }}
//                   isOptionEqualToValue={(option, value) => {
//                     return option?._id === value?._id;
//                   }}
//                   fullWidth
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Search Interviewers"
//                       placeholder="Type to search and add interviewers"
//                       size="small"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1
//                         }
//                       }}
//                       InputProps={{
//                         ...params.InputProps,
//                         endAdornment: (
//                           <>
//                             {interviewersLoading ? <CircularProgress size={16} /> : null}
//                             {params.InputProps.endAdornment}
//                           </>
//                         ),
//                       }}
//                     />
//                   )}
//                   renderOption={(props, option) => {
//                     if (!option) return null;
                    
//                     // Extract name based on data structure
//                     let displayName = option.Username || 'Unknown';
//                     let displayEmail = option.Email || '';
//                     let department = '';
//                     let role = option.RoleID?.RoleName || 'No role';
                    
//                     if (option.EmployeeID) {
//                       if (option.EmployeeID.FirstName && option.EmployeeID.LastName) {
//                         displayName = `${option.EmployeeID.FirstName} ${option.EmployeeID.LastName}`;
//                       }
//                       if (option.EmployeeID.DepartmentID?.DepartmentName) {
//                         department = option.EmployeeID.DepartmentID.DepartmentName;
//                       }
//                     }
                    
//                     return (
//                       <MenuItem {...props} key={option._id} sx={{ py: 0.5 }}>
//                         <Box>
//                           <Typography variant="body2" fontWeight={500}>
//                             {displayName}
//                           </Typography>
//                           <Typography variant="caption" color="textSecondary">
//                             {displayEmail} • {role} {department && `• ${department}`}
//                           </Typography>
//                         </Box>
//                       </MenuItem>
//                     );
//                   }}
//                   ListboxProps={{ 
//                     onScroll: handleInterviewersScroll, 
//                     style: { maxHeight: 200 } 
//                   }}
//                 />
//               </Box>

//               {/* Selected Interviewers */}
//               <Box>
//                 <Typography variant="caption" sx={{ color: '#666', mb: 1, display: 'block' }}>
//                   Selected Interviewers ({selectedInterviewers.length})
//                 </Typography>
//                 {selectedInterviewers.length > 0 ? (
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                     {selectedInterviewers.map((interviewer) => (
//                       <Chip
//                         key={interviewer.interviewerId}
//                         label={interviewer.name}
//                         onDelete={() => handleRemoveInterviewer(interviewer)}
//                         size="small"
//                         icon={<PersonIcon />}
//                         sx={{
//                           backgroundColor: '#E3F2FD',
//                           color: '#1976D2',
//                           '& .MuiChip-deleteIcon': {
//                             color: '#1976D2',
//                             '&:hover': { color: '#1565C0' }
//                           }
//                         }}
//                       />
//                     ))}
//                   </Box>
//                 ) : (
//                   <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>
//                     No interviewers added yet
//                   </Typography>
//                 )}
//                 {fieldErrors.interviewers && (
//                   <FormHelperText error sx={{ mt: 1 }}>{fieldErrors.interviewers}</FormHelperText>
//                 )}
//               </Box>
//             </Paper>

//             {/* Additional Notes */}
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Additional Notes (Optional)
//               </Typography>
//               <TextField
//                 fullWidth
//                 size="small"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 multiline
//                 rows={2}
//                 placeholder="Any special instructions or notes for the interview..."
//                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
//               />
//             </Paper>
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1.5, fontWeight: 600, fontSize: '0.9rem' }}>
//                 Review Interview Schedule
//               </Typography>
              
//               <Grid container spacing={2}>
//                 {/* Application Info */}
//                 <Grid size={{ xs: 12 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
//                     Candidate Information
//                   </Typography>
//                   <Paper sx={{ p: 1.5, backgroundColor: '#F8FAFC', borderRadius: 1 }}>
//                     <Typography variant="body2" fontWeight={500}>
//                       {formData.applicationId?.name || 
//                        `${formData.applicationId?.firstName || ''} ${formData.applicationId?.lastName || ''}`.trim() || 
//                        'Not selected'}
//                     </Typography>
//                     <Typography variant="caption" color="textSecondary">
//                       {formData.applicationId?.email} • {formData.applicationId?.jobTitle || formData.applicationId?.position}
//                     </Typography>
//                   </Paper>
//                 </Grid>

//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Interview Round</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.round || 'Not set'}</Typography>
//                 </Grid>

//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Interview Type</Typography>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                     {interviewTypes.find(t => t.value === formData.type)?.icon}
//                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                       {interviewTypes.find(t => t.value === formData.type)?.label || formData.type}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Date & Time</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                     {formatDateTime(formData.scheduledAt)}
//                   </Typography>
//                 </Grid>

//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Duration</Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.duration} minutes</Typography>
//                 </Grid>

//                 {/* Meeting Link or Location */}
//                 {formData.type === 'video' && formData.meetingLink && (
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Meeting Link</Typography>
//                     <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
//                       {formData.meetingLink}
//                     </Typography>
//                   </Grid>
//                 )}

//                 {formData.type === 'in-person' && formData.location && (
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Location</Typography>
//                     <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.location}</Typography>
//                   </Grid>
//                 )}

//                 {/* Interviewers */}
//                 {selectedInterviewers.length > 0 && (
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
//                       Interviewers ({selectedInterviewers.length})
//                     </Typography>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                       {selectedInterviewers.map(interviewer => (
//                         <Chip
//                           key={interviewer.interviewerId}
//                           label={interviewer.name}
//                           size="small"
//                           icon={<PersonIcon />}
//                           sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
//                         />
//                       ))}
//                     </Box>
//                   </Grid>
//                 )}

//                 {/* Notes */}
//                 {formData.notes && (
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>Additional Notes</Typography>
//                     <Paper sx={{ p: 1.5, backgroundColor: '#F8FAFC', borderRadius: 1 }}>
//                       <Typography variant="body2" sx={{ color: '#333' }}>
//                         {formData.notes}
//                       </Typography>
//                     </Paper>
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>
            
//             <Alert severity="info" sx={{ borderRadius: 1 }}>
//               <Typography variant="body2">
//                 Please review all information before scheduling. An email notification will be sent to all interviewers and the candidate.
//               </Typography>
//             </Alert>
//           </Stack>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 1.5,
//           maxHeight: '95vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: '1px solid #E0E0E0',
//         py: 1.5,
//         px: 2,
//         backgroundColor: '#F8FAFC'
//       }}>
//         <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, color: '#101010', mb: 1 }}>
//           Schedule New Interview
//         </Typography>

//         {/* 🔥 Modern Stepper with Gradient Connector */}
//         <Stepper
//           activeStep={activeStep}
//           alternativeLabel
//           connector={<ColorConnector />}
//           sx={{ mb: 1, mt: 1 }}
//         >
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>
//                 <Typography fontWeight={500} fontSize="0.85rem">{label}</Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </DialogTitle>

//       <DialogContent sx={{ p: 2, overflow: 'auto' }}>
//         {renderStepContent(activeStep)}

//         {error && (
//           <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>{error}</Alert>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2,
//         py: 1.5,
//         borderTop: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC',
//         justifyContent: 'space-between'
//       }}>
//         <Button
//           onClick={handleBack}
//           disabled={activeStep === 0 || loading}
//           size="small"
//           startIcon={<NavigateBeforeIcon />}
//           sx={{ color: '#666' }}
//         >
//           Back
//         </Button>
//         <Box>
//           <Button
//             onClick={handleClose}
//             disabled={loading}
//             size="small"
//             sx={{ mr: 1, color: '#666' }}
//           >
//             Cancel
//           </Button>
//           {activeStep === steps.length - 1 ? (
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading}
//               size="small"
//               startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ScheduleIcon />}
//               sx={{
//                 backgroundColor: '#1976D2',
//                 '&:hover': { backgroundColor: '#1565C0' }
//               }}
//             >
//               {loading ? 'Scheduling...' : 'Schedule Interview'}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading}
//               size="small"
//               endIcon={<NavigateNextIcon />}
//               sx={{
//                 backgroundColor: '#1976D2',
//                 '&:hover': { backgroundColor: '#1565C0' }
//               }}
//             >
//               Next
//             </Button>
//           )}
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ScheduleInterview;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  Alert,
  CircularProgress,
  Typography,
  Chip,
  Button,
  styled,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  NavigateNext as NavigateNextIcon, 
  NavigateBefore as NavigateBeforeIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  VideoCall as VideoCallIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants matching AddVendor
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

const steps = ['Select Application', 'Interview Details', 'Review & Schedule'];

const ScheduleInterview = ({ open, onClose, onAdd }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    applicationId: '',
    round: '',
    interviewers: [],
    scheduledAt: '',
    duration: 60,
    type: 'video',
    meetingLink: '',
    location: '',
    notes: ''
  });

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsSearch, setApplicationsSearch] = useState('');
  const [applicationsOpen, setApplicationsOpen] = useState(false);
  const [applicationsInputValue, setApplicationsInputValue] = useState('');

  const [interviewers, setInterviewers] = useState([]);
  const [interviewersLoading, setInterviewersLoading] = useState(false);
  const [interviewersSearch, setInterviewersSearch] = useState('');
  const [interviewersOpen, setInterviewersOpen] = useState(false);
  const [interviewersInputValue, setInterviewersInputValue] = useState('');

  const [selectedInterviewers, setSelectedInterviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const interviewRounds = ['Telephonic', 'Technical', 'HR', 'Managerial', 'Final'];

  const interviewTypes = [
    { value: 'video', label: 'Video Call', icon: <VideoCallIcon /> },
    { value: 'telephonic', label: 'Phone Call', icon: <PhoneIcon /> },
    { value: 'in-person', label: 'In Person', icon: <LocationIcon /> }
  ];

  // Fetch applications
  const fetchApplications = async (search = '') => {
    setApplicationsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/candidates`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { status: ['shortlisted', 'onHold'] }
      });

      if (response.data.success) {
        const candidatesData = response.data.data || [];
        const candidatesWithApplication = candidatesData.filter(
          candidate => candidate.latestApplication && candidate.latestApplication._id
        );
        
        if (search) {
          const filtered = candidatesWithApplication.filter(candidate =>
            candidate.name?.toLowerCase().includes(search.toLowerCase()) ||
            candidate.email?.toLowerCase().includes(search.toLowerCase())
          );
          setApplications(filtered);
        } else {
          setApplications(candidatesWithApplication);
        }
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

// Fetch interviewers (employees)
const fetchInterviewers = async (search = '') => {
  setInterviewersLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/employees`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { 
        page: 1, 
        limit: 100,
        ...(search && { search: search })
      }
    });

    console.log('Employees API Response:', response.data);

    if (response.data.success) {
      // Employees are in response.data.data array
      const employeesData = response.data.data || [];
      console.log('Employees loaded:', employeesData.length);
      setInterviewers(employeesData);
    } else {
      console.log('API returned success: false');
      setInterviewers([]);
    }
  } catch (err) {
    console.error('Error fetching employees:', err);
    if (err.response) {
      console.error('Error details:', err.response.data);
    }
    setInterviewers([]);
  } finally {
    setInterviewersLoading(false);
  }
};
  // Load applications when dropdown opens
  useEffect(() => {
    if (applicationsOpen) {
      fetchApplications(applicationsSearch);
    }
  }, [applicationsOpen]);

  // Search applications with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (applicationsOpen) {
        fetchApplications(applicationsSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [applicationsSearch, applicationsOpen]);

  // Load interviewers when dropdown opens
  useEffect(() => {
    if (interviewersOpen) {
      fetchInterviewers(interviewersSearch);
    }
  }, [interviewersOpen]);

  // Search interviewers with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (interviewersOpen) {
        fetchInterviewers(interviewersSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [interviewersSearch, interviewersOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) {
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

const handleAddInterviewer = (event, newValue) => {
  if (newValue) {
    const exists = selectedInterviewers.some(
      interviewer => interviewer.interviewerId === newValue._id
    );
    
    if (!exists) {
      const firstName = newValue.FirstName || '';
      const lastName = newValue.LastName || '';
      const employeeId = newValue.EmployeeID || '';
      const interviewerName = `${firstName} ${lastName}`.trim() || employeeId || 'Interviewer';
      
      const newInterviewer = {
        interviewerId: newValue._id,
        name: interviewerName,
        email: newValue.Email || '',
        employeeId: newValue.EmployeeID,
        department: newValue.DepartmentID?.DepartmentName,
        designation: newValue.DesignationID?.DesignationName,
        phone: newValue.Phone
      };
      
      setSelectedInterviewers([...selectedInterviewers, newInterviewer]);
      setFormData(prev => ({
        ...prev,
        interviewers: [...prev.interviewers, newInterviewer]
      }));
    }
    
    setInterviewersInputValue('');
  }
};

  const handleRemoveInterviewer = (interviewerToRemove) => {
    setSelectedInterviewers(prev => 
      prev.filter(interviewer => interviewer.interviewerId !== interviewerToRemove.interviewerId)
    );
    setFormData(prev => ({
      ...prev,
      interviewers: prev.interviewers.filter(
        interviewer => interviewer.interviewerId !== interviewerToRemove.interviewerId
      )
    }));
  };

  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      if (!formData.applicationId) {
        errors.applicationId = 'Please select an application';
      }
    } else if (step === 1) {
      if (!formData.round) {
        errors.round = 'Interview round is required';
      }
      if (selectedInterviewers.length === 0) {
        errors.interviewers = 'At least one interviewer is required';
      }
      if (!formData.scheduledAt) {
        errors.scheduledAt = 'Scheduled date and time is required';
      } else {
        const selectedDate = new Date(formData.scheduledAt);
        const now = new Date();
        if (selectedDate < now) {
          errors.scheduledAt = 'Scheduled time must be in the future';
        }
      }
      if (!formData.duration) {
        errors.duration = 'Duration is required';
      } else if (formData.duration < 15) {
        errors.duration = 'Duration must be at least 15 minutes';
      }
      if (!formData.type) {
        errors.type = 'Interview type is required';
      }
      if (formData.type === 'video' && !formData.meetingLink) {
        errors.meetingLink = 'Meeting link is required for video interviews';
      }
      if (formData.type === 'in-person' && !formData.location) {
        errors.location = 'Location is required for in-person interviews';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.applicationId) {
      errors.applicationId = 'Please select an application';
      isValid = false;
    }
    if (!formData.round) {
      errors.round = 'Interview round is required';
      isValid = false;
    }
    if (selectedInterviewers.length === 0) {
      errors.interviewers = 'At least one interviewer is required';
      isValid = false;
    }
    if (!formData.scheduledAt) {
      errors.scheduledAt = 'Scheduled date and time is required';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.scheduledAt);
      const now = new Date();
      if (selectedDate < now) {
        errors.scheduledAt = 'Scheduled time must be in the future';
        isValid = false;
      }
    }
    if (!formData.duration) {
      errors.duration = 'Duration is required';
      isValid = false;
    } else if (formData.duration < 15) {
      errors.duration = 'Duration must be at least 15 minutes';
      isValid = false;
    }
    if (!formData.type) {
      errors.type = 'Interview type is required';
      isValid = false;
    }
    if (formData.type === 'video' && !formData.meetingLink) {
      errors.meetingLink = 'Meeting link is required for video interviews';
      isValid = false;
    }
    if (formData.type === 'in-person' && !formData.location) {
      errors.location = 'Location is required for in-person interviews';
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
    } else {
      setError('Please fill in all required fields in this section');
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
      const applicationId = formData.applicationId?.latestApplication?._id;
      
      if (!applicationId) {
        setError('Invalid application selected. Please select a candidate with a valid application.');
        setLoading(false);
        return;
      }

      const submitData = {
        applicationId: applicationId,
        round: formData.round,
        interviewers: selectedInterviewers.map(interviewer => ({
          interviewerId: interviewer.interviewerId,
          name: interviewer.name,
          email: interviewer.email
        })),
        scheduledAt: formData.scheduledAt,
        duration: parseInt(formData.duration),
        type: formData.type,
        meetingLink: formData.meetingLink || '',
        location: formData.location || '',
        notes: formData.notes || ''
      };

      const response = await axios.post(`${BASE_URL}/api/interviews`, submitData, {
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
        setError(response.data.message || 'Failed to schedule interview');
      }
    } catch (err) {
      console.error('Error scheduling interview:', err);
      setError(err.response?.data?.message || 'Failed to schedule interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      applicationId: '',
      round: '',
      interviewers: [],
      scheduledAt: '',
      duration: 60,
      type: 'video',
      meetingLink: '',
      location: '',
      notes: ''
    });
    setSelectedInterviewers([]);
    setError('');
    setFieldErrors({});
    setActiveStep(0);
    setApplicationsSearch('');
    setApplicationsInputValue('');
    setInterviewersSearch('');
    setInterviewersInputValue('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not set';
    return new Date(dateTimeString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
case 0:
  return (
    <Stack spacing={2}>
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
          Select Application <span style={{ color: '#EF4444' }}>*</span>
        </Typography>

        <Autocomplete
          size="small"
          open={applicationsOpen}
          onOpen={() => setApplicationsOpen(true)}
          onClose={() => setApplicationsOpen(false)}
          options={applications}
          loading={applicationsLoading}
          value={formData.applicationId}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, applicationId: newValue }));
            if (fieldErrors.applicationId) setFieldErrors(prev => ({ ...prev, applicationId: '' }));
          }}
          inputValue={applicationsInputValue}
          onInputChange={(event, newInputValue) => {
            setApplicationsInputValue(newInputValue);
            setApplicationsSearch(newInputValue);
          }}
          getOptionLabel={(option) => {
            if (!option) return '';
            const name = option.name || `${option.firstName || ''} ${option.lastName || ''}`.trim() || 'Unknown';
            const jobTitle = option.jobTitle || option.position || 'Position';
            return `${name} - ${jobTitle}`;
          }}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search by candidate name or position"
              size="small"
              error={!!fieldErrors.applicationId}
              helperText={fieldErrors.applicationId}
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
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {applicationsLoading ? <CircularProgress size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => {
            if (!option) return null;
            const name = option.name || `${option.firstName || ''} ${option.lastName || ''}`.trim() || 'Unknown';
            const email = option.email || '';
            const jobTitle = option.jobTitle || option.position || 'Position';
            return (
              <li {...props}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    {jobTitle} • {email}
                  </Typography>
                </Box>
              </li>
            );
          }}
        />

        {formData.applicationId && (
          <Box sx={{ 
            mt: 2, 
            p: 1.5, 
            bgcolor: COLORS.primaryLight, 
            borderRadius: 1.5,
            border: `1px solid ${COLORS.primary}`
          }}>
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              Selected Application
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
              {formData.applicationId.name || `${formData.applicationId.firstName || ''} ${formData.applicationId.lastName || ''}`.trim()}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
              {formData.applicationId.email} • {formData.applicationId.jobTitle || formData.applicationId.position}
            </Typography>
          </Box>
        )}
      </Paper>
    </Stack>
  );

      case 1:
        return (
          <Stack spacing={2}>
            {/* Interview Details */}
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
                Interview Details
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      INTERVIEW ROUND <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.round}>
                      <Select
                        name="round"
                        value={formData.round}
                        onChange={handleChange}
                        displayEmpty
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
                          }
                        }}
                      >
                        <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                          <em>Select round</em>
                        </MenuItem>
                        {interviewRounds.map(round => (
                          <MenuItem key={round} value={round} sx={{ fontSize: '0.75rem' }}>{round}</MenuItem>
                        ))}
                      </Select>
                      {fieldErrors.round && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                          {fieldErrors.round}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      INTERVIEW TYPE <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" error={!!fieldErrors.type}>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
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
                          }
                        }}
                      >
                        {interviewTypes.map(type => (
                          <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.75rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {type.icon}
                              <Typography sx={{ fontSize: '0.75rem' }}>{type.label}</Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors.type && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.25 }}>
                          {fieldErrors.type}
                        </Typography>
                      )}
                    </FormControl>
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
                      name="scheduledAt"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={handleChange}
                      error={!!fieldErrors.scheduledAt}
                      helperText={fieldErrors.scheduledAt}
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
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DURATION <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="duration"
                      value={formData.duration}
                      onChange={handleNumberChange}
                      type="number"
                      inputProps={{ min: 15, step: 15 }}
                      error={!!fieldErrors.duration}
                      helperText={fieldErrors.duration || 'Minimum 15 minutes'}
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
                  </Box>
                </Grid>

                {formData.type === 'video' && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                        MEETING LINK <span style={{ color: '#EF4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleChange}
                        error={!!fieldErrors.meetingLink}
                        helperText={fieldErrors.meetingLink || 'e.g., Google Meet, Zoom, Teams link'}
                        placeholder="https://meet.google.com/abc-defg-hij"
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
                    </Box>
                  </Grid>
                )}

                {formData.type === 'in-person' && (
                  <Grid size={{ xs: 12 }}>
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
                        error={!!fieldErrors.location}
                        helperText={fieldErrors.location || 'Room number, building, address'}
                        placeholder="e.g., Conference Room A, Building 2"
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
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Interviewers */}
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
                Add Interviewers <span style={{ color: '#EF4444' }}>*</span>
              </Typography>

<Autocomplete
  size="small"
  open={interviewersOpen}
  onOpen={() => setInterviewersOpen(true)}
  onClose={() => setInterviewersOpen(false)}
  options={interviewers}
  loading={interviewersLoading}
  value={null}
  onChange={handleAddInterviewer}
  inputValue={interviewersInputValue}
  onInputChange={(event, newInputValue) => {
    setInterviewersInputValue(newInputValue);
    setInterviewersSearch(newInputValue);
  }}
  getOptionLabel={(option) => {
    if (!option) return '';
    const firstName = option.FirstName || '';
    const lastName = option.LastName || '';
    const employeeId = option.EmployeeID || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName} (${employeeId})`;
    }
    if (firstName) {
      return `${firstName} (${employeeId})`;
    }
    return employeeId || 'Unknown Employee';
  }}
  isOptionEqualToValue={(option, value) => option?._id === value?._id}
  fullWidth
  renderInput={(params) => (
    <TextField
      {...params}
      placeholder="Type to search and add interviewers"
      size="small"
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
          color: COLORS.text.primary
        }
      }}
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {interviewersLoading ? <CircularProgress size={16} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
  renderOption={(props, option) => {
    if (!option) return null;
    const firstName = option.FirstName || '';
    const lastName = option.LastName || '';
    const employeeId = option.EmployeeID || '';
    const department = option.DepartmentID?.DepartmentName || '';
    const designation = option.DesignationID?.DesignationName || '';
    
    const name = `${firstName} ${lastName}`.trim() || 'Unknown';
    
    return (
      <li {...props}>
        <Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
            {name} {employeeId && `(${employeeId})`}
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
            {designation}
            {designation && department && ' • '}
            {department}
            {!designation && !department && 'Employee'}
          </Typography>
        </Box>
      </li>
    );
  }}
/>

              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                  Selected Interviewers ({selectedInterviewers.length})
                </Typography>
                {selectedInterviewers.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedInterviewers.map((interviewer) => (
                      <Chip
                        key={interviewer.interviewerId}
                        label={interviewer.name}
                        onDelete={() => handleRemoveInterviewer(interviewer)}
                        size="small"
                        icon={<PersonIcon sx={{ fontSize: '0.7rem' }} />}
                        sx={{
                          bgcolor: COLORS.primaryLight,
                          color: COLORS.primaryDark,
                          fontSize: '0.65rem',
                          height: 28,
                          '& .MuiChip-label': { fontSize: '0.65rem' },
                          '& .MuiChip-deleteIcon': {
                            color: COLORS.primaryDark,
                            fontSize: '0.7rem'
                          }
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                    No interviewers added yet
                  </Typography>
                )}
                {fieldErrors.interviewers && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 1 }}>
                    {fieldErrors.interviewers}
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Additional Notes */}
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
                mb: 1 
              }}>
                Additional Notes (Optional)
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Any special instructions or notes for the interview..."
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
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
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
                Review Interview Schedule
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                    Candidate Information
                  </Typography>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: COLORS.primaryLight, 
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.primary}`
                  }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.applicationId?.name || 
                       `${formData.applicationId?.firstName || ''} ${formData.applicationId?.lastName || ''}`.trim() || 
                       'Not selected'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      {formData.applicationId?.email} • {formData.applicationId?.jobTitle || formData.applicationId?.position}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Interview Round</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.round || 'Not set'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Interview Type</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {interviewTypes.find(t => t.value === formData.type)?.icon}
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {interviewTypes.find(t => t.value === formData.type)?.label || formData.type}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Date & Time</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formatDateTime(formData.scheduledAt)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Duration</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {formData.duration} minutes
                  </Typography>
                </Grid>

                {formData.type === 'video' && formData.meetingLink && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Meeting Link</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.primary, wordBreak: 'break-all' }}>
                      {formData.meetingLink}
                    </Typography>
                  </Grid>
                )}

                {formData.type === 'in-person' && formData.location && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Location</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {formData.location}
                    </Typography>
                  </Grid>
                )}

                {selectedInterviewers.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
                      Interviewers ({selectedInterviewers.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedInterviewers.map(interviewer => (
                        <Chip
                          key={interviewer.interviewerId}
                          label={interviewer.name}
                          size="small"
                          icon={<PersonIcon sx={{ fontSize: '0.7rem' }} />}
                          sx={{
                            bgcolor: COLORS.primaryLight,
                            color: COLORS.primaryDark,
                            fontSize: '0.65rem',
                            height: 24
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                {formData.notes && (
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>Additional Notes</Typography>
                    <Box sx={{ 
                      p: 1.5, 
                      bgcolor: COLORS.background.light, 
                      borderRadius: 1.5,
                      border: `1px solid ${COLORS.border}`
                    }}>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formData.notes}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
            
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 1.5,
                '& .MuiAlert-icon': { fontSize: '1.25rem' },
                fontSize: '0.75rem'
              }}
            >
              Please review all information before scheduling. An email notification will be sent to all interviewers and the candidate.
            </Alert>
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
          Schedule New Interview
        </Typography>
      </DialogTitle>

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
              startIcon={loading ? <CircularProgress size={20} sx={{ color: COLORS.text.light }} /> : <ScheduleIcon sx={{ fontSize: '1rem' }} />}
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
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
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

export default ScheduleInterview;