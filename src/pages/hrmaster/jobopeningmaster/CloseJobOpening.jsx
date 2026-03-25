// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Stack,
//   Alert,
//   CircularProgress,
//   Breadcrumbs,
//   Link,
//   IconButton,
//   Chip,
//   Stepper,
//   Step,
//   StepLabel,
//   styled,
//   StepConnector,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormHelperText,
//   Card,
//   CardContent,
//   Divider,
//   Grid,
//   Avatar,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormLabel,
//   Checkbox,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText
// } from '@mui/material';
// import {
//   ArrowBack as ArrowBackIcon,
//   Close as CloseIcon,
//   CheckCircle as CheckCircleIcon,
//   Error as ErrorIcon,
//   Warning as WarningIcon,
//   Info as InfoIcon,
//   Refresh as RefreshIcon,
//   Work as WorkIcon,
//   Business as BusinessIcon,
//   People as PeopleIcon,
//   Schedule as ScheduleIcon,
//   Cancel as CancelIcon,
//   Assignment as AssignmentIcon,
//   Description as DescriptionIcon,
//   ThumbUp as ThumbUpIcon,
//   ThumbDown as ThumbDownIcon,
//   RemoveCircle as RemoveCircleIcon,
//   Archive as ArchiveIcon,
//   Lock as LockIcon,
//   Visibility as VisibilityIcon,
//   LocationOn as LocationIcon,
//   DateRange as DateRangeIcon,
//   AttachMoney as AttachMoneyIcon
// } from '@mui/icons-material';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';

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

// const steps = ["Review Job", "Close Reason", "Confirmation"];

// /* ------------------- Close Reason Card Component ------------------- */
// const CloseReasonCard = ({ reason, selected, onSelect, description, icon }) => {
//   return (
//     <Paper
//       variant="outlined"
//       sx={{
//         p: 1,
//         width: 190,
//         height: 120,
//         cursor: 'pointer',
//         border: selected ? '2px solid #f44336' : '1px solid #e0e0e0',
//         bgcolor: selected ? '#ffebee' : 'white',
//         transition: 'all 0.2s',
//         '&:hover': {
//           borderColor: '#f44336',
//           boxShadow: '0 4px 12px rgba(244,67,54,0.1)'
//         }
//       }}
//       onClick={() => onSelect(reason)}
//     >
//       <Stack spacing={1} alignItems="center">
//         {icon}
//         <Typography variant="subtitle2" fontWeight={600} textAlign="center">
//           {reason}
//         </Typography>
//         {description && (
//           <Typography variant="caption" color="textSecondary" textAlign="center">
//             {description}
//           </Typography>
//         )}
//         {selected && (
//           <Chip
//             size="small"
//             icon={<CheckCircleIcon />}
//             label="Selected"
//             color="success"
//             variant="outlined"
//           />
//         )}
//       </Stack>
//     </Paper>
//   );
// };

// /* ------------------- Main Component ------------------- */
// const CloseJobOpening = ({ open, onClose, jobId, onClose: onJobClose }) => {
//   const navigate = useNavigate();
  
//   // State
//   const [activeStep, setActiveStep] = useState(0);
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [closing, setClosing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
  
//   // Close reason
//   const [closeReason, setCloseReason] = useState('');
//   const [customReason, setCustomReason] = useState('');
//   const [additionalNotes, setAdditionalNotes] = useState('');
//   const [notifyCandidates, setNotifyCandidates] = useState(true);
//   const [archiveJob, setArchiveJob] = useState(true);
  
//   // Confirmation dialog
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
//   // Close reasons with descriptions
//   const closeReasons = [
//     {
//       value: 'Position filled',
//       label: 'Position Filled',
//       description: 'Successfully hired a candidate for this position',
//       icon: <ThumbUpIcon sx={{ fontSize: 32, color: '#4caf50' }} />
//     },
//     {
//       value: 'Position cancelled',
//       label: 'Position Cancelled',
//       description: 'The position is no longer needed',
//       icon: <CancelIcon sx={{ fontSize: 32, color: '#f44336' }} />
//     },
//     {
//       value: 'Budget constraints',
//       label: 'Budget Constraints',
//       description: 'Budget approval was withdrawn or reduced',
//       icon: <AttachMoneyIcon sx={{ fontSize: 32, color: '#ff9800' }} />
//     },
//     {
//       value: 'Requirements changed',
//       label: 'Requirements Changed',
//       description: 'Job requirements have significantly changed',
//       icon: <AssignmentIcon sx={{ fontSize: 32, color: '#2196f3' }} />
//     },
//     {
//       value: 'Position on hold',
//       label: 'Position On Hold',
//       description: 'Temporarily paused, will reopen later',
//       icon: <ScheduleIcon sx={{ fontSize: 32, color: '#9c27b0' }} />
//     },
//     {
//       value: 'Internal hire',
//       label: 'Internal Hire',
//       description: 'Position filled by internal candidate',
//       icon: <PeopleIcon sx={{ fontSize: 32, color: '#009688' }} />
//     },
//     {
//       value: 'Other',
//       label: 'Other',
//       description: 'Specify a custom reason',
//       icon: <DescriptionIcon sx={{ fontSize: 32, color: '#757575' }} />
//     }
//   ];

//   // Fetch job details on mount
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
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.data.success) {
//         setJob(response.data.data);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch job details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReasonSelect = (reason) => {
//     setCloseReason(reason);
//     if (reason !== 'Other') {
//       setCustomReason('');
//     }
//   };

//   const validateStep = () => {
//     setError('');
    
//     switch(activeStep) {
//       case 1:
//         if (!closeReason) {
//           setError('Please select a reason for closing');
//           return false;
//         }
//         if (closeReason === 'Other' && !customReason.trim()) {
//           setError('Please specify the reason');
//           return false;
//         }
//         break;
//       default:
//         break;
//     }
    
//     return true;
//   };

//   const handleNext = () => {
//     if (validateStep()) {
//       if (activeStep === steps.length - 2) {
//         // Last step before confirmation, show confirmation dialog
//         setConfirmDialogOpen(true);
//       } else {
//         setActiveStep(prev => prev + 1);
//       }
//     }
//   };

//   const handleBack = () => {
//     setActiveStep(prev => prev - 1);
//   };

//   const handleClose = async () => {
//     setClosing(true);
//     setError('');
    
//     const finalReason = closeReason === 'Other' ? customReason : closeReason;
    
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await axios.post(`${BASE_URL}/api/jobs/${jobId}/close`, {
//         reason: finalReason,
//         additionalNotes: additionalNotes || undefined,
//         notifyCandidates,
//         archiveJob
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.data.success) {
//         setSuccess('Job closed successfully!');
//         setConfirmDialogOpen(false);
//         setActiveStep(2); // Move to confirmation step
        
//         // Call the onJobClose callback if provided
//         if (onJobClose) {
//           onJobClose(response.data.data || job);
//         }
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to close job');
//       setConfirmDialogOpen(false);
//     } finally {
//       setClosing(false);
//     }
//   };

//   const handleViewJob = () => {
//     onClose();
//     navigate(`/jobs/${jobId}`);
//   };

//   const handleGoToJobs = () => {
//     onClose();
//     navigate('/jobs');
//   };

//   const handleCloseDialog = () => {
//     onClose();
//   };

//   const getStatusColor = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'published':
//         return 'success';
//       case 'draft':
//         return 'default';
//       case 'closed':
//         return 'error';
//       case 'pending':
//         return 'warning';
//       default:
//         return 'default';
//     }
//   };

//   if (loading) {
//     return (
//       <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//         <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
//           <CircularProgress />
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   if (!job && !loading) {
//     return (
//       <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//         <DialogContent>
//           <Alert severity="error">Job not found</Alert>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     );
//   }

//   // Check if job is already closed
//   if (job?.status === 'closed') {
//     return (
//       <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//         <DialogContent sx={{ textAlign: 'center', py: 4 }}>
//           <ArchiveIcon sx={{ fontSize: 60, color: '#9e9e9e', mb: 2 }} />
//           <Typography variant="h5" gutterBottom fontWeight={600}>
//             Job Already Closed
//           </Typography>
//           <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
//             This job opening has already been closed.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>Close</Button>
//           <Button variant="contained" onClick={handleViewJob}>
//             View Job Details
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   }

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={onClose}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: { borderRadius: 2, minHeight: 500 }
//         }}
//       >
//         <DialogTitle sx={{
//           background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//           color: '#fff',
//           fontWeight: 600,
//           fontSize: '20px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1
//         }}>
//           <CloseIcon /> Close Job Opening
//         </DialogTitle>

//         <DialogContent sx={{ pt: 3 }}>
//           <Stack spacing={3}>
//             {/* Warning Alert for Published Jobs */}
//             {job?.status === 'published' && (
//               <Alert 
//                 severity="warning" 
//                 icon={<WarningIcon />}
//                 sx={{ mb: 2 }}
//               >
//                 <Typography variant="body2">
//                   <strong>Warning:</strong> This job is currently published and visible to candidates. 
//                   Closing it will remove it from all job boards.
//                 </Typography>
//               </Alert>
//             )}

//             {/* Modern Stepper */}
//             <Stepper
//               activeStep={activeStep}
//               alternativeLabel
//               connector={<ColorConnector />}
//               sx={{ mb: 3, mt: 1 }}
//             >
//               {steps.map((label) => (
//                 <Step key={label}>
//                   <StepLabel>
//                     <Typography fontWeight={500}>{label}</Typography>
//                   </StepLabel>
//                 </Step>
//               ))}
//             </Stepper>

//             {/* Step Content */}
//             <Box>
              
//               {/* Step 1: Review Job */}
//               {activeStep === 0 && (
//                 <Stack spacing={3}>
//                   {/* Job Summary Card */}
//                   <Card variant="outlined">
//                     <CardContent>
//                       <Typography variant="h6" gutterBottom fontWeight={600}>
//                         Job Summary
//                       </Typography>
                      
//                       <Grid container spacing={8}>
//                         <Grid item xs={12} md={6}>
//                           <List dense>
//                             <ListItem>
//                               <ListItemIcon><WorkIcon fontSize="small" /></ListItemIcon>
//                               <ListItemText 
//                                 primary="Job ID" 
//                                 secondary={job?.jobId}
//                               />
//                             </ListItem>
                            
//                             <ListItem>
//                               <ListItemIcon><LocationIcon fontSize="small" /></ListItemIcon>
//                               <ListItemText 
//                                 primary="Location" 
//                                 secondary={job?.location}
//                               />
//                             </ListItem>
//                           </List>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <List dense>
//                             <ListItem>
//                               <ListItemIcon><DateRangeIcon fontSize="small" /></ListItemIcon>
//                               <ListItemText 
//                                 primary="Posted Date" 
//                                 secondary={new Date(job?.createdAt).toLocaleDateString()}
//                               />
//                             </ListItem>
//                             <ListItem>
//                               <ListItemIcon><ScheduleIcon fontSize="small" /></ListItemIcon>
//                               <ListItemText 
//                                 primary="Status" 
//                                 secondary={
//                                   <Chip 
//                                     size="small" 
//                                     label={job?.status} 
//                                     color={getStatusColor(job?.status)}
//                                   />
//                                 }
//                               />
//                             </ListItem>
                           
//                           </List>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <List dense>
                          
//                             <ListItem>
//                               <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
//                               <ListItemText 
//                                 primary="Department" 
//                                 secondary={job?.department}
//                               />
//                             </ListItem>
//                             <ListItem>
//                               <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
//                               <ListItemText 
//                                 primary="Applications" 
//                                 secondary={job?.applicationCount || 0}
//                               />
//                             </ListItem>
//                           </List>
//                         </Grid>
//                       </Grid>

//                       {/* Publishing Status */}
//                       {job?.publishTo && job.publishTo.length > 0 && (
//                         <>
//                           <Divider sx={{ my: 2 }} />
//                           <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//                             Publishing Status
//                           </Typography>
//                           <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//                             {job.publishTo.map((platform, idx) => (
//                               <Chip
//                                 key={idx}
//                                 size="small"
//                                 label={`${platform.platform}: ${platform.status}`}
//                                 color={platform.status === 'published' ? 'success' : 
//                                       platform.status === 'pending' ? 'warning' : 'default'}
//                                 variant="outlined"
//                               />
//                             ))}
//                           </Stack>
//                         </>
//                       )}
//                     </CardContent>
//                   </Card>

//                   {/* Impact Alert */}
//                   <Alert severity="info" icon={<InfoIcon />}>
//                     <Typography variant="body2">
//                       <strong>What happens when you close this job?</strong>
//                     </Typography>
//                     <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
//                       <li>The job will be marked as closed and won't accept new applications</li>
//                       <li>It will be removed from all job boards and career page</li>
//                       {/* <li>Existing applicants will be notified (if selected)</li>
//                       <li>The job can be archived for future reference</li> */}
//                     </ul>
//                   </Alert>
//                 </Stack>
//               )}

//               {/* Step 2: Close Reason */}
//               {activeStep === 1 && (
//                 <Stack spacing={3}>
//                   {/* Close Reasons Grid */}
//                   <Box>
//                     <Typography variant="subtitle1" fontWeight={600} gutterBottom>
//                       Select Reason for Closing
//                     </Typography>
//                     <Grid container spacing={2}>
//                       {closeReasons.map((reason) => (
//                         <Grid item xs={12} sm={6} key={reason.value}>
//                           <CloseReasonCard
//                             reason={reason.value}
//                             selected={closeReason === reason.value}
//                             onSelect={handleReasonSelect}
//                             description={reason.description}
//                             icon={reason.icon}
//                           />
//                         </Grid>
//                       ))}
//                     </Grid>
//                   </Box>

//                   {/* Custom Reason (if Other selected) */}
//                   {closeReason === 'Other' && (
//                     <TextField
//                       label="Specify Reason"
//                       fullWidth
//                       multiline
//                       // rows={2}
//                       value={customReason}
//                       onChange={(e) => setCustomReason(e.target.value)}
//                       placeholder="Please provide details about why this job is being closed..."
//                       required
//                     />
//                   )}

//                   {/* Additional Notes */}
//                   <TextField
//                     label="Additional Notes (Optional)"
//                     fullWidth
//                     multiline
//                     // rows={3}
//                     value={additionalNotes}
//                     onChange={(e) => setAdditionalNotes(e.target.value)}
//                     placeholder="Any additional information about closing this position..."
//                   />

//                   {/* Options */}
//                   {/* <Paper variant="outlined" sx={{ p: 2 }}>
//                     <Typography variant="subtitle2" gutterBottom fontWeight={600}>
//                       Additional Options
//                     </Typography>
//                     <Stack spacing={2}>
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={notifyCandidates}
//                             onChange={(e) => setNotifyCandidates(e.target.checked)}
//                             color="primary"
//                           />
//                         }
//                         label="Notify candidates who have applied"
//                       />
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={archiveJob}
//                             onChange={(e) => setArchiveJob(e.target.checked)}
//                             color="primary"
//                           />
//                         }
//                         label="Archive job for future reference"
//                       />
//                     </Stack>
//                   </Paper> */}
//                 </Stack>
//               )}

//               {/* Step 3: Confirmation */}
//               {activeStep === 2 && (
//                 <Stack spacing={3}>
//                   {/* Success Message */}
//                   <Paper 
//                     sx={{ 
//                       p: 4, 
//                       textAlign: 'center',
//                       bgcolor: '#f1f8e9'
//                     }}
//                   >
//                     <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
//                     <Typography variant="h5" gutterBottom fontWeight={600}>
//                       Job Closed Successfully!
//                     </Typography>
//                     <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
//                       The job opening has been closed and is no longer accepting applications.
//                     </Typography>

//                     {/* Summary */}
//                     <Paper variant="outlined" sx={{ p: 2, bgcolor: 'white', mb: 3 }}>
//                       <Stack spacing={1}>
//                         <Stack direction="row" justifyContent="space-between">
//                           <Typography variant="body2" color="textSecondary">Job ID</Typography>
//                           <Typography variant="body2" fontWeight={500}>{job?.jobId}</Typography>
//                         </Stack>
//                         <Stack direction="row" justifyContent="space-between">
//                           <Typography variant="body2" color="textSecondary">Title</Typography>
//                           <Typography variant="body2" fontWeight={500}>{job?.title}</Typography>
//                         </Stack>
//                         <Stack direction="row" justifyContent="space-between">
//                           <Typography variant="body2" color="textSecondary">Close Reason</Typography>
//                           <Typography variant="body2" fontWeight={500}>
//                             {closeReason === 'Other' ? customReason : closeReason}
//                           </Typography>
//                         </Stack>
//                         {additionalNotes && (
//                           <Stack direction="row" justifyContent="space-between">
//                             <Typography variant="body2" color="textSecondary">Additional Notes</Typography>
//                             <Typography variant="body2" fontWeight={500}>{additionalNotes}</Typography>
//                           </Stack>
//                         )}
//                       </Stack>
//                     </Paper>

//                     {/* Action Buttons */}
//                     <Stack direction="row" spacing={2} justifyContent="center">
//                       <Button
//                         variant="contained"
//                         onClick={handleViewJob}
//                         startIcon={<VisibilityIcon />}
//                         sx={{
//                           background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                           '&:hover': { opacity: 0.9 }
//                         }}
//                       >
//                         View Job Details
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         onClick={handleGoToJobs}
//                       >
//                         Go to Jobs
//                       </Button>
//                     </Stack>
//                   </Paper>
//                 </Stack>
//               )}
//             </Box>

//             {/* Error/Success Messages */}
//             {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//             {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
//           </Stack>
//         </DialogContent>

//         {/* Navigation Buttons */}
//         {activeStep < 2 && (
//           <DialogActions sx={{ px: 3, pb: 3 }}>
//             <Button
//               variant="outlined"
//               onClick={onClose}
//               startIcon={<CloseIcon />}
//             >
//               Cancel
//             </Button>
            
//             <Box sx={{ flex: 1 }} />
            
//             {activeStep > 0 && (
//               <Button onClick={handleBack} sx={{ mr: 1 }}>
//                 Back
//               </Button>
//             )}
//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={closing}
//               startIcon={activeStep === 1 ? <WarningIcon /> : null}
//               color={activeStep === 1 ? 'error' : 'primary'}
//               sx={activeStep === 1 ? {
//                 bgcolor: '#f44336',
//                 '&:hover': { bgcolor: '#d32f2f' }
//               } : {
//                 background: 'linear-gradient(135deg, #164e63, #00B4D8)',
//                 '&:hover': { opacity: 0.9 }
//               }}
//             >
//               {activeStep === 0 && 'Continue'}
//               {activeStep === 1 && 'Review & Close Job'}
//             </Button>
//           </DialogActions>
//         )}
//       </Dialog>

//       {/* Confirmation Dialog */}
//       <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle sx={{
//           bgcolor: '#f44336',
//           color: 'white',
//           fontWeight: 600
//         }}>
//           Confirm Close Job
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <Stack spacing={2}>
//             <Alert severity="warning" icon={<WarningIcon />}>
//               <Typography variant="body2">
//                 <strong>Warning:</strong> This action cannot be undone.
//               </Typography>
//             </Alert>

//             <Typography variant="body1">
//               Are you sure you want to close this job opening?
//             </Typography>

//             <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
//               <Stack spacing={1}>
//                 <Stack direction="row" justifyContent="space-between">
//                   <Typography variant="body2" color="textSecondary">Job</Typography>
//                   <Typography variant="body2" fontWeight={500}>{job?.jobId} - {job?.title}</Typography>
//                 </Stack>
//                 <Stack direction="row" justifyContent="space-between">
//                   <Typography variant="body2" color="textSecondary">Reason</Typography>
//                   <Typography variant="body2" fontWeight={500}>
//                     {closeReason === 'Other' ? customReason : closeReason}
//                   </Typography>
//                 </Stack>
//                 <Stack direction="row" justifyContent="space-between">
//                   <Typography variant="body2" color="textSecondary">Notify Candidates</Typography>
//                   <Typography variant="body2" fontWeight={500}>{notifyCandidates ? 'Yes' : 'No'}</Typography>
//                 </Stack>
//                 <Stack direction="row" justifyContent="space-between">
//                   <Typography variant="body2" color="textSecondary">Archive Job</Typography>
//                   <Typography variant="body2" fontWeight={500}>{archiveJob ? 'Yes' : 'No'}</Typography>
//                 </Stack>
//               </Stack>
//             </Paper>

//             {job?.applicationCount > 0 && (
//               <Alert severity="info">
//                 <Typography variant="body2">
//                   This job has {job.applicationCount} active application(s). They will be notified if you select the option.
//                 </Typography>
//               </Alert>
//             )}
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setConfirmDialogOpen(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleClose}
//             disabled={closing}
//             startIcon={closing ? <CircularProgress size={20} /> : <CloseIcon />}
//             color="error"
//           >
//             {closing ? 'Closing...' : 'Confirm Close'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default CloseJobOpening;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  stepConnectorClasses,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Card,
  CardContent,
  Divider,
  Grid,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  LocationOn as LocationIcon,
  DateRange as DateRangeIcon,
  AttachMoney as AttachMoneyIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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

const steps = ["Review Job", "Close Reason", "Confirmation"];

/* ------------------- Close Reason Card Component ------------------- */
const CloseReasonCard = ({ reason, selected, onSelect, description, icon }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        cursor: 'pointer',
        border: selected ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
        bgcolor: selected ? COLORS.primaryLight : COLORS.background.white,
        transition: 'all 0.2s',
        borderRadius: 1.5,
        '&:hover': {
          borderColor: COLORS.primary,
          boxShadow: '0 4px 12px rgba(6, 60, 63, 0.1)'
        }
      }}
      onClick={() => onSelect(reason)}
    >
      <Stack spacing={1} alignItems="center">
        {icon}
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, textAlign: 'center' }}>
          {reason}
        </Typography>
        {description && (
          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, textAlign: 'center' }}>
            {description}
          </Typography>
        )}
        {selected && (
          <Chip
            size="small"
            icon={<CheckCircleIcon sx={{ fontSize: '0.7rem' }} />}
            label="Selected"
            sx={{
              bgcolor: COLORS.status.success,
              color: COLORS.primaryDark,
              fontSize: '0.6rem',
              height: 22,
              '& .MuiChip-icon': { fontSize: '0.7rem' }
            }}
          />
        )}
      </Stack>
    </Paper>
  );
};

/* ------------------- Main Component ------------------- */
const CloseJobOpening = ({ open, onClose, jobId, onClose: onJobClose }) => {
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [closeReason, setCloseReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [notifyCandidates, setNotifyCandidates] = useState(true);
  const [archiveJob, setArchiveJob] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const closeReasons = [
    {
      value: 'Position filled',
      label: 'Position Filled',
      description: 'Successfully hired a candidate for this position',
      icon: <ThumbUpIcon sx={{ fontSize: 32, color: '#2E7D32' }} />
    },
    {
      value: 'Position cancelled',
      label: 'Position Cancelled',
      description: 'The position is no longer needed',
      icon: <CancelIcon sx={{ fontSize: 32, color: '#EF4444' }} />
    },
    {
      value: 'Budget constraints',
      label: 'Budget Constraints',
      description: 'Budget approval was withdrawn or reduced',
      icon: <AttachMoneyIcon sx={{ fontSize: 32, color: '#F59E0B' }} />
    },
    {
      value: 'Requirements changed',
      label: 'Requirements Changed',
      description: 'Job requirements have significantly changed',
      icon: <AssignmentIcon sx={{ fontSize: 32, color: COLORS.primary }} />
    },
    {
      value: 'Position on hold',
      label: 'Position On Hold',
      description: 'Temporarily paused, will reopen later',
      icon: <ScheduleIcon sx={{ fontSize: 32, color: '#7B1FA2' }} />
    },
    {
      value: 'Internal hire',
      label: 'Internal Hire',
      description: 'Position filled by internal candidate',
      icon: <PeopleIcon sx={{ fontSize: 32, color: '#059669' }} />
    },
    {
      value: 'Other',
      label: 'Other',
      description: 'Specify a custom reason',
      icon: <DescriptionIcon sx={{ fontSize: 32, color: COLORS.text.tertiary }} />
    }
  ];

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
      setError(err.response?.data?.message || 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleReasonSelect = (reason) => {
    setCloseReason(reason);
    if (reason !== 'Other') {
      setCustomReason('');
    }
    if (fieldErrors.closeReason) {
      setFieldErrors(prev => ({ ...prev, closeReason: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateStep = () => {
    const errors = {};
    let isValid = true;
    
    if (activeStep === 1) {
      if (!closeReason) {
        errors.closeReason = 'Please select a reason for closing';
        isValid = false;
      }
      if (closeReason === 'Other' && !customReason.trim()) {
        errors.customReason = 'Please specify the reason';
        isValid = false;
      }
    }
    
    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix the errors before proceeding');
    } else {
      setError('');
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 2) {
        setConfirmDialogOpen(true);
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleClose = async () => {
    setClosing(true);
    setError('');
    
    const finalReason = closeReason === 'Other' ? customReason : closeReason;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${BASE_URL}/api/jobs/${jobId}/close`, {
        reason: finalReason,
        additionalNotes: additionalNotes || undefined,
        notifyCandidates,
        archiveJob
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSuccess('Job closed successfully!');
        setConfirmDialogOpen(false);
        setActiveStep(2);
        
        if (onJobClose) {
          onJobClose(response.data.data || job);
        }
      } else {
        setError(response.data.message || 'Failed to close job');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close job');
      setConfirmDialogOpen(false);
    } finally {
      setClosing(false);
    }
  };

  const handleViewJob = () => {
    onClose();
    navigate(`/jobs/${jobId}`);
  };

  const handleGoToJobs = () => {
    onClose();
    navigate('/jobs');
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'published': return COLORS.status.success;
      case 'draft': return COLORS.chips.inactive;
      case 'closed': return COLORS.status.error;
      case 'pending': return COLORS.status.warning;
      default: return COLORS.chips.inactive;
    }
  };

  const inputStyle = {
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
      '&::placeholder': { color: COLORS.text.tertiary, fontSize: '0.75rem' }
    }
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress size={40} sx={{ color: COLORS.primary }} />
        </DialogContent>
      </Dialog>
    );
  }

  if (!job && !loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent>
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>Job not found</Alert>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 1.5 }}>
          <Button onClick={onClose} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (job?.status === 'closed') {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <ArchiveIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
            Job Already Closed
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 3 }}>
            This job opening has already been closed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 1.5, gap: 1 }}>
          <Button onClick={onClose} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Close</Button>
          <Button variant="contained" onClick={handleViewJob} sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem' }}>View Job Details</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
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
            <CloseIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
              Close Job Opening
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={3}>
            {job?.status === 'published' && (
              <Alert severity="warning" icon={<WarningIcon sx={{ fontSize: '0.9rem' }} />} sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                <strong>Warning:</strong> This job is currently published and visible to candidates. Closing it will remove it from all job boards.
              </Alert>
            )}

            <Box sx={{ mb: 2 }}>
              <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />}>
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

            <Box>
              {activeStep === 0 && (
                <Stack spacing={2.5}>
                  <Card sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: 'none' }}>
                    <CardContent>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                        Job Summary
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <List dense disablePadding>
                            <ListItem sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}><WorkIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} /></ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Job ID</Typography>} secondary={<Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{job?.jobId}</Typography>} />
                            </ListItem>
                            <ListItem sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}><LocationIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} /></ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Location</Typography>} secondary={<Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{job?.location}</Typography>} />
                            </ListItem>
                          </List>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <List dense disablePadding>
                            <ListItem sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}><DateRangeIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} /></ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Posted Date</Typography>} secondary={<Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{new Date(job?.createdAt).toLocaleDateString()}</Typography>} />
                            </ListItem>
                            <ListItem sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}><ScheduleIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} /></ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Status</Typography>} secondary={<Chip size="small" label={job?.status} sx={{ bgcolor: getStatusColor(job?.status), color: COLORS.primaryDark, fontSize: '0.65rem', height: 22 }} />} />
                            </ListItem>
                          </List>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <List dense disablePadding>
                            <ListItem sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}><BusinessIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} /></ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Department</Typography>} secondary={<Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{job?.department}</Typography>} />
                            </ListItem>
                            <ListItem sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}><PeopleIcon sx={{ fontSize: '0.9rem', color: COLORS.text.tertiary }} /></ListItemIcon>
                              <ListItemText primary={<Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Applications</Typography>} secondary={<Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{job?.applicationCount || 0}</Typography>} />
                            </ListItem>
                          </List>
                        </Grid>
                      </Grid>

                      {job?.publishTo && job.publishTo.length > 0 && (
                        <>
                          <Divider sx={{ my: 2, borderColor: COLORS.border }} />
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                            Publishing Status
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {job.publishTo.map((platform, idx) => (
                              <Chip
                                key={idx}
                                size="small"
                                label={`${platform.platform}: ${platform.status}`}
                                sx={{
                                  bgcolor: platform.status === 'published' ? COLORS.status.success :
                                          platform.status === 'pending' ? COLORS.status.warning : COLORS.chips.inactive,
                                  color: COLORS.primaryDark,
                                  fontSize: '0.65rem',
                                  height: 24
                                }}
                              />
                            ))}
                          </Stack>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Alert severity="info" icon={<InfoIcon sx={{ fontSize: '0.9rem' }} />} sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                    <strong>What happens when you close this job?</strong>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                      <li>The job will be marked as closed and won't accept new applications</li>
                      <li>It will be removed from all job boards and career page</li>
                    </ul>
                  </Alert>
                </Stack>
              )}

              {activeStep === 1 && (
                <Stack spacing={2.5}>
                  <Box>
                    <Typography sx={labelStyle}>Select Reason for Closing</Typography>
                    <Grid container spacing={2}>
                      {closeReasons.map((reason) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={reason.value}>
                          <CloseReasonCard
                            reason={reason.value}
                            selected={closeReason === reason.value}
                            onSelect={handleReasonSelect}
                            description={reason.description}
                            icon={reason.icon}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    {fieldErrors.closeReason && (
                      <FormHelperText error sx={{ fontSize: '0.65rem', mt: 1 }}>{fieldErrors.closeReason}</FormHelperText>
                    )}
                  </Box>

                  {closeReason === 'Other' && (
                    <Box>
                      <Typography sx={labelStyle}>Specify Reason *</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        onBlur={() => handleBlur('customReason')}
                        placeholder="Please provide details about why this job is being closed..."
                        error={touched.customReason && !!fieldErrors.customReason}
                        helperText={touched.customReason ? fieldErrors.customReason : ''}
                        sx={inputStyle}
                      />
                    </Box>
                  )}

                  <Box>
                    <Typography sx={labelStyle}>Additional Notes (Optional)</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Any additional information about closing this position..."
                      sx={inputStyle}
                    />
                  </Box>
                </Stack>
              )}

              {activeStep === 2 && (
                <Stack spacing={2.5}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: COLORS.primaryLight, borderRadius: 1.5, border: `1px solid ${COLORS.primary}` }}>
                    <CheckCircleIcon sx={{ fontSize: 48, color: COLORS.primary, mb: 1.5 }} />
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: COLORS.text.primary, mb: 1 }}>
                      Job Closed Successfully!
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mb: 3 }}>
                      The job opening has been closed and is no longer accepting applications.
                    </Typography>

                    <Paper sx={{ p: 2, bgcolor: COLORS.background.white, borderRadius: 1.5, mb: 3, border: `1px solid ${COLORS.border}` }}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Job ID</Typography>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{job?.jobId}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Title</Typography>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{job?.title}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Close Reason</Typography>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                            {closeReason === 'Other' ? customReason : closeReason}
                          </Typography>
                        </Stack>
                        {additionalNotes && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Additional Notes</Typography>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{additionalNotes}</Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Paper>

                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        variant="contained"
                        onClick={handleViewJob}
                        startIcon={<VisibilityIcon sx={{ fontSize: '0.9rem' }} />}
                        sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: COLORS.primary, fontSize: '0.7rem', textTransform: 'none' }}
                      >
                        View Job Details
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleGoToJobs}
                        sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', textTransform: 'none' }}
                      >
                        Go to Jobs
                      </Button>
                    </Stack>
                  </Paper>
                </Stack>
              )}
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{success}</Alert>}
          </Stack>
        </DialogContent>

        {activeStep < 2 && (
          <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, justifyContent: 'space-between' }}>
            <Button onClick={onClose} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Cancel</Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep > 0 && (
                <Button onClick={handleBack} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem', fontWeight: 500, textTransform: 'none' }}>Back</Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={closing}
                startIcon={activeStep === 1 ? <WarningIcon sx={{ fontSize: '0.9rem' }} /> : null}
                sx={{
                  height: 32,
                  px: 2,
                  borderRadius: 1.5,
                  bgcolor: activeStep === 1 ? '#EF4444' : COLORS.primary,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': { bgcolor: activeStep === 1 ? '#DC2626' : COLORS.primaryDark }
                }}
              >
                {activeStep === 0 && 'Continue'}
                {activeStep === 1 && 'Review & Close Job'}
              </Button>
            </Box>
          </DialogActions>
        )}
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: COLORS.status.error, color: COLORS.text.light, fontWeight: 600, py: 1.5, px: 2.5 }}>
          Confirm Close Job
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Alert severity="warning" icon={<WarningIcon sx={{ fontSize: '0.9rem' }} />} sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              <strong>Warning:</strong> This action cannot be undone.
            </Alert>

            <Typography sx={{ fontSize: '0.8rem', color: COLORS.text.primary }}>
              Are you sure you want to close this job opening?
            </Typography>

            <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Job</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{job?.jobId} - {job?.title}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Reason</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {closeReason === 'Other' ? customReason : closeReason}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Notify Candidates</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{notifyCandidates ? 'Yes' : 'No'}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>Archive Job</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>{archiveJob ? 'Yes' : 'No'}</Typography>
                </Stack>
              </Stack>
            </Paper>

            {job?.applicationCount > 0 && (
              <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                This job has {job.applicationCount} active application(s). They will be notified if you select the option.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}`, bgcolor: COLORS.background.white, gap: 1 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ height: 32, px: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}`, color: COLORS.text.secondary, fontSize: '0.7rem' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleClose}
            disabled={closing}
            startIcon={closing ? <CircularProgress size={20} /> : <CloseIcon sx={{ fontSize: '0.9rem' }} />}
            sx={{ height: 32, px: 2, borderRadius: 1.5, bgcolor: '#EF4444', fontSize: '0.7rem', '&:hover': { bgcolor: '#DC2626' } }}
          >
            {closing ? 'Closing...' : 'Confirm Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CloseJobOpening;