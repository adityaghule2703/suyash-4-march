// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Stack,
//   Typography,
//   Chip,
//   Divider,
//   Box,
//   CircularProgress,
//   Grid,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Paper,
//   Card,
//   CardContent,
//   Avatar,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
//   Alert,
//   IconButton,
//   styled
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Edit as EditIcon,
//   Work as WorkIcon,
//   Business as BusinessIcon,
//   LocationOn as LocationIcon,
//   AttachMoney as AttachMoneyIcon,
//   School as SchoolIcon,
//   Build as BuildIcon,
//   DateRange as DateRangeIcon,
//   People as PeopleIcon,
//   CheckCircleOutline as CheckCircleOutlineIcon,
//   Visibility as VisibilityIcon,
//   LinkedIn as LinkedInIcon,
//   Language as LanguageIcon,
//   Launch as LaunchIcon,
//   Info as InfoIcon,
//   Assignment as AssignmentIcon,
//   Publish as PublishIcon,
//   CheckCircle as CheckCircleIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon,
//   Schedule as ScheduleIcon,
//   PriorityHigh as PriorityHighIcon,
//   Person as PersonIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import { formatDistanceToNow, format } from 'date-fns';

// /* ------------------- Custom Stepper Styling ------------------- */
// const ColorConnector = styled(StepConnector)(({ theme }) => ({
//   '& .MuiStepConnector-line': {
//     height: 4,
//     border: 0,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//   },
//   '&.Mui-active .MuiStepConnector-line': {
//     background: 'linear-gradient(90deg, #164e63, #00B4D8)',
//   },
//   '&.Mui-completed .MuiStepConnector-line': {
//     background: 'linear-gradient(90deg, #164e63, #00B4D8)',
//   },
// }));

// // Custom Step Icon
// const StepIcon = ({ active, completed, icon }) => {
//   const getIcon = () => {
//     if (icon === 1) return <InfoIcon fontSize="small" />;
//     if (icon === 2) return <AssignmentIcon fontSize="small" />;
//     if (icon === 3) return <PublishIcon fontSize="small" />;
//     return icon;
//   };

//   return (
//     <Box
//       sx={{
//         width: 28,
//         height: 28,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: '50%',
//         backgroundColor: completed || active ? '#1976D2' : '#E0E0E0',
//         color: completed || active ? 'white' : '#9E9E9E',
//         transition: 'all 0.2s ease',
//         boxShadow: active ? '0 0 0 3px rgba(25, 118, 210, 0.2)' : 'none',
//         '& svg': {
//           fontSize: 18
//         }
//       }}
//     >
//       {completed ? <CheckCircleIcon fontSize="small" /> : getIcon()}
//     </Box>
//   );
// };

// const steps = ["Overview", "Requisition Details", "Publishing Status"];

// /* ------------------- Status Chip Component ------------------- */
// const StatusChip = ({ status }) => {
//   const statusConfig = {
//     open: { color: 'success', icon: <CheckCircleOutlineIcon />, label: 'Open', bgcolor: '#4caf50' },
//     draft: { color: 'default', icon: <VisibilityIcon />, label: 'Draft', bgcolor: '#e0e0e0' },
//     published: { color: 'success', icon: <CheckCircleOutlineIcon />, label: 'Published', bgcolor: '#4caf50' },
//     closed: { color: 'error', icon: <CloseIcon />, label: 'Closed', bgcolor: '#f44336' },
//     pending: { color: 'warning', icon: <ScheduleIcon />, label: 'Pending', bgcolor: '#ff9800' },
//     in_progress: { color: 'info', icon: <ScheduleIcon />, label: 'In Progress', bgcolor: '#2196f3' }
//   };

//   const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;

//   return (
//     <Chip
//       size="small"
//       icon={config.icon}
//       label={config.label}
//       sx={{
//         backgroundColor: config.bgcolor,
//         color: '#fff',
//         fontWeight: 500,
//         '& .MuiChip-icon': { color: '#fff' }
//       }}
//     />
//   );
// };

// /* ------------------- Priority Chip Component ------------------- */
// const PriorityChip = ({ priority }) => {
//   const priorityConfig = {
//     high: { color: 'error', bgcolor: '#f44336', label: 'High' },
//     medium: { color: 'warning', bgcolor: '#ff9800', label: 'Medium' },
//     low: { color: 'info', bgcolor: '#2196f3', label: 'Low' }
//   };

//   const config = priorityConfig[priority?.toLowerCase()] || { color: 'default', bgcolor: '#e0e0e0', label: priority || 'Not Set' };

//   return (
//     <Chip
//       size="small"
//       label={config.label}
//       sx={{
//         backgroundColor: config.bgcolor,
//         color: '#fff',
//         fontWeight: 500
//       }}
//     />
//   );
// };

// const ViewJobOpening = ({ open, onClose, jobId, onEdit }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [job, setJob] = useState(null);

//   useEffect(() => {
//     if (open && jobId) {
//       fetchJobDetails();
//     }
//   }, [open, jobId]);

//   const fetchJobDetails = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/jobs/${jobId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setJob(response.data.data);
//       } else {
//         setError('Failed to fetch job details');
//       }
//     } catch (err) {
//       console.error('Error fetching job details:', err);
//       setError(err.response?.data?.message || 'Failed to fetch job details. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!job) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return format(new Date(dateString), 'PPP');
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return '-';
//     return format(new Date(dateString), 'PPP p');
//   };

//   const getPlatformIcon = (platform) => {
//     switch (platform?.toLowerCase()) {
//       case 'linkedin':
//         return <LinkedInIcon fontSize="small" />;
//       case 'naukri':
//         return <LanguageIcon fontSize="small" />;
//       case 'careerpage':
//         return <BusinessIcon fontSize="small" />;
//       case 'indeed':
//         return <WorkIcon fontSize="small" />;
//       case 'monster':
//         return <LanguageIcon fontSize="small" />;
//       default:
//         return <LanguageIcon fontSize="small" />;
//     }
//   };

//   const getPlatformStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'published':
//         return 'success';
//       case 'pending':
//         return 'warning';
//       case 'failed':
//         return 'error';
//       case 'draft':
//         return 'default';
//       default:
//         return 'default';
//     }
//   };

//   const handleNext = () => {
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//   };

//   const handleClose = () => {
//     setActiveStep(0);
//     setJob(null);
//     setError('');
//     onClose();
//   };

//   const handleEditClick = () => {
//     onEdit(job);
//     handleClose();
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Box sx={{ py: 1 }}>
//             {/* Company Introduction Section */}
//             {job.companyIntro && (
//               <Box sx={{ mb: 1 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}>
//                   <Box
//                     sx={{
//                       width: 28,
//                       height: 28,
//                       borderRadius: '6px',
//                       bgcolor: '#eef2ff',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <BusinessIcon sx={{ color: '#164e63', fontSize: 18 }} />
//                   </Box>
//                   <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a', letterSpacing: '-0.01em' }}>
//                     Company Introduction
//                   </Typography>
//                 </Box>
//                 <Box sx={{ ml: 4 }}>
//                   <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#334155' }}>
//                     {job.companyIntro}
//                   </Typography>
//                 </Box>
//               </Box>
//             )}

//             {/* Job Description Section */}
//             <Box sx={{ mb: 1 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}>
//                 <Box
//                   sx={{
//                     width: 28,
//                     height: 28,
//                     borderRadius: '6px',
//                     bgcolor: '#eef2ff',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <WorkIcon sx={{ color: '#164e63', fontSize: 18 }} />
//                 </Box>
//                 <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a', letterSpacing: '-0.01em' }}>
//                   Job Description
//                 </Typography>
//               </Box>
//               <Box sx={{ ml: 4 }}>
//                 <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#334155' }}>
//                   {job.description}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Quick Information Grid */}
//             <Box sx={{ mb: 1 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}>
//                 <Box
//                   sx={{
//                     width: 28,
//                     height: 28,
//                     borderRadius: '6px',
//                     bgcolor: '#eef2ff',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <InfoIcon sx={{ color: '#164e63', fontSize: 18 }} />
//                 </Box>
//                 <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a' }}>
//                   Quick Information
//                 </Typography>
//               </Box>
//               <Box sx={{ ml: 4 }}>
//                 <Grid container spacing={2}  >
//                   {/* Location */}
//                   <Grid item xs={12} sm={6} lg={4} >
//                     <Box sx={{ mr: "100px" }}>
//                       <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
//                         Location
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <LocationIcon sx={{ color: '#ef6c00', fontSize: 18 }} />
//                         <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
//                           {job.location || '-'}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>

//                   {/* Department */}
//                   <Grid item xs={12} sm={6} lg={4}>
//                     <Box sx={{ mr: "100px" }}>
//                       <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
//                         Department
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <BusinessIcon sx={{ color: '#7b1fa2', fontSize: 18 }} />
//                         <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
//                           {job.department || '-'}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>

//                   {/* Employment Type */}
//                   <Grid item xs={12} sm={6} lg={4}>
//                     <Box sx={{ mr: "80px" }}>
//                       <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
//                         Employment Type
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <WorkIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
//                         <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
//                           {job.employmentType || '-'}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>

//                   {/* Salary */}
//                   <Grid item xs={12} sm={6} lg={4}>
//                     <Box >
//                       <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
//                         Salary Range
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <AttachMoneyIcon sx={{ color: '#ed6c02', fontSize: 18 }} />
//                         <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
//                           {job.salaryRange ?
//                             `${job.salaryRange.currency || 'INR'} ${job.salaryRange.min?.toLocaleString() || 0} - ${job.salaryRange.max?.toLocaleString() || 0}` : '-'}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>

//                   {/* Experience */}
//                   <Grid item xs={12} sm={6} lg={4}>
//                     <Box sx={{ mr: "50px" }}>
//                       <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
//                         Experience Required
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <DateRangeIcon sx={{ color: '#d32f2f', fontSize: 18 }} />
//                         <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
//                           {job.experienceRequired ?
//                             `${job.experienceRequired.min} - ${job.experienceRequired.max} years` : '-'}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>



//                   {/* Applications */}
//                   <Grid item xs={12} sm={6} lg={4}>
//                     <Box sx={{ mr: "70px" }}>
//                       <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
//                         Total Applications
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <PeopleIcon sx={{ color: '#0288d1', fontSize: 18 }} />
//                         <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
//                           {job.totalApplications || 0}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>

//                   {/* Views */}
//                   <Grid item xs={12} sm={6} lg={4}>
//                     <Box sx={{ mr: "150px" }}>
//                       <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
//                         Views
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <VisibilityIcon sx={{ color: '#9c27b0', fontSize: 18 }} />
//                         <Typography variant="body2" fontWeight={500} sx={{ color: '#1e293b' }}>
//                           {job.views || 0}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>

//                   {/* Job ID */}
//                   <Grid item xs={12} sm={6} lg={4}>
//                     <Box>
//                       <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
//                         Job ID
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <AssignmentIcon sx={{ color: '#164e63', fontSize: 18 }} />
//                         <Typography variant="body2" fontWeight={600} sx={{ color: '#164e63', fontFamily: 'monospace' }}>
//                           {job.jobId}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Box>
//             </Box>

//             {/* Requirements Section */}
//             {job.requirements?.length > 0 && (
//               <Box sx={{ mb: 4, mt:4 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                   <Box
//                     sx={{
//                       width: 28,
//                       height: 28,
//                       borderRadius: '6px',
//                       bgcolor: '#e8f5e9',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <CheckCircleOutlineIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
//                   </Box>
//                   <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#2e7d32' }}>
//                     Requirements
//                   </Typography>
//                   <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
//                     {job.requirements.length} {job.requirements.length === 1 ? 'item' : 'items'}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ ml: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//                     {job.requirements?.map((req, idx) => (
//                       <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
//                         {/* <Box
//                           sx={{
//                             width: 20,
//                             height: 20,
//                             borderRadius: '4px',
//                             bgcolor: '#e8f5e9',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             flexShrink: 0,
//                             mt: '2px'
//                           }}
//                         >
//                           {/* <CheckCircleOutlineIcon sx={{ color: '#2e7d32', fontSize: 12 }} /> 
//                         </Box> */}
//                         <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
//                           {req}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 </Box>
//               </Box>
//             )}

//             {/* Responsibilities Section */}
//             {job.responsibilities?.length > 0 && (
//               <Box sx={{ mb: 4 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                   <Box
//                     sx={{
//                       width: 28,
//                       height: 28,
//                       borderRadius: '6px',
//                       bgcolor: '#e3f2fd',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <AssignmentIcon sx={{ color: '#1976d2', fontSize: 18 }} />
//                   </Box>
//                   <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1976d2' }}>
//                     Responsibilities
//                   </Typography>
//                   <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
//                     {job.responsibilities.length} {job.responsibilities.length === 1 ? 'item' : 'items'}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ ml: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//                     {job.responsibilities?.map((resp, idx) => (
//                       <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
//                         {/* <Box
//                           sx={{
//                             width: 20,
//                             height: 20,
//                             borderRadius: '4px',
//                             bgcolor: '#e3f2fd',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             flexShrink: 0,
//                             mt: '2px'
//                           }}
//                         >
//                           <CheckCircleOutlineIcon sx={{ color: '#1976d2', fontSize: 12 }} />
//                         </Box> */}
//                         <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>
//                           {resp}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 </Box>
//               </Box>
//             )}

//             {/* Skills Section */}
//             {job.skills?.length > 0 && (
//               <Box sx={{ mb: 4 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                   <Box
//                     sx={{
//                       width: 28,
//                       height: 28,
//                       borderRadius: '6px',
//                       bgcolor: '#f1f5f9',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <BuildIcon sx={{ color: '#475569', fontSize: 18 }} />
//                   </Box>
//                   <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a' }}>
//                     Required Skills
//                   </Typography>
//                   <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
//                     {job.skills.length} {job.skills.length === 1 ? 'skill' : 'skills'}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ ml: 4 }}>
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                     {job.skills?.map((skill, idx) => (
//                       <Chip
//                         key={idx}
//                         label={skill}
//                         size="small"
//                         sx={{
//                           bgcolor: '#f1f5f9',
//                           color: '#1e293b',
//                           fontWeight: 500,
//                           borderRadius: '6px',
//                           '&:hover': { bgcolor: '#e2e8f0' }
//                         }}
//                       />
//                     ))}
//                   </Box>
//                 </Box>
//               </Box>
//             )}

//             {/* Education Section */}
//             {job.education?.length > 0 && (
//               <Box sx={{ mb: 4 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                   <Box
//                     sx={{
//                       width: 28,
//                       height: 28,
//                       borderRadius: '6px',
//                       bgcolor: '#eef2ff',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <SchoolIcon sx={{ color: '#164e63', fontSize: 18 }} />
//                   </Box>
//                   <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#0f172a' }}>
//                     Education
//                   </Typography>
//                 </Box>
//                 <Box sx={{ ml: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                     {job.education?.map((edu, idx) => (
//                       <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         {/* <Box
//                           sx={{
//                             width: 24,
//                             height: 24,
//                             borderRadius: '6px',
//                             bgcolor: '#eef2ff',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}
//                         >
//                           <SchoolIcon sx={{ color: '#164e63', fontSize: 14 }} />
//                         </Box> */}
//                         <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
//                           {edu}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 </Box>
//               </Box>
//             )}

//             {/* Created By Section */}
//             <Box sx={{ mt: 4, bgcolor: '#f8fafc', p: 3, borderRadius: 2 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                 <Box
//                   sx={{
//                     width: 28,
//                     height: 28,
//                     borderRadius: '6px',
//                     bgcolor: '#f3e8ff',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <PersonIcon sx={{ color: '#7b1fa2', fontSize: 18 }} />
//                 </Box>
//                 <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#7b1fa2' }}>
//                   Created By
//                 </Typography>
//               </Box>
//               <Box sx={{ ml: 4 }}>
//                 <Stack direction="row" spacing={2.5} alignItems="center">
//                   <Avatar
//                     sx={{
//                       bgcolor: '#7b1fa2',
//                       width: 30,
//                       height: 30,
//                       fontSize: '18px',
//                       fontWeight: 600
//                     }}
//                   >
//                     {job.createdByName?.[0]?.toUpperCase() || 'U'}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1e293b' }}>
//                       {job.createdByName || 'Unknown'}
//                     </Typography>
//                     <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                         <ScheduleIcon sx={{ color: '#64748b', fontSize: 16 }} />
//                         <Typography variant="caption" sx={{ color: '#64748b' }}>
//                           {formatDateTime(job.createdAt)}
//                         </Typography>
//                       </Box>
//                       {job.updatedAt && job.updatedAt !== job.createdAt && (
//                         <>
//                           <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#cbd5e1' }} />
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                             <EditIcon sx={{ color: '#64748b', fontSize: 16 }} />
//                             <Typography variant="caption" sx={{ color: '#64748b' }}>
//                               Updated: {formatDateTime(job.updatedAt)}
//                             </Typography>
//                           </Box>
//                         </>
//                       )}
//                     </Stack>
//                   </Box>
//                 </Stack>
//               </Box>
//             </Box>
//           </Box>
//         );

//       case 1:
//         return (
//           <>
//             {job.requisitionId ? (
//               <Stack spacing={3}>
//                 {/* Requisition Header */}
//                 <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
//                   <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
//                     <Box>
//                       <Typography variant="subtitle1" fontWeight={600}>
//                         {job.requisitionId.positionTitle || job.title}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         Requisition ID: {job.requisitionId.requisitionId || job.requisitionNumber}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <StatusChip status={job.requisitionId.status} />
//                       {job.requisitionId.priority && (
//                         <PriorityChip priority={job.requisitionId.priority} />
//                       )}
//                     </Box>
//                   </Stack>
//                 </Paper>

//                 {/* Requisition Details Grid */}
//                 <Grid container spacing={4} >
//                   <Grid item xs={12} sm={6} >
//                     <Typography variant="body2" color="textSecondary">Department</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.department || job.department}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2" color="textSecondary">Location</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.location || job.location}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2" color="textSecondary">Employment Type</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.employmentType || job.employmentType}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2" color="textSecondary">Number of Positions</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.noOfPositions || '-'}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2" color="textSecondary">Target Hire Date</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.targetHireDate ? formatDate(job.requisitionId.targetHireDate) : 'N/A'}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2" color="textSecondary">Experience Required</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.experienceYears ? `${job.requisitionId.experienceYears} years` : '-'}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2" color="textSecondary">Budget Range</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.budgetMin && job.requisitionId.budgetMax ?
//                         `${job.salaryRange?.currency || 'INR'} ${job.requisitionId.budgetMin?.toLocaleString()} - ${job.requisitionId.budgetMax?.toLocaleString()}` : '-'}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2" color="textSecondary">Grade</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.grade || '-'}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2" color="textSecondary">Reason for Hire</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.reasonForHire || '-'}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2" color="textSecondary">Hired Positions</Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {job.requisitionId.hiredPositions || 0}
//                     </Typography>
//                   </Grid>
//                 </Grid>

//                 {/* Education */}
//                 {job.requisitionId.education && (
//                   <Box>
//                     <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                       Education Required
//                     </Typography>
//                     <Typography variant="body2">{job.requisitionId.education}</Typography>
//                   </Box>
//                 )}

//                 {/* Skills */}
//                 {job.requisitionId.skills?.length > 0 && (
//                   <Box>
//                     <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                       Required Skills
//                     </Typography>
//                     <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//                       {job.requisitionId.skills?.map((skill, idx) => (
//                         <Chip
//                           key={idx}
//                           label={skill}
//                           size="small"
//                           variant="outlined"
//                           sx={{ borderRadius: 1 }}
//                         />
//                       ))}
//                     </Stack>
//                   </Box>
//                 )}

//                 {/* Justification */}
//                 {job.requisitionId.justification && (
//                   <Box>
//                     <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                       Justification
//                     </Typography>
//                     <Typography variant="body2">{job.requisitionId.justification}</Typography>
//                   </Box>
//                 )}

//                 {/* Approval Information */}
//                 {job.requisitionId.approvalDate && (
//                   <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
//                     <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                       Approval Information
//                     </Typography>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="caption" color="textSecondary">Approved By</Typography>
//                         <Typography variant="body2" fontWeight={500}>
//                           {job.requisitionId.approvedByName || 'Unknown'}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="caption" color="textSecondary">Approval Date</Typography>
//                         <Typography variant="body2" fontWeight={500}>
//                           {formatDateTime(job.requisitionId.approvalDate)}
//                         </Typography>
//                       </Grid>
//                       {job.requisitionId.approvalSignature && (
//                         <Grid item xs={12}>
//                           <Typography variant="caption" color="textSecondary">Approval Signature</Typography>
//                           <Box sx={{ mt: 1 }}>
//                             <img
//                               src={`${BASE_URL}${job.requisitionId.approvalSignature}`}
//                               alt="Approval Signature"
//                               style={{ maxHeight: '60px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
//                             />
//                           </Box>
//                         </Grid>
//                       )}
//                     </Grid>
//                   </Paper>
//                 )}

//                 {/* Created By Info */}
//                 <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
//                   <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                     Requisition Created By
//                   </Typography>
//                   <Stack direction="row" spacing={2} alignItems="center">
//                     <Avatar sx={{ bgcolor: '#7B1FA2', width: 40, height: 40 }}>
//                       {job.requisitionId.createdByName?.[0] || 'U'}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="body2" fontWeight={500}>
//                         {job.requisitionId.createdByName || 'Unknown'}
//                         {job.requisitionId.createdByRole && ` (${job.requisitionId.createdByRole})`}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         Created: {formatDateTime(job.requisitionId.createdAt)}
//                       </Typography>
//                       {job.requisitionId.updatedAt && (
//                         <Typography variant="caption" color="textSecondary" display="block">
//                           Updated: {formatDateTime(job.requisitionId.updatedAt)}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Stack>
//                 </Paper>
//               </Stack>
//             ) : (
//               <Alert severity="info">No requisition linked to this job</Alert>
//             )}
//           </>
//         );

//       case 2:
//         return (
//           <Stack spacing={2}>
//             {job.publishTo?.length > 0 ? (
//               job.publishTo.map((platform, idx) => (
//                 <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
//                   <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
//                     <Stack direction="row" spacing={2} alignItems="center">
//                       <Avatar sx={{ bgcolor: '#f0f0f0', width: 36, height: 36 }}>
//                         {getPlatformIcon(platform.platform)}
//                       </Avatar>
//                       <Box>
//                         <Typography variant="subtitle2" textTransform="capitalize" fontWeight={600}>
//                           {platform.platform}
//                         </Typography>
//                         <Typography variant="caption" color="textSecondary">
//                           Job ID: {job.jobId}
//                         </Typography>
//                       </Box>
//                     </Stack>
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       <Chip
//                         size="small"
//                         label={platform.status}
//                         color={getPlatformStatusColor(platform.status)}
//                         sx={{ fontWeight: 500 }}
//                       />
//                       {platform.retryCount > 0 && (
//                         <Chip
//                           size="small"
//                           label={`Retry: ${platform.retryCount}`}
//                           variant="outlined"

//                         />
//                       )}
//                     </Stack>
//                   </Stack>
//                   {platform.errorMessage && (
//                     <Alert severity="error" sx={{ mt: 1 }}>{platform.errorMessage}</Alert>
//                   )}
//                 </Paper>
//               ))
//             ) : (
//               <Alert severity="info">This job has not been published yet</Alert>
//             )}
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
//       PaperProps={{
//         sx: { borderRadius: 2, minHeight: 500 }
//       }}
//     >
//       {/* Attractive Header */}
//       <DialogTitle sx={{
//         background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//         color: '#fff',
//         fontWeight: 600,
//         fontSize: '20px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         gap: 1
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <WorkIcon /> Job Details
//         </Box>
//         <IconButton onClick={handleClose} size="small" sx={{ color: '#fff' }}>
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       {/* Loading State */}
//       {loading ? (
//         <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//           <CircularProgress size={40} sx={{ color: '#1976D2' }} />
//         </DialogContent>
//       ) : error ? (
//         <DialogContent>
//           <Alert
//             severity="error"
//             sx={{ borderRadius: 1 }}
//             action={
//               <Button color="inherit" size="small" onClick={fetchJobDetails}>
//                 Retry
//               </Button>
//             }
//           >
//             {error}
//           </Alert>
//         </DialogContent>
//       ) : job ? (
//         <>
//           {/* Job Header */}
//           {/* <Box sx={{ px: 3, pt: 3 }}>
//             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//               <Box>
//                 <Typography variant="h5" fontWeight={600}>
//                   {job.title}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   {job.jobId} • Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
//                 </Typography>
//               </Box>
//               <StatusChip status={job.status} />
//             </Stack>
//           </Box> */}

//           {/* Modern Stepper */}
//           <Box sx={{ px: 2, pt: 2 }}>
//             <Stepper
//               activeStep={activeStep}
//               alternativeLabel
//               connector={<ColorConnector />}
//             >
//               {steps.map((label) => (
//                 <Step key={label}>
//                   <StepLabel StepIconComponent={StepIcon}>
//                     <Typography fontWeight={500}>{label}</Typography>
//                   </StepLabel>
//                 </Step>
//               ))}
//             </Stepper>
//           </Box>

//           <DialogContent sx={{ pt: 2, pb: 2, backgroundColor: '#F5F7FA' }}>
//             <Box sx={{ py: 1 }}>
//               {getStepContent(activeStep)}
//             </Box>
//           </DialogContent>

//           <DialogActions sx={{
//             px: 3,
//             py: 2,
//             borderTop: '1px solid #E0E0E0',
//             backgroundColor: '#F8FAFC',
//             display: 'flex',
//             justifyContent: 'space-between'
//           }}>
//             <Button
//               variant="outlined"
//               onClick={handleClose}
//               startIcon={<CloseIcon />}
//             >
//               Close
//             </Button>

//             <Box sx={{ display: 'flex', gap: 1 }}>
//               {activeStep > 0 && (
//                 <Button
//                   onClick={handleBack}
//                   startIcon={<NavigateBeforeIcon />}
//                   sx={{ color: '#666' }}
//                 >
//                   Back
//                 </Button>
//               )}

//               {activeStep < steps.length - 1 ? (
//                 <Button
//                   variant="contained"
//                   onClick={handleNext}
//                   endIcon={<NavigateNextIcon />}
//                   sx={{
//                     background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                     '&:hover': { opacity: 0.9 }
//                   }}
//                 >
//                   Next
//                 </Button>
//               ) : (
//                 <Button
//                   variant="contained"
//                   onClick={handleReset}
//                   sx={{
//                     background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                     '&:hover': { opacity: 0.9 }
//                   }}
//                 >
//                   View from Start
//                 </Button>
//               )}

//               {/* <Button
//                 variant="contained"
//                 onClick={handleEditClick}
//                 startIcon={<EditIcon />}
//                 sx={{
//                   background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                   '&:hover': { opacity: 0.9 },
//                   ml: 1
//                 }}
//               >
//                 Edit Job
//               </Button> */}
//             </Box>
//           </DialogActions>
//         </>
//       ) : null}
//     </Dialog>
//   );
// };

// export default ViewJobOpening;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Divider,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Alert,
  IconButton,
  styled,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  School as SchoolIcon,
  Build as BuildIcon,
  DateRange as DateRangeIcon,
  People as PeopleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Visibility as VisibilityIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  Publish as PublishIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';
import { format } from 'date-fns';

// Color constants matching other components
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

// Custom Stepper Connector
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
    backgroundColor: COLORS.border,
    borderRadius: 1,
  },
}));

// Custom Step Icon
const StepIcon = ({ active, completed, icon }) => {
  const getIcon = () => {
    if (icon === 1) return <InfoIcon sx={{ fontSize: '0.9rem' }} />;
    if (icon === 2) return <AssignmentIcon sx={{ fontSize: '0.9rem' }} />;
    if (icon === 3) return <PublishIcon sx={{ fontSize: '0.9rem' }} />;
    return icon;
  };

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        bgcolor: completed || active ? COLORS.primary : COLORS.border,
        color: completed || active ? COLORS.text.light : COLORS.text.tertiary,
        transition: 'all 0.2s ease',
        boxShadow: active ? `0 0 0 2px ${COLORS.primary}20` : 'none',
        '& svg': { fontSize: '0.9rem' }
      }}
    >
      {completed ? <CheckCircleIcon sx={{ fontSize: '0.9rem' }} /> : getIcon()}
    </Box>
  );
};

const steps = ["Overview", "Requisition Details", "Publishing Status"];

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleOutlineIcon sx={{ fontSize: '0.7rem' }} />, label: 'Open' };
      case 'draft': return { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <VisibilityIcon sx={{ fontSize: '0.7rem' }} />, label: 'Draft' };
      case 'published': return { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleOutlineIcon sx={{ fontSize: '0.7rem' }} />, label: 'Published' };
      case 'closed': return { bg: COLORS.status.error, color: '#991B1B', icon: <CloseIcon sx={{ fontSize: '0.7rem' }} />, label: 'Closed' };
      case 'pending': return { bg: COLORS.status.warning, color: '#92400E', icon: <ScheduleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Pending' };
      default: return { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <InfoIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Unknown' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      size="small"
      icon={config.icon}
      label={config.label}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontWeight: 500,
        fontSize: '0.65rem',
        height: 24,
        '& .MuiChip-icon': { fontSize: '0.7rem', color: config.color },
        '& .MuiChip-label': { px: 1, fontSize: '0.65rem' }
      }}
    />
  );
};

// Priority Chip Component
const PriorityChip = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return { bg: COLORS.status.error, color: '#991B1B', label: 'High' };
      case 'medium': return { bg: COLORS.status.warning, color: '#92400E', label: 'Medium' };
      case 'low': return { bg: COLORS.status.info, color: COLORS.primaryDark, label: 'Low' };
      default: return { bg: COLORS.chips.inactive, color: COLORS.text.secondary, label: priority || 'Not Set' };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Chip
      size="small"
      label={config.label}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontWeight: 500,
        fontSize: '0.65rem',
        height: 24
      }}
    />
  );
};

const ViewJobOpening = ({ open, onClose, jobId, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (open && jobId) {
      fetchJobDetails();
    }
  }, [open, jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setJob(response.data.data);
      } else {
        setError('Failed to fetch job details');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError(err.response?.data?.message || 'Failed to fetch job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP p');
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'linkedin': return <LinkedInIcon sx={{ fontSize: '0.7rem' }} />;
      case 'naukri': return <LanguageIcon sx={{ fontSize: '0.7rem' }} />;
      case 'careerpage': return <BusinessIcon sx={{ fontSize: '0.7rem' }} />;
      case 'indeed': return <WorkIcon sx={{ fontSize: '0.7rem' }} />;
      default: return <LanguageIcon sx={{ fontSize: '0.7rem' }} />;
    }
  };

  const getPlatformStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return COLORS.status.success;
      case 'pending': return COLORS.status.warning;
      case 'failed': return COLORS.status.error;
      default: return COLORS.chips.inactive;
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);
  const handleClose = () => {
    setActiveStep(0);
    setJob(null);
    setError('');
    onClose();
  };

  const handleEditClick = () => {
    onEdit(job);
    handleClose();
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* Company Introduction Section */}
            {job.companyIntro && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <BusinessIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    Company Introduction
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                  {job.companyIntro}
                </Typography>
              </Paper>
            )}

            {/* Job Description Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <DescriptionIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Job Description
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                {job.description}
              </Typography>
            </Paper>

            {/* Quick Information Grid */}
            <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <InfoIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Quick Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Typography sx={labelStyle}>Location</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {job.location || '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Typography sx={labelStyle}>Department</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {job.department || '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Typography sx={labelStyle}>Employment Type</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {job.employmentType || '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Typography sx={labelStyle}>Salary Range</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {job.salaryRange ?
                        `${job.salaryRange.currency || 'INR'} ${job.salaryRange.min?.toLocaleString() || 0} - ${job.salaryRange.max?.toLocaleString() || 0}` : '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Typography sx={labelStyle}>Experience Required</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRangeIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {job.experienceRequired ?
                        `${job.experienceRequired.min} - ${job.experienceRequired.max} years` : '-'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Typography sx={labelStyle}>Job ID</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.primary, fontFamily: 'monospace' }}>
                      {job.jobId}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Requirements Section */}
            {job.requirements?.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    Requirements
                  </Typography>
                  <Chip
                    label={`${job.requirements.length} items`}
                    size="small"
                    sx={{ ml: 'auto', bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 22 }}
                  />
                </Box>
                <Box sx={{ ml: 2 }}>
                  {job.requirements?.map((req, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: '0.7rem', color: COLORS.primary, mt: 0.25 }} />
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {req}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}

            {/* Responsibilities Section */}
            {job.responsibilities?.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <AssignmentIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    Responsibilities
                  </Typography>
                  <Chip
                    label={`${job.responsibilities.length} items`}
                    size="small"
                    sx={{ ml: 'auto', bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 22 }}
                  />
                </Box>
                <Box sx={{ ml: 2 }}>
                  {job.responsibilities?.map((resp, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                      <AssignmentIcon sx={{ fontSize: '0.7rem', color: COLORS.primary, mt: 0.25 }} />
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {resp}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}

            {/* Skills Section */}
            {job.skills?.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <BuildIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    Required Skills
                  </Typography>
                  <Chip
                    label={`${job.skills.length} skills`}
                    size="small"
                    sx={{ ml: 'auto', bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontSize: '0.65rem', height: 22 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {job.skills?.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      size="small"
                      sx={{
                        bgcolor: COLORS.primaryLight,
                        color: COLORS.primaryDark,
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        height: 24
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Education Section */}
            {job.education?.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <SchoolIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    Education Requirements
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {job.education?.map((edu, idx) => (
                    <Chip
                      key={idx}
                      label={edu}
                      size="small"
                      sx={{
                        bgcolor: COLORS.primaryLight,
                        color: COLORS.primaryDark,
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        height: 24
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Created By Section */}
            <Paper sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Created By
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: COLORS.primary, width: 40, height: 40, fontSize: '0.9rem' }}>
                  {job.createdByName?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {job.createdByName || 'Unknown'}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ScheduleIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        {formatDateTime(job.createdAt)}
                      </Typography>
                    </Box>
                    {job.updatedAt && job.updatedAt !== job.createdAt && (
                      <>
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: COLORS.border }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EditIcon sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            Updated: {formatDateTime(job.updatedAt)}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            {job.requisitionId ? (
              <>
                <Paper sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                        {job.requisitionId.positionTitle || job.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Requisition ID: {job.requisitionId.requisitionId || job.requisitionNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <StatusChip status={job.requisitionId.status} />
                      {job.requisitionId.priority && <PriorityChip priority={job.requisitionId.priority} />}
                    </Box>
                  </Stack>
                </Paper>

                <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Department</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {job.requisitionId.department || job.department}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Location</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {job.requisitionId.location || job.location}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Employment Type</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {job.requisitionId.employmentType || job.employmentType}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Number of Positions</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {job.requisitionId.noOfPositions || '-'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Target Hire Date</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {job.requisitionId.targetHireDate ? formatDate(job.requisitionId.targetHireDate) : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Experience Required</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {job.requisitionId.experienceYears ? `${job.requisitionId.experienceYears} years` : '-'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Budget Range</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {job.requisitionId.budgetMin && job.requisitionId.budgetMax ?
                          `${job.salaryRange?.currency || 'INR'} ${job.requisitionId.budgetMin?.toLocaleString()} - ${job.requisitionId.budgetMax?.toLocaleString()}` : '-'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Grade</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {job.requisitionId.grade || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Approval Information */}
                {job.requisitionId.approvalDate && (
                  <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
                      Approval Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Approved By</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {job.requisitionId.approvedByName || 'Unknown'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={labelStyle}>Approval Date</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {formatDateTime(job.requisitionId.approvalDate)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                )}

                {/* Created By Info */}
                <Paper sx={{ p: 2, bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, mb: 1.5 }}>
                    Requisition Created By
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: COLORS.primary, width: 40, height: 40 }}>
                      {job.requisitionId.createdByName?.[0] || 'U'}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.text.primary }}>
                        {job.requisitionId.createdByName || 'Unknown'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        Created: {formatDateTime(job.requisitionId.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                No requisition linked to this job
              </Alert>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2}>
            {job.publishTo?.length > 0 ? (
              job.publishTo.map((platform, idx) => (
                <Paper key={idx} sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: COLORS.primaryLight, width: 36, height: 36 }}>
                        {getPlatformIcon(platform.platform)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary, textTransform: 'capitalize' }}>
                          {platform.platform}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Job ID: {job.jobId}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip
                      size="small"
                      label={platform.status}
                      sx={{
                        bgcolor: getPlatformStatusColor(platform.status),
                        color: platform.status?.toLowerCase() === 'published' ? COLORS.primaryDark : '#fff',
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        height: 24
                      }}
                    />
                  </Stack>
                  {platform.errorMessage && (
                    <Alert severity="error" sx={{ mt: 1.5, borderRadius: 1.5, fontSize: '0.7rem' }}>
                      {platform.errorMessage}
                    </Alert>
                  )}
                </Paper>
              ))
            ) : (
              <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                This job has not been published yet
              </Alert>
            )}
          </Stack>
        );

      default: return null;
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
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        bgcolor: COLORS.background.tableHeader,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon sx={{ fontSize: '1rem', color: COLORS.text.light }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.light }}>
            Job Details
          </Typography>
          {job && (
            <Chip
              label={job.jobId}
              size="small"
              sx={{ bgcolor: COLORS.text.light, color: COLORS.primary, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
            />
          )}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.light }} />
        </IconButton>
      </DialogTitle>

      {loading ? (
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress size={40} sx={{ color: COLORS.primary }} />
        </DialogContent>
      ) : error ? (
        <DialogContent>
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        </DialogContent>
      ) : job ? (
        <>
          <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
            <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={(props) => <StepIcon {...props} icon={steps.indexOf(label) + 1} />}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
            {getStepContent(activeStep)}
          </DialogContent>

          <DialogActions sx={{
            px: 2.5,
            py: 1.5,
            borderTop: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.white,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                height: 32,
                px: 2,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text.secondary,
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
              }}
            >
              Close
            </Button>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
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
                    '&:hover': { borderColor: COLORS.primary, bgcolor: `${COLORS.primary}10` }
                  }}
                >
                  Back
                </Button>
              )}

              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
                  sx={{
                    height: 32,
                    px: 2,
                    borderRadius: 1.5,
                    bgcolor: COLORS.primary,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': { bgcolor: COLORS.primaryDark }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleReset}
                  sx={{
                    height: 32,
                    px: 2,
                    borderRadius: 1.5,
                    bgcolor: COLORS.primary,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': { bgcolor: COLORS.primaryDark }
                  }}
                >
                  View from Start
                </Button>
              )}
            </Box>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};

export default ViewJobOpening;