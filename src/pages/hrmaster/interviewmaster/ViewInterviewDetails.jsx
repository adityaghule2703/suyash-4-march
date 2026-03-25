// import React, { useState, useEffect } from 'react';
// import {
//   // Layout components
//   Box,
//   Paper,
//   Grid,
  
//   // Feedback components
//   Alert,
//   CircularProgress,
  
//   // Data display
//   Typography,
//   Chip,
//   Divider,
//   Avatar,
//   Rating,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
  
//   // Buttons and actions
//   Button,
//   IconButton,
  
//   // Navigation
//   Link,
//   styled,
  
//   // Surfaces
//   Stepper,
//   Step,
//   StepLabel,
//   StepConnector,
  
//   // Utils
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tooltip,
//   useMediaQuery,
//   useTheme,
  
// } from '@mui/material';
// import { 
//   Close as CloseIcon,
//   Person as PersonIcon,
//   Work as WorkIcon,
//   School as SchoolIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   LocationOn as LocationIcon,
//   Schedule as ScheduleIcon,
//   Event as EventIcon,
//   VideoCall as VideoCallIcon,
//   Description as DescriptionIcon,
//   History as HistoryIcon,
//   Star as StarIcon,
//   StarBorder as StarBorderIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon,
//   AccessTime as AccessTimeIcon,
//   Business as BusinessIcon,
//   AccountCircle as AccountCircleIcon,
//   Feedback as FeedbackIcon,
//   Timeline as TimelineIcon,
//   ThumbUp as ThumbUpIcon,
//   ThumbDown as ThumbDownIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Refresh as RefreshIcon,
//   NoteAdd as NoteAddIcon,
//   FiberManualRecord as FiberManualRecordIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

// // Custom Stepper Connector
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

// // Styled Rating component
// const StyledRating = styled(Rating)({
//   '& .MuiRating-iconFilled': {
//     color: '#1976D2',
//   },
//   '& .MuiRating-iconHover': {
//     color: '#1565C0',
//   },
// });

// // Status color mapping
// const STATUS_COLORS = {
//   'scheduled': { color: '#1976D2', bgColor: '#E3F2FD', icon: <ScheduleIcon />, label: 'Scheduled' },
//   'completed': { color: '#2E7D32', bgColor: '#E8F5E9', icon: <CheckCircleIcon />, label: 'Completed' },
//   'cancelled': { color: '#C62828', bgColor: '#FFEBEE', icon: <CancelIcon />, label: 'Cancelled' },
//   'rescheduled': { color: '#ED6C02', bgColor: '#FFF3E0', icon: <AccessTimeIcon />, label: 'Rescheduled' },
//   'in_progress': { color: '#7B1FA2', bgColor: '#F3E5F5', icon: <TimelineIcon />, label: 'In Progress' },
//   'no-show': { color: '#B45309', bgColor: '#FEF3C7', icon: <PersonIcon />, label: 'No Show' }
// };

// // Decision color mapping
// const DECISION_COLORS = {
//   'select': { color: '#2E7D32', bgColor: '#E8F5E9', icon: <ThumbUpIcon />, label: 'Select' },
//   'reject': { color: '#C62828', bgColor: '#FFEBEE', icon: <ThumbDownIcon />, label: 'Reject' },
//   'hold': { color: '#ED6C02', bgColor: '#FFF3E0', icon: <TimelineIcon />, label: 'Hold' }
// };

// const sections = [
//   "Overview",
//   "Candidate Details",
//   "Job Details",
//   "Feedback",
//   "History"
// ];

// const ViewInterviewDetails = ({ open, onClose, interviewId }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const [activeSection, setActiveSection] = useState(0);
//   const [interview, setInterview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch interview details
//   const fetchInterviewDetails = async (showRefreshing = false) => {
//     if (!interviewId) return;
    
//     if (showRefreshing) {
//       setRefreshing(true);
//     } else {
//       setLoading(true);
//     }
    
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/interviews/${interviewId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setInterview(response.data.data);
//       } else {
//         setError(response.data.message || 'Failed to fetch interview details');
//       }
//     } catch (err) {
//       console.error('Error fetching interview details:', err);
//       if (err.response) {
//         setError(err.response.data?.message || 'Failed to fetch interview details');
//       } else {
//         setError('Failed to fetch interview details. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Load data when dialog opens
//   useEffect(() => {
//     if (open && interviewId) {
//       fetchInterviewDetails();
//     }
//   }, [open, interviewId]);

//   const handleRefresh = () => {
//     fetchInterviewDetails(true);
//   };

//   const handleClose = () => {
//     setInterview(null);
//     setActiveSection(0);
//     setError('');
//     onClose();
//   };

//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return 'Not set';
//     return new Date(dateTimeString).toLocaleString('en-US', {
//       dateStyle: 'full',
//       timeStyle: 'short'
//     });
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getStatusChip = (status) => {
//     const config = STATUS_COLORS[status] || { color: '#666', bgColor: '#F5F5F5', icon: <EventIcon />, label: status };

//     return (
//       <Chip
//         label={config.label}
//         size="small"
//         icon={config.icon}
//         sx={{
//           backgroundColor: config.bgColor,
//           color: config.color,
//           fontWeight: 500,
//           '& .MuiChip-icon': {
//             color: config.color
//           }
//         }}
//       />
//     );
//   };

//   const getDecisionChip = (decision) => {
//     const config = DECISION_COLORS[decision] || { color: '#666', bgColor: '#F5F5F5', icon: <FeedbackIcon />, label: decision };

//     return (
//       <Chip
//         label={config.label?.toUpperCase()}
//         size="small"
//         icon={config.icon}
//         sx={{
//           backgroundColor: config.bgColor,
//           color: config.color,
//           fontWeight: 500,
//           '& .MuiChip-icon': {
//             color: config.color
//           }
//         }}
//       />
//     );
//   };

//   // Handle section navigation
//   const handleNextSection = () => {
//     setActiveSection(prev => Math.min(prev + 1, sections.length - 1));
//   };

//   const handlePrevSection = () => {
//     setActiveSection(prev => Math.max(prev - 1, 0));
//   };

//   const renderSectionContent = (section) => {
//     if (!interview) return null;

//     switch(section) {
//       case 0: // Overview
//         return (
//           <Stack spacing={2}>
//             {/* Interview Header Card */}
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <ScheduleIcon sx={{ color: '#1976D2' }} />
//                   <Typography variant="h6" fontWeight={600} color="#101010">
//                     Interview Details
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   {getStatusChip(interview.status)}
//                   <Tooltip title="Refresh">
//                     <IconButton size="small" onClick={handleRefresh} disabled={refreshing}>
//                       <RefreshIcon fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                 </Box>
//               </Box>

//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//                     Interview ID
//                   </Typography>
//                   <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
//                     {interview.interviewId || interview._id}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//                     Round
//                   </Typography>
//                   <Typography variant="body2" fontWeight={500}>
//                     {interview.round}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//                     Type
//                   </Typography>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                     {interview.type === 'video' && <VideoCallIcon fontSize="small" sx={{ color: '#1976D2' }} />}
//                     {interview.type === 'phone' && <PhoneIcon fontSize="small" sx={{ color: '#1976D2' }} />}
//                     {interview.type === 'in-person' && <LocationIcon fontSize="small" sx={{ color: '#1976D2' }} />}
//                     <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
//                       {interview.type?.replace('-', ' ')}
//                     </Typography>
//                   </Box>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//                     Duration
//                   </Typography>
//                   <Typography variant="body2" fontWeight={500}>
//                     {interview.duration} minutes
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//                     Scheduled Time
//                   </Typography>
//                   <Typography variant="body2" fontWeight={500}>
//                     {formatDateTime(interview.scheduledAt)}
//                   </Typography>
//                 </Grid>

//                 {/* Meeting Link or Location */}
//                 {interview.type === 'video' && interview.meetingLink && (
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//                       Meeting Link
//                     </Typography>
//                     <Link 
//                       href={interview.meetingLink} 
//                       target="_blank" 
//                       rel="noopener"
//                       sx={{ 
//                         wordBreak: 'break-all',
//                         fontSize: '0.875rem'
//                       }}
//                     >
//                       {interview.meetingLink}
//                     </Link>
//                   </Grid>
//                 )}

//                 {interview.type === 'in-person' && interview.location && (
//                   <Grid size={{ xs: 12 }}>
//                     <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//                       Location
//                     </Typography>
//                     <Typography variant="body2" fontWeight={500}>
//                       {interview.location}
//                     </Typography>
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>

//             {/* Interviewers Table */}
//             <Paper elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//               <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <AccountCircleIcon sx={{ color: '#1976D2' }} />
//                 <Typography variant="subtitle2" sx={{ color: '#1976D2', fontWeight: 600 }}>
//                   Interviewers
//                 </Typography>
//               </Box>
//               <Divider />
//               <TableContainer>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
//                       <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {interview.interviewers && interview.interviewers.length > 0 ? (
//                       interview.interviewers.map((interviewer, index) => (
//                         <TableRow key={index}>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Avatar sx={{ width: 28, height: 28, bgcolor: '#1976D2', fontSize: '12px' }}>
//                                 {interviewer.name?.charAt(0) || 'I'}
//                               </Avatar>
//                               <Typography variant="body2">{interviewer.name}</Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>{interviewer.email}</TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={2} align="center" sx={{ py: 2 }}>
//                           <Typography variant="body2" color="textSecondary">No interviewers assigned</Typography>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>

//             {/* Metadata Table */}
//             <Paper elevation={0} sx={{ backgroundColor: '#F5F5F5', borderRadius: 2 }}>
//               <TableContainer>
//                 <Table size="small">
//                   <TableBody>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                         Created
//                       </TableCell>
//                       <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>
//                         {formatDateTime(interview.createdAt)} 
//                         {interview.createdBy?.Username && ` by ${interview.createdBy.Username}`}
//                       </TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569' }}>
//                         Last Updated
//                       </TableCell>
//                       <TableCell>
//                         {formatDateTime(interview.updatedAt)}
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Stack>
//         );

//       case 1: // Candidate Details
//         {
//           const candidate = interview.applicationId?.candidateId || interview.candidateId;
//           const application = interview.applicationId;

//           if (!candidate) {
//             return (
//               <Alert severity="info" sx={{ borderRadius: 1 }}>
//                 No candidate information available
//               </Alert>
//             );
//           }

//           return (
//             <Stack spacing={2}>
//               {/* Candidate Header Card */}
//               <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
//                   <Avatar 
//                     sx={{ 
//                       width: 56, 
//                       height: 56, 
//                       bgcolor: '#E3F2FD',
//                       color: '#1976D2',
//                       fontSize: '20px',
//                       fontWeight: 600
//                     }}
//                   >
//                     {candidate.firstName?.[0]}{candidate.lastName?.[0]}
//                   </Avatar>
//                   <Box sx={{ flex: 1, minWidth: 200 }}>
//                     <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
//                       {candidate.fullName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || candidate.name}
//                     </Typography>
//                     <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
//                       {application?.status && (
//                         <Chip
//                           size="small"
//                           label={application.status.replace('_', ' ').toUpperCase()}
//                           sx={{
//                             backgroundColor: 
//                               application.status === 'shortlisted' ? '#E8F5E9' :
//                               application.status === 'interview_scheduled' ? '#E3F2FD' :
//                               application.status === 'rejected' ? '#FFEBEE' : '#F5F5F5',
//                             color: 
//                               application.status === 'shortlisted' ? '#2E7D32' :
//                               application.status === 'interview_scheduled' ? '#1976D2' :
//                               application.status === 'rejected' ? '#C62828' : '#666',
//                             fontWeight: 500,
//                             height: 24
//                           }}
//                         />
//                       )}
//                     </Box>
//                   </Box>
//                 </Box>
//               </Paper>

//               {/* Candidate Information Table */}
//               <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableBody>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <EmailIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                           Email
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>{candidate.email}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <PhoneIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                           Phone
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>{candidate.phone || 'N/A'}</TableCell>
//                     </TableRow>
//                     {candidate.dateOfBirth && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <EventIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                             Date of Birth
//                           </Box>
//                         </TableCell>
//                         <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>{formatDate(candidate.dateOfBirth)}</TableCell>
//                       </TableRow>
//                     )}
//                     {candidate.gender && (
//                       <TableRow>
//                         <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569' }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <PersonIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                             Gender
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           {candidate.gender === 'M' ? 'Male' : candidate.gender === 'F' ? 'Female' : 'Other'}
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Address */}
//               {candidate.address && (
//                 <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <LocationIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                             Address
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       <TableRow>
//                         <TableCell>
//                           {candidate.address.street && `${candidate.address.street}, `}
//                           {candidate.address.city}, {candidate.address.state} - {candidate.address.pincode}
//                           {candidate.address.country && `, ${candidate.address.country}`}
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}

//               {/* Education */}
//               {candidate.education && candidate.education.length > 0 && (
//                 <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell colSpan={4} sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <SchoolIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                             Education
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Degree</TableCell>
//                         <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Institution</TableCell>
//                         <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Year</TableCell>
//                         <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Specialization</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {candidate.education.map((edu, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{edu.degree}</TableCell>
//                           <TableCell>{edu.institution}</TableCell>
//                           <TableCell>{edu.yearOfPassing}</TableCell>
//                           <TableCell>{edu.specialization || '-'}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}

//               {/* Experience */}
//               {candidate.experience && candidate.experience.length > 0 && (
//                 <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell colSpan={4} sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <WorkIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                             Work Experience
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Position</TableCell>
//                         <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Company</TableCell>
//                         <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Duration</TableCell>
//                         <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Description</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {candidate.experience.map((exp, index) => (
//                         <TableRow key={index}>
//                           <TableCell sx={{ fontWeight: 500 }}>{exp.position}</TableCell>
//                           <TableCell>{exp.company}</TableCell>
//                           <TableCell>
//                             {exp.fromDate ? formatDate(exp.fromDate) : 'N/A'} - 
//                             {exp.current ? 'Present' : (exp.toDate ? formatDate(exp.toDate) : 'N/A')}
//                           </TableCell>
//                           <TableCell>{exp.description || '-'}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}

//               {/* Skills */}
//               {candidate.skills && candidate.skills.length > 0 && (
//                 <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <StarIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                             Skills
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       <TableRow>
//                         <TableCell>
//                           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                             {candidate.skills.map((skill, index) => (
//                               <Chip
//                                 key={index}
//                                 label={skill}
//                                 size="small"
//                                 sx={{
//                                   backgroundColor: '#E3F2FD',
//                                   color: '#1976D2',
//                                   fontWeight: 500,
//                                   fontSize: '12px',
//                                   height: 24
//                                 }}
//                               />
//                             ))}
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </Stack>
//           );
//         }

//       case 2: // Job Details
//         {
//           const job = interview.applicationId?.jobId || interview.jobId;

//           if (!job) {
//             return (
//               <Alert severity="info" sx={{ borderRadius: 1 }}>
//                 No job information available
//               </Alert>
//             );
//           }

//           return (
//             <Stack spacing={2}>
//               {/* Job Header */}
//               <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600, color: '#101010' }}>
//                   {job.title}
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary" display="block">
//                   Job ID: {job.jobId}
//                 </Typography>
//               </Paper>

//               {/* Job Details Table */}
//               <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableBody>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                         Department
//                       </TableCell>
//                       <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>{job.department}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                         Employment Type
//                       </TableCell>
//                       <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>{job.employmentType}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                         Location
//                       </TableCell>
//                       <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>{job.location}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                         Experience Required
//                       </TableCell>
//                       <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>
//                         {job.experienceRequired?.min} - {job.experienceRequired?.max} years
//                       </TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569' }}>
//                         Salary Range
//                       </TableCell>
//                       <TableCell>
//                         {job.salaryRange?.currency} {job.salaryRange?.min?.toLocaleString()} - {job.salaryRange?.max?.toLocaleString()}
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Requirements */}
//               {job.requirements && job.requirements.length > 0 && (
//                 <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                           Requirements
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       <TableRow>
//                         <TableCell>
//                           <List dense disablePadding>
//                             {job.requirements.map((req, index) => (
//                               <ListItem key={index} disableGutters sx={{ py: 0.2 }}>
//                                 <ListItemIcon sx={{ minWidth: 24 }}>
//                                   <CheckCircleIcon fontSize="small" sx={{ color: '#1976D2' }} />
//                                 </ListItemIcon>
//                                 <ListItemText primary={req} />
//                               </ListItem>
//                             ))}
//                           </List>
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}

//               {/* Required Skills */}
//               {job.skills && job.skills.length > 0 && (
//                 <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                           Required Skills
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       <TableRow>
//                         <TableCell>
//                           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                             {job.skills.map((skill, index) => (
//                               <Chip
//                                 key={index}
//                                 label={skill}
//                                 size="small"
//                                 sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
//                               />
//                             ))}
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </Stack>
//           );
//         }

//       case 3: // Feedback
//         {
//           const feedback = interview.feedback;

//           if (!feedback) {
//             return (
//               <Alert severity="info" sx={{ borderRadius: 1 }}>
//                 No feedback has been submitted for this interview yet.
//               </Alert>
//             );
//           }

//           return (
//             <Stack spacing={2}>
//               {/* Ratings */}
//               <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                         Ratings
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
//                           {Object.entries(feedback.ratings || {}).map(([key, value]) => (
//                             <Box key={key} sx={{ minWidth: 140 }}>
//                               <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
//                                 {key}
//                               </Typography>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                 <StyledRating value={value} readOnly size="small" precision={0.5} />
//                                 <Typography variant="body2" fontWeight={500}>
//                                   ({value}/5)
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           ))}
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Comments */}
//               <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                         Comments
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell>
//                         <Paper sx={{ p: 1.5, backgroundColor: '#F8FAFC', borderRadius: 1 }}>
//                           <Typography variant="body2">{feedback.comments}</Typography>
//                         </Paper>
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Strengths & Weaknesses */}
//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2, height: '100%' }}>
//                     <Table size="small">
//                       <TableHead>
//                         <TableRow>
//                           <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#E8F5E9' }}>
//                             Strengths
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         <TableRow>
//                           <TableCell>
//                             <Paper sx={{ p: 1.5, backgroundColor: '#E8F5E9', borderRadius: 1, border: '1px solid #C8E6C9' }}>
//                               <Typography variant="body2" sx={{ color: '#2E7D32' }}>
//                                 {feedback.strengths}
//                               </Typography>
//                             </Paper>
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6 }}>
//                   <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2, height: '100%' }}>
//                     <Table size="small">
//                       <TableHead>
//                         <TableRow>
//                           <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#FFF3E0' }}>
//                             Areas for Improvement
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         <TableRow>
//                           <TableCell>
//                             <Paper sx={{ p: 1.5, backgroundColor: '#FFF3E0', borderRadius: 1, border: '1px solid #FFE0B2' }}>
//                               <Typography variant="body2" sx={{ color: '#E65100' }}>
//                                 {feedback.weaknesses}
//                               </Typography>
//                             </Paper>
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Grid>
//               </Grid>

//               {/* Decision & Submitted By */}
//               <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//                 <Table size="small">
//                   <TableBody>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                         Final Decision
//                       </TableCell>
//                       <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>
//                         {getDecisionChip(feedback.decision)}
//                       </TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E0E0E0' }}>
//                         Submitted By
//                       </TableCell>
//                       <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>
//                         {feedback.submittedBy?.Username || feedback.submittedBy || 'Unknown'}
//                       </TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 600, color: '#475569' }}>
//                         Submitted At
//                       </TableCell>
//                       <TableCell>
//                         {feedback.submittedAt && formatDateTime(feedback.submittedAt)}
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Stack>
//           );
//         }

//       case 4: // History
//         {
//           const history = interview.applicationId?.statusHistory;

//           if (!history || history.length === 0) {
//             return (
//               <Alert severity="info" sx={{ borderRadius: 1 }}>
//                 No status history available
//               </Alert>
//             );
//           }

//           return (
//             <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <HistoryIcon sx={{ fontSize: 18, color: '#1976D2' }} />
//                         Status History
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: 600, color: '#101010', backgroundColor: '#F0F0F0' }}>
//                       Details
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {history.map((entry, index) => (
//                     <TableRow key={index}>
//                       <TableCell sx={{ width: 200, verticalAlign: 'top' }}>
//                         <Chip
//                           label={entry.status?.replace('_', ' ').toUpperCase()}
//                           size="small"
//                           sx={{
//                             backgroundColor: 
//                               entry.status === 'shortlisted' ? '#E8F5E9' :
//                               entry.status === 'interview_scheduled' ? '#E3F2FD' :
//                               entry.status === 'interviewed' ? '#F3E5F5' :
//                               entry.status === 'rejected' ? '#FFEBEE' : '#F5F5F5',
//                             color: 
//                               entry.status === 'shortlisted' ? '#2E7D32' :
//                               entry.status === 'interview_scheduled' ? '#1976D2' :
//                               entry.status === 'interviewed' ? '#7B1FA2' :
//                               entry.status === 'rejected' ? '#C62828' : '#666',
//                             fontWeight: 500
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {entry.notes || `Status changed to ${entry.status}`}
//                         </Typography>
//                         <Typography variant="caption" color="textSecondary">
//                           By {entry.changedByName || entry.changedBy?.Username || 'Unknown'} • {formatDateTime(entry.changedAt)}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           );
//         }

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
//       fullScreen={isMobile}
//       PaperProps={{
//         sx: {
//           borderRadius: isMobile ? 0 : 1.5,
//           maxHeight: isMobile ? '100%' : '95vh',
//           minHeight: isMobile ? '100%' : '500px'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: '1px solid #E0E0E0',
//         py: 1.5,
//         px: isMobile ? 2 : 3,
//         backgroundColor: '#F8FAFC',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         position: 'sticky',
//         top: 0,
//         zIndex: 2
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <ScheduleIcon sx={{ color: '#1976D2' }} />
//           <Typography variant={isMobile ? "subtitle1" : "subtitle1"} component="div" sx={{ fontWeight: 600, color: '#101010' }}>
//             Interview Details
//           </Typography>
//           {interview && (
//             <Chip
//               label={interview.interviewId || interview._id.slice(-6).toUpperCase()}
//               size="small"
//               sx={{ 
//                 bgcolor: '#E3F2FD', 
//                 color: '#1976D2', 
//                 fontWeight: 500,
//                 height: 24,
//                 fontSize: '12px'
//               }}
//             />
//           )}
//         </Box>
//         <IconButton size="small" onClick={handleClose}>
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: isMobile ? 2 : 3, overflow: 'auto' }}>
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//             <CircularProgress size={40} sx={{ color: '#1976D2' }} />
//           </Box>
//         ) : error ? (
//           <Alert severity="error" sx={{ borderRadius: 1 }}>{error}</Alert>
//         ) : interview ? (
//           <Stack spacing={3}>
//             {/* Section Stepper - Hide on mobile, show compact version */}
//             {!isMobile && (
//               <Paper elevation={0} sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 2 }}>
//                 <Stepper
//                   activeStep={activeSection}
//                   alternativeLabel
//                   connector={<ColorConnector />}
//                 >
//                   {sections.map((label) => (
//                     <Step key={label}>
//                       <StepLabel>
//                         <Typography variant="body2" fontWeight={500}>
//                           {label}
//                         </Typography>
//                       </StepLabel>
//                     </Step>
//                   ))}
//                 </Stepper>
//               </Paper>
//             )}

//             {/* Mobile Section Indicator */}
//             {isMobile && (
//               <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
//                 <Chip
//                   label={`${activeSection + 1}/${sections.length} • ${sections[activeSection]}`}
//                   sx={{
//                     bgcolor: '#E3F2FD',
//                     color: '#1976D2',
//                     fontWeight: 500
//                   }}
//                 />
//               </Box>
//             )}

//             {/* Section Content */}
//             {renderSectionContent(activeSection)}
//           </Stack>
//         ) : (
//           <Alert severity="info" sx={{ borderRadius: 1 }}>
//             No interview data available
//           </Alert>
//         )}
//       </DialogContent>

//       <DialogActions sx={{
//         px: isMobile ? 2 : 3,
//         py: 2,
//         borderTop: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC',
//         position: 'sticky',
//         bottom: 0,
//         zIndex: 1,
//         flexDirection: isMobile ? 'column' : 'row',
//         gap: isMobile ? 1 : 0
//       }}>
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           width: '100%',
//           flexDirection: isMobile ? 'column-reverse' : 'row',
//           gap: isMobile ? 1 : 0
//         }}>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Button
//               variant="outlined"
//               onClick={() => setActiveSection(prev => Math.max(prev - 1, 0))}
//               disabled={activeSection === 0}
//               size={isMobile ? 'small' : 'medium'}
//               sx={{ 
//                 borderRadius: 1.5, 
//                 textTransform: 'none',
//                 flex: isMobile ? 1 : 'none'
//               }}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => setActiveSection(prev => Math.min(prev + 1, sections.length - 1))}
//               disabled={activeSection === sections.length - 1}
//               size={isMobile ? 'small' : 'medium'}
//               sx={{ 
//                 borderRadius: 1.5, 
//                 textTransform: 'none',
//                 flex: isMobile ? 1 : 'none'
//               }}
//             >
//               Next
//             </Button>
//           </Box>
          
//           <Button 
//             onClick={handleClose} 
//             variant="contained"
//             size={isMobile ? 'small' : 'medium'}
//             sx={{
//               borderRadius: 1.5,
//               px: isMobile ? 2 : 4,
//               textTransform: 'none',
//               fontWeight: 500,
//               background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//               '&:hover': { opacity: 0.9 },
//               width: isMobile ? '100%' : 'auto'
//             }}
//           >
//             Close
//           </Button>
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewInterviewDetails;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Typography,
  Chip,
  Divider,
  Avatar,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Link,
  styled,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Stack,
  Dialog,
  DialogContent,
  Tooltip,
  alpha
} from '@mui/material';
import { 
  Close as CloseIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  History as HistoryIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  AccountCircle as AccountCircleIcon,
  Feedback as FeedbackIcon,
  Timeline as TimelineIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Refresh as RefreshIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../../config/Config';

// Color constants - Matching VendorMaster and InterviewMaster
const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  chips: {
    scheduled: '#E3F2FD',
    rescheduled: '#FFF3E0',
    cancelled: '#FFEBEE',
    completed: '#E8F5E9',
    'no-show': '#FEF3C7'
  }
};

// Modern Stepper Connector with Gradient
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(135deg, ${COLORS.primary} 0%, #00B4D8 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(135deg, ${COLORS.primary} 0%, #00B4D8 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Styled Rating component
const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: COLORS.primary,
  },
  '& .MuiRating-iconHover': {
    color: COLORS.primaryDark,
  },
});

// Status color mapping
const STATUS_COLORS = {
  'scheduled': { bg: COLORS.chips.scheduled, color: '#1976D2', icon: <ScheduleIcon sx={{ fontSize: 12 }} />, label: 'Scheduled' },
  'completed': { bg: COLORS.chips.completed, color: '#2E7D32', icon: <CheckCircleIcon sx={{ fontSize: 12 }} />, label: 'Completed' },
  'cancelled': { bg: COLORS.chips.cancelled, color: '#C62828', icon: <CancelIcon sx={{ fontSize: 12 }} />, label: 'Cancelled' },
  'rescheduled': { bg: COLORS.chips.rescheduled, color: '#ED6C02', icon: <AccessTimeIcon sx={{ fontSize: 12 }} />, label: 'Rescheduled' },
  'no-show': { bg: COLORS.chips['no-show'], color: '#B45309', icon: <PersonIcon sx={{ fontSize: 12 }} />, label: 'No Show' }
};

// Decision color mapping
const DECISION_COLORS = {
  'select': { bg: '#E8F5E9', color: '#2E7D32', icon: <ThumbUpIcon sx={{ fontSize: 12 }} />, label: 'Select' },
  'reject': { bg: '#FFEBEE', color: '#C62828', icon: <ThumbDownIcon sx={{ fontSize: 12 }} />, label: 'Reject' },
  'hold': { bg: '#FFF3E0', color: '#ED6C02', icon: <TimelineIcon sx={{ fontSize: 12 }} />, label: 'Hold' }
};

const sections = [
  "Overview",
  "Candidate Details",
  "Job Details",
  "Feedback",
  "History"
];

// Helper function to render field with icon
const renderField = (icon, label, value, iconColor = COLORS.primary) => (
  <Stack direction="row" spacing={1} alignItems="flex-start">
    <Box sx={{ color: iconColor, mt: 0.3, minWidth: 20 }}>
      {icon}
    </Box>
    <Box>
      <Typography 
        variant="caption" 
        sx={{ 
          color: COLORS.text.secondary, 
          display: 'block', 
          fontSize: '10px',
          fontWeight: 500,
          lineHeight: 1.2,
          mb: 0.2
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 600, 
          fontSize: '13px',
          color: COLORS.text.primary,
          wordBreak: 'break-word'
        }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
);

const ViewInterviewDetails = ({ open, onClose, interviewId }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch interview details
  const fetchInterviewDetails = async (showRefreshing = false) => {
    if (!interviewId) return;
    
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/interviews/${interviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setInterview(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch interview details');
      }
    } catch (err) {
      console.error('Error fetching interview details:', err);
      if (err.response) {
        setError(err.response.data?.message || 'Failed to fetch interview details');
      } else {
        setError('Failed to fetch interview details. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data when dialog opens
  useEffect(() => {
    if (open && interviewId) {
      fetchInterviewDetails();
    }
  }, [open, interviewId]);

  const handleRefresh = () => {
    fetchInterviewDetails(true);
  };

  const handleClose = () => {
    setInterview(null);
    setActiveSection(0);
    setError('');
    onClose();
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not set';
    return new Date(dateTimeString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusChip = (status) => {
    const config = STATUS_COLORS[status] || { bg: '#F5F5F5', color: '#666', icon: <EventIcon sx={{ fontSize: 12 }} />, label: status };

    return (
      <Chip
        label={config.label}
        size="small"
        icon={config.icon}
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 500,
          fontSize: '0.65rem',
          height: 22,
          '& .MuiChip-icon': {
            color: config.color,
            fontSize: 12
          }
        }}
      />
    );
  };

  const getDecisionChip = (decision) => {
    const config = DECISION_COLORS[decision] || { bg: '#F5F5F5', color: '#666', icon: <FeedbackIcon sx={{ fontSize: 12 }} />, label: decision };

    return (
      <Chip
        label={config.label}
        size="small"
        icon={config.icon}
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 500,
          fontSize: '0.65rem',
          height: 22,
          '& .MuiChip-icon': {
            color: config.color,
            fontSize: 12
          }
        }}
      />
    );
  };

  const handleNextSection = () => {
    setActiveSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  const handlePrevSection = () => {
    setActiveSection(prev => Math.max(prev - 1, 0));
  };

  const renderSectionContent = (section) => {
    if (!interview) return null;

    switch(section) {
      case 0: // Overview
        return (
          <Stack spacing={1.5}>
            {/* Interview Details Card */}
            <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ScheduleIcon sx={{ fontSize: 16, color: COLORS.primary }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem' }}>
                    Interview Details
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusChip(interview.status)}
                  <Tooltip title="Refresh">
                    <IconButton size="small" onClick={handleRefresh} disabled={refreshing} sx={{ p: 0.5 }}>
                      <RefreshIcon sx={{ fontSize: 14, color: COLORS.text.secondary }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <EventIcon sx={{ fontSize: 14 }} />,
                    'Interview ID',
                    interview.interviewId || interview._id.slice(-8).toUpperCase()
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <TimelineIcon sx={{ fontSize: 14 }} />,
                    'Round',
                    interview.round
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Box sx={{ color: COLORS.primary, mt: 0.3, minWidth: 20 }}>
                      {interview.type === 'video' && <VideoCallIcon sx={{ fontSize: 14 }} />}
                      {interview.type === 'phone' && <PhoneIcon sx={{ fontSize: 14 }} />}
                      {interview.type === 'in-person' && <LocationIcon sx={{ fontSize: 14 }} />}
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.text.secondary, display: 'block', fontSize: '10px', fontWeight: 500 }}>
                        Type
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>
                        {interview.type?.replace('-', ' ')}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(
                    <AccessTimeIcon sx={{ fontSize: 14 }} />,
                    'Duration',
                    `${interview.duration} minutes`
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {renderField(
                    <ScheduleIcon sx={{ fontSize: 14 }} />,
                    'Scheduled Time',
                    formatDateTime(interview.scheduledAt)
                  )}
                </Grid>

                {interview.type === 'video' && interview.meetingLink && (
                  <Grid size={{ xs: 12 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <Box sx={{ color: COLORS.primary, mt: 0.3, minWidth: 20 }}>
                        <VideoCallIcon sx={{ fontSize: 14 }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: COLORS.text.secondary, display: 'block', fontSize: '10px', fontWeight: 500 }}>
                          Meeting Link
                        </Typography>
                        <Link 
                          href={interview.meetingLink} 
                          target="_blank" 
                          rel="noopener"
                          sx={{ 
                            fontSize: '12px',
                            color: COLORS.primary,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {interview.meetingLink}
                        </Link>
                      </Box>
                    </Stack>
                  </Grid>
                )}

                {interview.type === 'in-person' && interview.location && (
                  <Grid size={{ xs: 12 }}>
                    {renderField(
                      <LocationIcon sx={{ fontSize: 14 }} />,
                      'Location',
                      interview.location
                    )}
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Interviewers Card */}
            {interview.interviewers && interview.interviewers.length > 0 && (
              <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <AccountCircleIcon sx={{ fontSize: 16, color: COLORS.primary }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem' }}>
                    Interviewers
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 1.5, borderColor: COLORS.border }} />
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {interview.interviewers.map((interviewer, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ borderBottom: 'none', p: '6px 0' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.primary, fontSize: '12px' }}>
                                {interviewer.name?.charAt(0) || 'I'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px', color: COLORS.text.primary }}>
                                  {interviewer.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '10px' }}>
                                  {interviewer.email}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* Metadata Card */}
            <Paper sx={{ p: 1, backgroundColor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '10px', display: 'block' }}>
                Created: {formatDateTime(interview.createdAt)} 
                {interview.createdBy?.Username && ` by ${interview.createdBy.Username}`}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '10px', display: 'block', mt: 0.5 }}>
                Last Updated: {formatDateTime(interview.updatedAt)}
              </Typography>
            </Paper>
          </Stack>
        );

      case 1: // Candidate Details
        {
          const candidate = interview.applicationId?.candidateId || interview.candidateId;
          const application = interview.applicationId;

          if (!candidate) {
            return (
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                  No candidate information available
                </Typography>
              </Paper>
            );
          }

          return (
            <Stack spacing={1.5}>
              {/* Candidate Header */}
              <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ width: 48, height: 48, bgcolor: COLORS.primary, fontSize: '18px', fontWeight: 600 }}>
                    {candidate.firstName?.[0] || candidate.name?.[0] || 'C'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '14px', color: COLORS.text.primary }}>
                      {candidate.fullName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || candidate.name}
                    </Typography>
                    {application?.status && (
                      <Chip
                        size="small"
                        label={application.status.replace('_', ' ').toUpperCase()}
                        sx={{
                          backgroundColor: application.status === 'shortlisted' ? '#E8F5E9' :
                            application.status === 'interview_scheduled' ? '#E3F2FD' :
                            application.status === 'rejected' ? '#FFEBEE' : '#F5F5F5',
                          color: application.status === 'shortlisted' ? '#2E7D32' :
                            application.status === 'interview_scheduled' ? '#1976D2' :
                            application.status === 'rejected' ? '#C62828' : '#666',
                          fontWeight: 500,
                          fontSize: '10px',
                          height: 20,
                          mt: 0.5
                        }}
                      />
                    )}
                  </Box>
                </Stack>
              </Paper>

              {/* Contact Information */}
              <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1.5 }}>
                  Contact Information
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <EmailIcon sx={{ fontSize: 14 }} />,
                      'Email',
                      candidate.email || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <PhoneIcon sx={{ fontSize: 14 }} />,
                      'Phone',
                      candidate.phone || 'N/A'
                    )}
                  </Grid>
                  {candidate.dateOfBirth && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {renderField(
                        <EventIcon sx={{ fontSize: 14 }} />,
                        'Date of Birth',
                        formatDate(candidate.dateOfBirth)
                      )}
                    </Grid>
                  )}
                  {candidate.gender && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {renderField(
                        <PersonIcon sx={{ fontSize: 14 }} />,
                        'Gender',
                        candidate.gender === 'M' ? 'Male' : candidate.gender === 'F' ? 'Female' : 'Other'
                      )}
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Address */}
              {candidate.address && (
                <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1.5 }}>
                    Address
                  </Typography>
                  {renderField(
                    <LocationIcon sx={{ fontSize: 14 }} />,
                    'Full Address',
                    `${candidate.address.street ? candidate.address.street + ', ' : ''}${candidate.address.city || ''} ${candidate.address.state || ''} ${candidate.address.pincode || ''}`
                  )}
                </Paper>
              )}

              {/* Skills */}
              {candidate.skills && candidate.skills.length > 0 && (
                <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1.5 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {candidate.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        sx={{
                          backgroundColor: alpha(COLORS.primary, 0.1),
                          color: COLORS.primary,
                          fontWeight: 500,
                          fontSize: '10px',
                          height: 22
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Education */}
              {candidate.education && candidate.education.length > 0 && (
                <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1.5 }}>
                    Education
                  </Typography>
                  {candidate.education.map((edu, index) => (
                    <Box key={index} sx={{ mb: index < candidate.education.length - 1 ? 1.5 : 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', color: COLORS.text.primary }}>
                        {edu.degree} {edu.specialization && `- ${edu.specialization}`}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '10px', display: 'block' }}>
                        {edu.institution} • {edu.yearOfPassing}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              )}

              {/* Experience */}
              {candidate.experience && candidate.experience.length > 0 && (
                <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1.5 }}>
                    Work Experience
                  </Typography>
                  {candidate.experience.map((exp, index) => (
                    <Box key={index} sx={{ mb: index < candidate.experience.length - 1 ? 1.5 : 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', color: COLORS.text.primary }}>
                        {exp.position} at {exp.company}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '10px', display: 'block' }}>
                        {exp.fromDate ? formatDate(exp.fromDate) : 'N/A'} - {exp.current ? 'Present' : (exp.toDate ? formatDate(exp.toDate) : 'N/A')}
                      </Typography>
                      {exp.description && (
                        <Typography variant="caption" sx={{ color: COLORS.text.secondary, fontSize: '10px', display: 'block', mt: 0.5 }}>
                          {exp.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Paper>
              )}
            </Stack>
          );
        }

      case 2: // Job Details
        {
          const job = interview.applicationId?.jobId || interview.jobId;

          if (!job) {
            return (
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                  No job information available
                </Typography>
              </Paper>
            );
          }

          return (
            <Stack spacing={1.5}>
              {/* Job Header */}
              <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '14px', color: COLORS.text.primary }}>
                  {job.title}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '10px' }}>
                  Job ID: {job.jobId}
                </Typography>
              </Paper>

              {/* Job Details */}
              <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1.5 }}>
                  Job Details
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <BusinessIcon sx={{ fontSize: 14 }} />,
                      'Department',
                      job.department || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <WorkIcon sx={{ fontSize: 14 }} />,
                      'Employment Type',
                      job.employmentType || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <LocationIcon sx={{ fontSize: 14 }} />,
                      'Location',
                      job.location || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderField(
                      <TimelineIcon sx={{ fontSize: 14 }} />,
                      'Experience Required',
                      job.experienceRequired ? `${job.experienceRequired.min} - ${job.experienceRequired.max} years` : 'N/A'
                    )}
                  </Grid>
                  {job.salaryRange && (
                    <Grid size={{ xs: 12 }}>
                      {renderField(
                        <BusinessIcon sx={{ fontSize: 14 }} />,
                        'Salary Range',
                        `${job.salaryRange.currency || '₹'} ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()}`
                      )}
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1.5 }}>
                    Requirements
                  </Typography>
                  <Box sx={{ pl: 0.5 }}>
                    {job.requirements.map((req, index) => (
                      <Stack key={index} direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                        <CheckCircleIcon sx={{ fontSize: 12, color: COLORS.primary }} />
                        <Typography variant="body2" sx={{ fontSize: '12px', color: COLORS.text.primary }}>
                          {req}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Required Skills */}
              {job.skills && job.skills.length > 0 && (
                <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1.5 }}>
                    Required Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {job.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        sx={{
                          backgroundColor: '#E8F5E9',
                          color: '#2E7D32',
                          fontWeight: 500,
                          fontSize: '10px',
                          height: 22
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              )}
            </Stack>
          );
        }

      case 3: // Feedback
        {
          const feedback = interview.feedback;

          if (!feedback) {
            return (
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                  No feedback has been submitted for this interview yet.
                </Typography>
              </Paper>
            );
          }

          return (
            <Stack spacing={1.5}>
              {/* Ratings */}
              {feedback.ratings && Object.keys(feedback.ratings).length > 0 && (
                <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1.5 }}>
                    Ratings
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {Object.entries(feedback.ratings).map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="caption" sx={{ color: COLORS.text.secondary, textTransform: 'capitalize', fontSize: '10px', display: 'block' }}>
                          {key}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StyledRating value={value} readOnly size="small" precision={0.5} />
                          <Typography variant="caption" sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                            ({value}/5)
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Comments */}
              {feedback.comments && (
                <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem', mb: 1 }}>
                    Comments
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '12px', color: COLORS.text.primary }}>
                    {feedback.comments}
                  </Typography>
                </Paper>
              )}

              {/* Strengths & Weaknesses */}
              <Grid container spacing={1.5}>
                {feedback.strengths && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 1.5, backgroundColor: '#E8F5E9', borderRadius: 1.5, border: '1px solid #C8E6C9' }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#2E7D32', mb: 0.5, fontSize: '0.75rem' }}>
                        Strengths
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '12px', color: '#1B5E20' }}>
                        {feedback.strengths}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                {feedback.weaknesses && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 1.5, backgroundColor: '#FFF3E0', borderRadius: 1.5, border: '1px solid #FFE0B2' }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#E65100', mb: 0.5, fontSize: '0.75rem' }}>
                        Areas for Improvement
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '12px', color: '#BF360C' }}>
                        {feedback.weaknesses}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* Decision & Metadata */}
              <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary, display: 'block', fontSize: '10px', fontWeight: 500 }}>
                      Final Decision
                    </Typography>
                    {getDecisionChip(feedback.decision)}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {renderField(
                      <PersonIcon sx={{ fontSize: 14 }} />,
                      'Submitted By',
                      feedback.submittedBy?.Username || feedback.submittedBy || 'Unknown'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {renderField(
                      <EventIcon sx={{ fontSize: 14 }} />,
                      'Submitted At',
                      formatDateTime(feedback.submittedAt)
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          );
        }

      case 4: // History
        {
          const history = interview.applicationId?.statusHistory;

          if (!history || history.length === 0) {
            return (
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                  No status history available
                </Typography>
              </Paper>
            );
          }

          return (
            <Paper sx={{ backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
              <Box sx={{ p: 1.5, borderBottom: `1px solid ${COLORS.border}` }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <HistoryIcon sx={{ fontSize: 16, color: COLORS.primary }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: COLORS.text.primary, fontSize: '0.8rem' }}>
                    Status History
                  </Typography>
                </Stack>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {history.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ width: '30%', verticalAlign: 'top', p: 1.5, borderBottom: `1px solid ${COLORS.border}` }}>
                          <Chip
                            label={entry.status?.replace('_', ' ').toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: 
                                entry.status === 'shortlisted' ? '#E8F5E9' :
                                entry.status === 'interview_scheduled' ? '#E3F2FD' :
                                entry.status === 'interviewed' ? '#F3E5F5' :
                                entry.status === 'rejected' ? '#FFEBEE' : '#F5F5F5',
                              color: 
                                entry.status === 'shortlisted' ? '#2E7D32' :
                                entry.status === 'interview_scheduled' ? '#1976D2' :
                                entry.status === 'interviewed' ? '#7B1FA2' :
                                entry.status === 'rejected' ? '#C62828' : '#666',
                              fontWeight: 500,
                              fontSize: '10px',
                              height: 22
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'top', p: 1.5, borderBottom: `1px solid ${COLORS.border}` }}>
                          <Typography variant="body2" sx={{ fontSize: '12px', color: COLORS.text.primary }}>
                            {entry.notes || `Status changed to ${entry.status}`}
                          </Typography>
                          <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '10px', display: 'block', mt: 0.5 }}>
                            By {entry.changedByName || entry.changedBy?.Username || 'Unknown'} • {formatDateTime(entry.changedAt)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          );
        }

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
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          height: 'auto',
          maxHeight: '600px'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, #00B4D8 100%)`,
        py: 1,
        px: 2
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ScheduleIcon sx={{ color: COLORS.text.light, fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              color: COLORS.text.light,
              fontSize: '0.9rem'
            }}>
              Interview Details
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            {interview && getStatusChip(interview.status)}
            <IconButton 
              size="small" 
              onClick={handleClose}
              sx={{ color: COLORS.text.light, p: 0.5 }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Stepper */}
        <Stepper
          activeStep={activeSection}
          alternativeLabel
          connector={<ColorConnector />}
          sx={{ mt: 0.5 }}
        >
          {sections.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography fontWeight={500} fontSize="0.7rem" sx={{ color: COLORS.text.light }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ p: 1.5, overflow: 'auto', height: 'auto', maxHeight: 'calc(600px - 120px)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress size={30} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>
        ) : interview ? (
          renderSectionContent(activeSection)
        ) : (
          <Alert severity="info" sx={{ borderRadius: 1.5 }}>
            No interview data available
          </Alert>
        )}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2,
        py: 1,
        borderTop: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.background.light
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            onClick={handleClose}
            startIcon={<CloseIcon />}
            size="small"
            sx={{ color: COLORS.text.secondary, fontSize: '0.8rem' }}
          >
            Close
          </Button>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={handlePrevSection}
              size="small"
              startIcon={<NavigateBeforeIcon />}
              disabled={activeSection === 0}
              sx={{ color: COLORS.text.secondary, fontSize: '0.8rem' }}
            >
              Previous
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNextSection}
              size="small"
              endIcon={<NavigateNextIcon />}
              disabled={activeSection === sections.length - 1}
              sx={{
                backgroundColor: COLORS.primary,
                fontSize: '0.8rem',
                '&:hover': { backgroundColor: COLORS.primaryDark }
              }}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewInterviewDetails;