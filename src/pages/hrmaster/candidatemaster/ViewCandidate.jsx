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
//   Grid,
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
//   stepConnectorClasses,
//   Box,
//   Paper,
//   Avatar,
//   IconButton,
//   CircularProgress,
//   Alert,
//   styled
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Work as WorkIcon,
//   School as SchoolIcon,
//   LocationOn as LocationIcon,
//   CalendarToday as CalendarIcon,
//   Description as ResumeIcon,
//   Download as DownloadIcon,
//   Star as StarIcon,
//   BusinessCenter as JobIcon,
//   Assignment as AssignmentIcon,
//   History as HistoryIcon,
//   Comment as CommentIcon,
//   ThumbUp as ThumbUpIcon,
//   ThumbDown as ThumbDownIcon,
//   Pending as PendingIcon,
//   CheckCircle as CheckCircleIcon,
//   Error as ErrorIcon,
//   CloudUpload as CloudUploadIcon,
//   LinkedIn as LinkedInIcon,
//   Language as LanguageIcon,
//   Business as BusinessIcon,
//   People as PeopleIcon,
//   NavigateNext as NavigateNextIcon,
//   NavigateBefore as NavigateBeforeIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // 🔥 Modern Stepper Connector with Gradient (exactly like reference)
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

// // Custom Step Icon with better styling (exactly like reference)
// const StepIcon = ({ active, completed, icon }) => {
//   const getIcon = () => {
//     if (icon === 1) return <PersonIcon fontSize="small" />;
//     if (icon === 2) return <EmailIcon fontSize="small" />;
//     if (icon === 3) return <SchoolIcon fontSize="small" />;
//     if (icon === 4) return <WorkIcon fontSize="small" />;
//     if (icon === 5) return <AssignmentIcon fontSize="small" />;
//     return icon;
//   };

//   return (
//     <Box
//       sx={{
//         width: 32,
//         height: 32,
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

// // Status color mapping
// const STATUS_COLORS = {
//   new: { bg: '#E3F2FD', color: '#1976D2', icon: <PendingIcon />, label: 'New' },
//   contacted: { bg: '#F3E5F5', color: '#7B1FA2', icon: <PersonIcon />, label: 'Contacted' },
//   shortlisted: { bg: '#E8F5E8', color: '#2E7D32', icon: <ThumbUpIcon />, label: 'Shortlisted' },
//   interviewed: { bg: '#E1F5FE', color: '#0288D1', icon: <PersonIcon />, label: 'Interviewed' },
//   selected: { bg: '#E8F5E8', color: '#2E7D32', icon: <CheckCircleIcon />, label: 'Selected' },
//   rejected: { bg: '#FFEBEE', color: '#C62828', icon: <ThumbDownIcon />, label: 'Rejected' },
//   onHold: { bg: '#FFF8E1', color: '#FF8F00', icon: <PendingIcon />, label: 'On Hold' },
//   joined: { bg: '#E8F5E8', color: '#1B5E20', icon: <CheckCircleIcon />, label: 'Joined' }
// };

// // Source icon mapping
// const SOURCE_ICONS = {
//   'naukri': { icon: <LanguageIcon />, color: '#FF5722', label: 'Naukri' },
//   'linkedin': { icon: <LinkedInIcon />, color: '#0077B5', label: 'LinkedIn' },
//   'indeed': { icon: <WorkIcon />, color: '#003A9B', label: 'Indeed' },
//   'walkin': { icon: <PersonIcon />, color: '#4CAF50', label: 'Walk-in' },
//   'reference': { icon: <PeopleIcon />, color: '#9C27B0', label: 'Reference' },
//   'careerPage': { icon: <BusinessIcon />, color: '#FF9800', label: 'Career Page' },
//   'upload': { icon: <CloudUploadIcon />, color: '#00BCD4', label: 'Upload' },
//   'other': { icon: <PersonIcon />, color: '#9E9E9E', label: 'Other' }
// };

// const ViewCandidate = ({ open, onClose, candidateId }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [candidate, setCandidate] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const steps = [
//     'Personal Information',
//     'Contact & Address',
//     'Education & Skills',
//     'Work Experience',
//     'Applications & Notes'
//   ];

//   useEffect(() => {
//     if (open && candidateId) {
//       fetchCandidateDetails();
//     }
//   }, [open, candidateId]);

//   const fetchCandidateDetails = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/candidates/${candidateId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         setCandidate(response.data.data);
//       } else {
//         setError(response.data.message || 'Failed to fetch candidate details');
//       }
//     } catch (err) {
//       console.error('Error fetching candidate details:', err);
//       setError(err.response?.data?.message || 'Failed to fetch candidate details. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatShortDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getStatusStyle = (status) => {
//     return STATUS_COLORS[status] || { 
//       bg: '#EEEEEE', 
//       color: '#616161', 
//       icon: <PersonIcon />, 
//       label: status || 'Unknown' 
//     };
//   };

//   const getSourceInfo = (source) => {
//     return SOURCE_ICONS[source] || { 
//       icon: <PersonIcon />, 
//       color: '#9E9E9E', 
//       label: source || 'Other' 
//     };
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
//     setCandidate(null);
//     setError('');
//     onClose();
//   };

//   const handleViewResume = () => {
//     if (candidate?.resume?.fileUrl) {
//       window.open(`${BASE_URL}${candidate.resume.fileUrl}`, '_blank');
//     }
//   };

//   const handleDownloadResume = () => {
//     if (candidate?.resume?.fileUrl) {
//       const link = document.createElement('a');
//       link.href = `${BASE_URL}${candidate.resume.fileUrl}`;
//       link.download = candidate.resume.filename || 'resume.pdf';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const getStepContent = (step) => {
//     if (!candidate) return null;

//     const statusStyle = getStatusStyle(candidate.status);
//     const sourceInfo = getSourceInfo(candidate.source);

//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={3}>
//             {/* Profile Header Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
//                 <Avatar 
//                   sx={{ 
//                     width: 80, 
//                     height: 80, 
//                     bgcolor: '#E3F2FD',
//                     color: '#1976D2',
//                     fontSize: '32px',
//                     fontWeight: 600
//                   }}
//                 >
//                   {candidate.firstName?.[0]}{candidate.lastName?.[0]}
//                 </Avatar>
//                 <Box sx={{ flex: 1 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
//                     <Typography variant="h5" fontWeight={600}>
//                       {candidate.fullName || `${candidate.firstName} ${candidate.lastName}`}
//                     </Typography>
//                     <Chip
//                       label={candidate.candidateId}
//                       size="small"
//                       sx={{ 
//                         bgcolor: '#E3F2FD', 
//                         color: '#1976D2', 
//                         fontWeight: 500,
//                         height: 24
//                       }}
//                     />
//                   </Box>
//                   <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                     <Chip
//                       size="small"
//                       icon={statusStyle.icon}
//                       label={statusStyle.label}
//                       sx={{
//                         backgroundColor: statusStyle.bg,
//                         color: statusStyle.color,
//                         fontWeight: 500,
//                         '& .MuiChip-icon': { color: statusStyle.color }
//                       }}
//                     />
//                     <Chip
//                       size="small"
//                       icon={sourceInfo.icon}
//                       label={sourceInfo.label}
//                       sx={{
//                         backgroundColor: '#E3F2FD',
//                         color: sourceInfo.color,
//                         fontWeight: 500,
//                         '& .MuiChip-icon': { color: sourceInfo.color }
//                       }}
//                     />
//                   </Box>
//                 </Box>
//                 {candidate.resume && (
//                   <Box sx={{ display: 'flex', gap: 1 }}>
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       startIcon={<ResumeIcon />}
//                       onClick={handleViewResume}
//                       sx={{ borderRadius: 1.5, textTransform: 'none' }}
//                     >
//                       View
//                     </Button>
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       startIcon={<DownloadIcon />}
//                       onClick={handleDownloadResume}
//                       sx={{ borderRadius: 1.5, textTransform: 'none' }}
//                     >
//                       Download
//                     </Button>
//                   </Box>
//                 )}
//               </Box>
//             </Paper>

//             {/* Personal Information Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <PersonIcon sx={{ color: '#1976D2' }} />
//                 Personal Information
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Email Address
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <EmailIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                       <Typography variant="body1">{candidate.email}</Typography>
//                     </Box>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Phone Number
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <PhoneIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                       <Typography variant="body1">{candidate.phone}</Typography>
//                     </Box>
//                   </Box>
//                 </Grid>

//                 {candidate.dateOfBirth && (
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                         Date of Birth
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <CalendarIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                         <Typography variant="body1">{formatShortDate(candidate.dateOfBirth)}</Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                 )}

//                 {candidate.gender && (
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                         Gender
//                       </Typography>
//                       <Typography variant="body1">
//                         {candidate.gender === 'M' ? 'Male' : candidate.gender === 'F' ? 'Female' : 'Other'}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>

//             {/* System Information Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <HistoryIcon sx={{ color: '#1976D2' }} />
//                 System Information
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Created At
//                     </Typography>
//                     <Typography variant="body2">
//                       {formatDate(candidate.createdAt)}
//                       {candidate.createdByName && ` by ${candidate.createdByName}`}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Last Updated
//                     </Typography>
//                     <Typography variant="body2">
//                       {formatDate(candidate.updatedAt)}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={3}>
//             {/* Contact Information Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <EmailIcon sx={{ color: '#1976D2' }} />
//                 Contact Information
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Email Address
//                     </Typography>
//                     <Typography variant="body1">{candidate.email}</Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Phone Number
//                     </Typography>
//                     <Typography variant="body1">{candidate.phone}</Typography>
//                   </Box>
//                 </Grid>

//                 {candidate.dateOfBirth && (
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                         Date of Birth
//                       </Typography>
//                       <Typography variant="body1">{formatShortDate(candidate.dateOfBirth)}</Typography>
//                     </Box>
//                   </Grid>
//                 )}

//                 {candidate.gender && (
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                         Gender
//                       </Typography>
//                       <Typography variant="body1">
//                         {candidate.gender === 'M' ? 'Male' : candidate.gender === 'F' ? 'Female' : 'Other'}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>

//             {/* Address Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <LocationIcon sx={{ color: '#1976D2' }} />
//                 Address Information
//               </Typography>
//               {candidate.address ? (
//                 <Grid container spacing={3}>
//                   {candidate.address.street && (
//                     <Grid item xs={12}>
//                       <Box sx={{ mb: 2 }}>
//                         <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                           Street
//                         </Typography>
//                         <Typography variant="body1">{candidate.address.street}</Typography>
//                       </Box>
//                     </Grid>
//                   )}
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                         City
//                       </Typography>
//                       <Typography variant="body1">{candidate.address?.city || 'N/A'}</Typography>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                         State
//                       </Typography>
//                       <Typography variant="body1">{candidate.address?.state || 'N/A'}</Typography>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                         Pincode
//                       </Typography>
//                       <Typography variant="body1">{candidate.address?.pincode || 'N/A'}</Typography>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                         Country
//                       </Typography>
//                       <Typography variant="body1">{candidate.address?.country || 'India'}</Typography>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               ) : (
//                 <Typography color="textSecondary">No address information available</Typography>
//               )}
//             </Paper>
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={3}>
//             {/* Education Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <SchoolIcon sx={{ color: '#1976D2' }} />
//                 Education
//               </Typography>
//               {candidate.education && candidate.education.length > 0 ? (
//                 <Stack spacing={2}>
//                   {candidate.education.map((edu, index) => (
//                     <Paper key={edu._id || index} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={4}>
//                           <Typography variant="caption" color="textSecondary">Degree</Typography>
//                           <Typography variant="body2" fontWeight={500}>{edu.degree}</Typography>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <Typography variant="caption" color="textSecondary">Institution</Typography>
//                           <Typography variant="body2">{edu.institution}</Typography>
//                         </Grid>
//                         <Grid item xs={12} md={2}>
//                           <Typography variant="caption" color="textSecondary">Year</Typography>
//                           <Typography variant="body2">{edu.yearOfPassing}</Typography>
//                         </Grid>
//                         <Grid item xs={12} md={2}>
//                           <Typography variant="caption" color="textSecondary">Specialization</Typography>
//                           <Typography variant="body2">{edu.specialization || '-'}</Typography>
//                         </Grid>
//                       </Grid>
//                     </Paper>
//                   ))}
//                 </Stack>
//               ) : (
//                 <Typography color="textSecondary">No education details available</Typography>
//               )}
//             </Paper>

//             {/* Skills Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <StarIcon sx={{ color: '#1976D2' }} />
//                 Skills
//               </Typography>
//               {candidate.skills && candidate.skills.length > 0 ? (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                   {candidate.skills.map((skill, index) => (
//                     <Chip
//                       key={index}
//                       label={skill}
//                       size="small"
//                       sx={{
//                         backgroundColor: '#E3F2FD',
//                         color: '#1976D2',
//                         fontWeight: 500
//                       }}
//                     />
//                   ))}
//                 </Box>
//               ) : (
//                 <Typography color="textSecondary">No skills listed</Typography>
//               )}
//             </Paper>
//           </Stack>
//         );

//       case 3:
//         return (
//           <Stack spacing={3}>
//             {/* Experience Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <WorkIcon sx={{ color: '#1976D2' }} />
//                 Work Experience
//               </Typography>
//               {candidate.experience && candidate.experience.length > 0 ? (
//                 <Stack spacing={2}>
//                   {candidate.experience.map((exp, index) => (
//                     <Paper key={exp._id || index} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={4}>
//                           <Typography variant="caption" color="textSecondary">Position</Typography>
//                           <Typography variant="body2" fontWeight={500}>{exp.position}</Typography>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <Typography variant="caption" color="textSecondary">Company</Typography>
//                           <Typography variant="body2">{exp.company}</Typography>
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <Typography variant="caption" color="textSecondary">Duration</Typography>
//                           <Typography variant="body2">
//                             {exp.fromDate ? formatShortDate(exp.fromDate) : 'N/A'} - 
//                             {exp.current ? 'Present' : (exp.toDate ? formatShortDate(exp.toDate) : 'N/A')}
//                           </Typography>
//                         </Grid>
//                         {exp.description && (
//                           <Grid item xs={12}>
//                             <Typography variant="caption" color="textSecondary">Description</Typography>
//                             <Typography variant="body2">{exp.description}</Typography>
//                           </Grid>
//                         )}
//                       </Grid>
//                     </Paper>
//                   ))}
//                 </Stack>
//               ) : (
//                 <Typography color="textSecondary">No experience details available</Typography>
//               )}
//             </Paper>
//           </Stack>
//         );

//       case 4:
//         return (
//           <Stack spacing={3}>
//             {/* Applications Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <AssignmentIcon sx={{ color: '#1976D2' }} />
//                 Job Applications
//               </Typography>
//               {candidate.applications && candidate.applications.length > 0 ? (
//                 <Stack spacing={2}>
//                   {candidate.applications.map((app) => {
//                     const appStatusStyle = getStatusStyle(app.status);
//                     return (
//                       <Paper key={app._id} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
//                           <JobIcon sx={{ color: '#1976D2', fontSize: 20 }} />
//                           <Typography variant="subtitle2" fontWeight={600}>
//                             Application #{app.applicationId}
//                           </Typography>
//                           <Chip
//                             label={app.status}
//                             size="small"
//                             sx={{
//                               backgroundColor: appStatusStyle.bg,
//                               color: appStatusStyle.color,
//                               fontWeight: 500,
//                               height: 20,
//                               fontSize: '10px'
//                             }}
//                           />
//                         </Box>
//                         <Grid container spacing={2}>
//                           <Grid item xs={6} sm={3}>
//                             <Typography variant="caption" color="textSecondary">Job Title</Typography>
//                             <Typography variant="body2">{app.jobId?.title}</Typography>
//                           </Grid>
//                           <Grid item xs={6} sm={3}>
//                             <Typography variant="caption" color="textSecondary">Job ID</Typography>
//                             <Typography variant="body2">{app.jobId?.jobId}</Typography>
//                           </Grid>
//                           <Grid item xs={6} sm={3}>
//                             <Typography variant="caption" color="textSecondary">Applied Date</Typography>
//                             <Typography variant="body2">{formatShortDate(app.appliedDate)}</Typography>
//                           </Grid>
//                           <Grid item xs={6} sm={3}>
//                             <Typography variant="caption" color="textSecondary">Source</Typography>
//                             <Typography variant="body2">{app.source}</Typography>
//                           </Grid>
//                         </Grid>
//                       </Paper>
//                     );
//                   })}
//                 </Stack>
//               ) : (
//                 <Typography color="textSecondary">No applications found</Typography>
//               )}
//             </Paper>

//             {/* Notes Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <CommentIcon sx={{ color: '#1976D2' }} />
//                 Notes & Activity
//               </Typography>
//               {candidate.notes && candidate.notes.length > 0 ? (
//                 <Stack spacing={2}>
//                   {candidate.notes.slice().reverse().map((note, index) => (
//                     <Paper key={note._id || index} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
//                       <Box sx={{ display: 'flex', gap: 2 }}>
//                         <Avatar sx={{ width: 32, height: 32, bgcolor: '#7B1FA2', fontSize: '14px' }}>
//                           {note.createdByName?.[0] || 'S'}
//                         </Avatar>
//                         <Box sx={{ flex: 1 }}>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
//                             <Typography variant="subtitle2" fontWeight={600}>
//                               {note.createdByName || 'System'}
//                             </Typography>
//                             <Typography variant="caption" color="textSecondary">
//                               {formatDate(note.createdAt)}
//                             </Typography>
//                           </Box>
//                           <Typography variant="body2">{note.text}</Typography>
//                         </Box>
//                       </Box>
//                     </Paper>
//                   ))}
//                 </Stack>
//               ) : (
//                 <Typography color="textSecondary">No notes available</Typography>
//               )}
//             </Paper>
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
//       PaperProps={{ sx: { borderRadius: 1.5 } }}
//     >
//       <DialogTitle sx={{
//         borderBottom: '1px solid #E0E0E0',
//         py: 1.5,
//         px: 2,
//         backgroundColor: '#F8FAFC',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <PersonIcon sx={{ color: '#1976D2' }} />
//           <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#101010' }}>
//             Candidate Details
//           </Typography>
//           {candidate && (
//             <Chip
//               label={candidate.candidateId}
//               size="small"
//               sx={{ 
//                 bgcolor: '#E3F2FD', 
//                 color: '#1976D2', 
//                 fontWeight: 500,
//                 height: 24,
//                 fontSize: '12px',
//                 ml: 1
//               }}
//             />
//           )}
//         </Box>
//         <IconButton onClick={handleClose} size="small">
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       {/* 🔥 Modern Stepper with Gradient Connector */}
//       {!loading && candidate && (
//         <Box sx={{ px: 2, pt: 1, backgroundColor: '#F8FAFC' }}>
//           <Stepper
//             activeStep={activeStep}
//             alternativeLabel
//             connector={<ColorConnector />}
//           >
//             {steps.map((label, index) => (
//               <Step key={label}>
//                 <StepLabel StepIconComponent={StepIcon}>
//                   <Typography fontWeight={500} fontSize="0.8rem">{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Box>
//       )}

//       <DialogContent sx={{ p: 2, overflow: 'auto', backgroundColor: '#F5F7FA' }}>
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//             <CircularProgress size={40} sx={{ color: '#1976D2' }} />
//           </Box>
//         ) : error ? (
//           <Alert 
//             severity="error" 
//             sx={{ borderRadius: 1, mb: 2 }}
//             onClose={() => setError('')}
//             action={
//               <Button color="inherit" size="small" onClick={fetchCandidateDetails}>
//                 Retry
//               </Button>
//             }
//           >
//             {error}
//           </Alert>
//         ) : candidate ? (
//           <Box sx={{ py: 1 }}>
//             {getStepContent(activeStep)}
//           </Box>
//         ) : null}
//       </DialogContent>

//       {candidate && !loading && !error && (
//         <DialogActions sx={{
//           px: 2,
//           py: 1.5,
//           borderTop: '1px solid #E0E0E0',
//           backgroundColor: '#F8FAFC',
//           justifyContent: 'space-between'
//         }}>
//           <Button
//             onClick={handleBack}
//             disabled={activeStep === 0}
//             size="small"
//             startIcon={<NavigateBeforeIcon />}
//             sx={{ color: '#666' }}
//           >
//             Back
//           </Button>

//           <Box>
//             <Button
//               onClick={handleClose}
//               size="small"
//               sx={{ mr: 1, color: '#666' }}
//             >
//               Close
//             </Button>

//             {activeStep === steps.length - 1 ? (
//               <Button
//                 variant="contained"
//                 onClick={handleReset}
//                 size="small"
//                 sx={{
//                   backgroundColor: '#1976D2',
//                   '&:hover': { backgroundColor: '#1565C0' }
//                 }}
//               >
//                 View from Start
//               </Button>
//             ) : (
//               <Button
//                 variant="contained"
//                 onClick={handleNext}
//                 size="small"
//                 endIcon={<NavigateNextIcon />}
//                 sx={{
//                   backgroundColor: '#1976D2',
//                   '&:hover': { backgroundColor: '#1565C0' }
//                 }}
//               >
//                 Next
//               </Button>
//             )}
//           </Box>
//         </DialogActions>
//       )}
//     </Dialog>
//   );
// };

// export default ViewCandidate;

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
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Box,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  styled,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Description as ResumeIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  BusinessCenter as JobIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  CloudUpload as CloudUploadIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

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
    if (icon === 1) return <PersonIcon sx={{ fontSize: '0.9rem' }} />;
    if (icon === 2) return <EmailIcon sx={{ fontSize: '0.9rem' }} />;
    if (icon === 3) return <SchoolIcon sx={{ fontSize: '0.9rem' }} />;
    if (icon === 4) return <WorkIcon sx={{ fontSize: '0.9rem' }} />;
    if (icon === 5) return <AssignmentIcon sx={{ fontSize: '0.9rem' }} />;
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

// Status color mapping
const STATUS_COLORS = {
  new: { bg: COLORS.status.info, color: COLORS.primaryDark, icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: 'New' },
  contacted: { bg: '#F3E5F5', color: '#7B1FA2', icon: <PersonIcon sx={{ fontSize: '0.7rem' }} />, label: 'Contacted' },
  shortlisted: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <ThumbUpIcon sx={{ fontSize: '0.7rem' }} />, label: 'Shortlisted' },
  interviewed: { bg: '#E1F5FE', color: '#0288D1', icon: <PersonIcon sx={{ fontSize: '0.7rem' }} />, label: 'Interviewed' },
  selected: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Selected' },
  rejected: { bg: COLORS.status.error, color: '#991B1B', icon: <ThumbDownIcon sx={{ fontSize: '0.7rem' }} />, label: 'Rejected' },
  onHold: { bg: COLORS.status.warning, color: '#92400E', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: 'On Hold' },
  joined: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Joined' }
};

// Source icon mapping
const getSourceInfo = (source) => {
  switch (source?.toLowerCase()) {
    case 'naukri': return { icon: <LanguageIcon sx={{ fontSize: '0.7rem' }} />, color: '#FF5722', label: 'Naukri' };
    case 'linkedin': return { icon: <LinkedInIcon sx={{ fontSize: '0.7rem' }} />, color: '#0077B5', label: 'LinkedIn' };
    case 'indeed': return { icon: <WorkIcon sx={{ fontSize: '0.7rem' }} />, color: '#003A9B', label: 'Indeed' };
    case 'walkin': return { icon: <PersonIcon sx={{ fontSize: '0.7rem' }} />, color: '#4CAF50', label: 'Walk-in' };
    case 'reference': return { icon: <PeopleIcon sx={{ fontSize: '0.7rem' }} />, color: '#9C27B0', label: 'Reference' };
    case 'careerPage': return { icon: <BusinessIcon sx={{ fontSize: '0.7rem' }} />, color: '#FF9800', label: 'Career Page' };
    case 'upload': return { icon: <CloudUploadIcon sx={{ fontSize: '0.7rem' }} />, color: '#00BCD4', label: 'Upload' };
    default: return { icon: <PersonIcon sx={{ fontSize: '0.7rem' }} />, color: '#9E9E9E', label: source || 'Other' };
  }
};

const steps = ['Personal Info', 'Contact & Address', 'Education & Skills', 'Work Experience', 'Applications & Notes'];

const ViewCandidate = ({ open, onClose, candidateId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && candidateId) {
      fetchCandidateDetails();
    }
  }, [open, candidateId]);

  const fetchCandidateDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/candidates/${candidateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setCandidate(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch candidate details');
      }
    } catch (err) {
      console.error('Error fetching candidate details:', err);
      setError(err.response?.data?.message || 'Failed to fetch candidate details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
    return STATUS_COLORS[status] || { 
      bg: COLORS.chips.inactive, 
      color: COLORS.text.secondary, 
      icon: <PersonIcon sx={{ fontSize: '0.7rem' }} />, 
      label: status || 'Unknown' 
    };
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);
  const handleClose = () => {
    setActiveStep(0);
    setCandidate(null);
    setError('');
    onClose();
  };

  const handleViewResume = () => {
    if (candidate?.resume?.fileUrl) {
      window.open(`${BASE_URL}${candidate.resume.fileUrl}`, '_blank');
    }
  };

  const handleDownloadResume = () => {
    if (candidate?.resume?.fileUrl) {
      const link = document.createElement('a');
      link.href = `${BASE_URL}${candidate.resume.fileUrl}`;
      link.download = candidate.resume.filename || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const labelStyle = {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  const getStepContent = (step) => {
    if (!candidate) return null;

    const statusStyle = getStatusStyle(candidate.status);
    const sourceInfo = getSourceInfo(candidate.source);

    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.primaryLight, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.primary}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: COLORS.primary, fontSize: '1.5rem', fontWeight: 600 }}>
                  {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {candidate.firstName} {candidate.lastName}
                    </Typography>
                    <Chip
                      label={candidate.candidateId}
                      size="small"
                      sx={{ bgcolor: COLORS.background.white, color: COLORS.primary, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      icon={statusStyle.icon}
                      label={statusStyle.label}
                      sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
                    />
                    <Chip
                      size="small"
                      icon={sourceInfo.icon}
                      label={sourceInfo.label}
                      sx={{ bgcolor: COLORS.background.white, color: sourceInfo.color, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
                    />
                  </Box>
                </Box>
                {candidate.resume && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Resume">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ResumeIcon sx={{ fontSize: '0.9rem' }} />}
                        onClick={handleViewResume}
                        sx={{ borderRadius: 1.5, textTransform: 'none', fontSize: '0.7rem', borderColor: COLORS.border, color: COLORS.primary }}
                      >
                        View
                      </Button>
                    </Tooltip>
                    <Tooltip title="Download Resume">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon sx={{ fontSize: '0.9rem' }} />}
                        onClick={handleDownloadResume}
                        sx={{ borderRadius: 1.5, textTransform: 'none', fontSize: '0.7rem', borderColor: COLORS.border, color: COLORS.primary }}
                      >
                        Download
                      </Button>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </Paper>

            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Personal Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Email Address</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{candidate.email}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Phone Number</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{candidate.phone}</Typography>
                  </Box>
                </Grid>
                {candidate.dateOfBirth && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Date of Birth</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ fontSize: '0.9rem', color: COLORS.primary }} />
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formatShortDate(candidate.dateOfBirth)}</Typography>
                    </Box>
                  </Grid>
                )}
                {candidate.gender && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Gender</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {candidate.gender === 'M' ? 'Male' : candidate.gender === 'F' ? 'Female' : 'Other'}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <HistoryIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  System Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Created At</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {formatDateTime(candidate.createdAt)}
                    {candidate.createdByName && ` by ${candidate.createdByName}`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={labelStyle}>Last Updated</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {formatDateTime(candidate.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LocationIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Address Information
                </Typography>
              </Box>
              {candidate.address ? (
                <Grid container spacing={2}>
                  {candidate.address.street && (
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={labelStyle}>Street</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{candidate.address.street}</Typography>
                    </Grid>
                  )}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>City</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{candidate.address?.city || 'N/A'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>State</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{candidate.address?.state || 'N/A'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Pincode</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{candidate.address?.pincode || 'N/A'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={labelStyle}>Country</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{candidate.address?.country || 'India'}</Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No address information available
                </Typography>
              )}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SchoolIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Education
                </Typography>
              </Box>
              {candidate.education && candidate.education.length > 0 ? (
                <Stack spacing={1.5}>
                  {candidate.education.map((edu, index) => (
                    <Paper key={edu._id || index} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={labelStyle}>Degree</Typography>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{edu.degree}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={labelStyle}>Institution</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{edu.institution}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 2 }}>
                          <Typography sx={labelStyle}>Year</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{edu.yearOfPassing}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 2 }}>
                          <Typography sx={labelStyle}>Specialization</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{edu.specialization || '-'}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No education details available
                </Typography>
              )}
            </Paper>

            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <StarIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Skills
                </Typography>
              </Box>
              {candidate.skills && candidate.skills.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {candidate.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No skills listed
                </Typography>
              )}
            </Paper>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <WorkIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Work Experience
                </Typography>
              </Box>
              {candidate.experience && candidate.experience.length > 0 ? (
                <Stack spacing={1.5}>
                  {candidate.experience.map((exp, index) => (
                    <Paper key={exp._id || index} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={labelStyle}>Position</Typography>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{exp.position}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={labelStyle}>Company</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{exp.company}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={labelStyle}>Duration</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {exp.fromDate ? formatShortDate(exp.fromDate) : 'N/A'} - 
                            {exp.current ? 'Present' : (exp.toDate ? formatShortDate(exp.toDate) : 'N/A')}
                          </Typography>
                        </Grid>
                        {exp.description && (
                          <Grid size={{ xs: 12 }}>
                            <Typography sx={labelStyle}>Description</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{exp.description}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No experience details available
                </Typography>
              )}
            </Paper>
          </Stack>
        );

      case 4:
        return (
          <Stack spacing={2}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <AssignmentIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Job Applications
                </Typography>
              </Box>
              {candidate.applications && candidate.applications.length > 0 ? (
                <Stack spacing={1.5}>
                  {candidate.applications.map((app) => {
                    const appStatusStyle = getStatusStyle(app.status);
                    return (
                      <Paper key={app._id} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                          <JobIcon sx={{ color: COLORS.primary, fontSize: '0.9rem' }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                            Application #{app.applicationId}
                          </Typography>
                          <Chip
                            label={app.status}
                            size="small"
                            sx={{ bgcolor: appStatusStyle.bg, color: appStatusStyle.color, fontWeight: 500, fontSize: '0.6rem', height: 20 }}
                          />
                        </Box>
                        <Grid container spacing={1.5}>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography sx={labelStyle}>Job Title</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{app.jobId?.title}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography sx={labelStyle}>Job ID</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{app.jobId?.jobId}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography sx={labelStyle}>Applied Date</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{formatShortDate(app.appliedDate)}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography sx={labelStyle}>Source</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{app.source}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No applications found
                </Typography>
              )}
            </Paper>

            <Paper sx={{ 
              p: 2, 
              bgcolor: COLORS.background.white, 
              borderRadius: 1.5, 
              border: `1px solid ${COLORS.border}`,
              boxShadow: 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CommentIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  Notes & Activity
                </Typography>
              </Box>
              {candidate.notes && candidate.notes.length > 0 ? (
                <Stack spacing={1.5}>
                  {candidate.notes.slice().reverse().map((note, index) => (
                    <Paper key={note._id || index} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#7B1FA2', fontSize: '0.75rem' }}>
                          {note.createdByName?.[0] || 'S'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {note.createdByName || 'System'}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {formatDateTime(note.createdAt)}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{note.text}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, fontStyle: 'italic' }}>
                  No notes available
                </Typography>
              )}
            </Paper>
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Candidate Details
          </Typography>
          {candidate && (
            <Chip
              label={candidate.candidateId}
              size="small"
              sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
            />
          )}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      {!loading && candidate && (
        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={(props) => <StepIcon {...props} icon={index + 1} />}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: COLORS.text.secondary }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light, overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
            action={
              <Button color="inherit" size="small" onClick={fetchCandidateDetails}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : candidate ? (
          getStepContent(activeStep)
        ) : null}
      </DialogContent>

      {candidate && !loading && !error && (
        <DialogActions sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.background.white,
          justifyContent: 'space-between'
        }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
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

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
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

            {activeStep === steps.length - 1 ? (
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
            ) : (
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
            )}
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ViewCandidate;