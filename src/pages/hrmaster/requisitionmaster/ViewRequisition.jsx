// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Alert,
//   Grid,
//   Chip,
//   Box,
//   Typography,
//   Paper,
//   IconButton,
//   Avatar,
//   Card,
//   CardContent,
//   Stepper,
//   Step,
//   StepLabel,
//   Stack
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Edit as EditIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Business as BusinessIcon,
//   LocationOn as LocationIcon,
//   Work as WorkIcon,
//   School as SchoolIcon,
//   TrendingUp as TrendingUpIcon,
//   MonetizationOn as MonetizationIcon,
//   Description as DescriptionIcon,
//   Assignment as AssignmentIcon,
//   CheckCircle as CheckCircleIcon,
//   Pending as PendingIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../../config/Config';
// import { format } from 'date-fns';

// const steps = ['Draft', 'Pending Approval', 'Approved', 'Filled'];

// const ViewRequisition = ({ open, onClose, requisitionId, onEdit }) => {
//   const [requisition, setRequisition] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeStep, setActiveStep] = useState(0);

//   useEffect(() => {
//     if (open && requisitionId) {
//       fetchRequisitionDetails();
//     }
//   }, [open, requisitionId]);

//   const fetchRequisitionDetails = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/requisitions/${requisitionId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         setRequisition(response.data.data);
//         setActiveStep(getStepFromStatus(response.data.data.status));
//       } else {
//         setError(response.data.message || 'Failed to fetch requisition details');
//       }
//     } catch (err) {
//       console.error('Error fetching requisition:', err);
//       setError(err.response?.data?.message || 'Failed to fetch requisition details. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStepFromStatus = (status) => {
//     const statusSteps = {
//       'draft': 0,
//       'pending_approval': 1,
//       'approved': 2,
//       'in_progress': 2,
//       'filled': 3,
//       'rejected': 1,
//       'closed': 3
//     };
//     return statusSteps[status?.toLowerCase()] || 0;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return format(new Date(dateString), 'dd MMM yyyy');
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       draft: { bg: '#FFF3E0', color: '#E65100', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
//       pending_approval: { bg: '#FFF3E0', color: '#E65100', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
//       approved: { bg: '#E8F5E9', color: '#2E7D32', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
//       rejected: { bg: '#FFEBEE', color: '#C62828', icon: <CloseIcon sx={{ fontSize: 14 }} /> },
//       in_progress: { bg: '#E3F2FD', color: '#1976D2', icon: <TrendingUpIcon sx={{ fontSize: 14 }} /> },
//       filled: { bg: '#E8F5E9', color: '#2E7D32', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
//       closed: { bg: '#F5F5F5', color: '#616161', icon: <CloseIcon sx={{ fontSize: 14 }} /> }
//     };
//     return colors[status?.toLowerCase()] || { bg: '#F5F5F5', color: '#616161', icon: <PendingIcon sx={{ fontSize: 14 }} /> };
//   };

//   const getPriorityColor = (priority) => {
//     const colors = {
//       low: '#4CAF50',
//       medium: '#FF9800',
//       high: '#F44336',
//       critical: '#9C27B0'
//     };
//     return colors[priority?.toLowerCase()] || '#757575';
//   };

// const StatCard = ({ icon, label, value, color }) => (
//   <Card sx={{ 
//     backgroundColor: '#F8FAFC',
//     border: '1px solid #E0E0E0',
//     borderRadius: 1,
//     boxShadow: 'none'
//   }}>
//     <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
//       <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}>
//         {icon}
//       </Avatar>
//       <Box>
//         <Typography variant="caption" sx={{ color: '#666', display: 'block' }} component="span">
//           {label}
//         </Typography>
//         <Typography variant="body2" sx={{ fontWeight: 600, color: '#101010' }} component="div">
//           {value}
//         </Typography>
//       </Box>
//     </CardContent>
//   </Card>
// );

//   const InfoRow = ({ icon, label, value }) => (
//     <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
//       <Box sx={{ color: '#1976D2', minWidth: 20, display: 'flex', justifyContent: 'center' }}>
//         {icon}
//       </Box>
//       <Box sx={{ flex: 1 }}>
//         <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//           {label}
//         </Typography>
//         <Typography variant="body2" sx={{ color: '#101010', fontWeight: 500 }}>
//           {value || 'N/A'}
//         </Typography>
//       </Box>
//     </Box>
//   );

//   const Section = ({ title, children }) => (
//     <Paper sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//       <Typography variant="subtitle2" sx={{ color: '#1976D2', mb: 1, fontWeight: 600, fontSize: '0.9rem' }}>
//         {title}
//       </Typography>
//       {children}
//     </Paper>
//   );

//   const nextStep = () => setActiveStep((prev) => prev + 1);
//   const backStep = () => setActiveStep((prev) => prev - 1);

//   if (!requisition && !loading) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           maxHeight: '90vh',
//           display: 'flex',
//           flexDirection: 'column'
//         }
//       }}
//     >
//       {/* HEADER with gradient background like ViewSalary */}
//       <DialogTitle
//         sx={{
//           background: 'linear-gradient(135deg,#164e63,#0ea5e9)',
//           color: '#fff',
//           fontSize: 20,
//           fontWeight: 600,
//           py: 2
//         }}
//       >
//         Requisition Details – {requisition?.requisitionId || ''}
//       </DialogTitle>

//       {/* STEPPER - exactly like ViewSalary */}
//       {requisition && (
//         <Box sx={{ px: 4, pt: 3 }}>
//           <Stepper activeStep={activeStep} alternativeLabel>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Box>
//       )}

//       <DialogContent sx={{ px: 4, py: 3, overflow: 'auto', flexGrow: 1 }}>
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
//             <Typography variant="body2" sx={{ color: '#666' }}>
//               Loading requisition details...
//             </Typography>
//           </Box>
//         ) : error ? (
//           <Alert severity="error" sx={{ borderRadius: 1 }}>{error}</Alert>
//         ) : requisition && (
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//             {/* STEP 1 - Basic Information */}
//             {activeStep === 0 && (
//               <>
//                 {/* Status Cards */}
//                 <Grid container spacing={1}>
//                   <Grid size={{ xs: 6, sm: 3 }}>
//                     <StatCard
//                       icon={<AssignmentIcon sx={{ fontSize: 16 }} />}
//                       label="Status"
//                       value={
//                         <Chip
//                           label={requisition.status?.replace('_', ' ') || 'DRAFT'}
//                           size="small"
//                           icon={getStatusColor(requisition.status).icon}
//                           sx={{
//                             backgroundColor: getStatusColor(requisition.status).bg,
//                             color: getStatusColor(requisition.status).color,
//                             fontWeight: 600,
//                             fontSize: '11px',
//                             height: 22
//                           }}
//                         />
//                       }
//                       color="#1976D2"
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 6, sm: 3 }}>
//                     <StatCard
//                       icon={<WorkIcon sx={{ fontSize: 16 }} />}
//                       label="Positions"
//                       value={`${requisition.hiredPositions || 0}/${requisition.noOfPositions}`}
//                       color="#2E7D32"
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 6, sm: 3 }}>
//                     <StatCard
//                       icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
//                       label="Priority"
//                       value={
//                         <Chip
//                           label={requisition.priority || 'MEDIUM'}
//                           size="small"
//                           sx={{
//                             backgroundColor: `${getPriorityColor(requisition.priority)}20`,
//                             color: getPriorityColor(requisition.priority),
//                             fontWeight: 600,
//                             fontSize: '11px',
//                             height: 22
//                           }}
//                         />
//                       }
//                       color="#FF9800"
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 6, sm: 3 }}>
//                     <StatCard
//                       icon={<CalendarIcon sx={{ fontSize: 16 }} />}
//                       label="Target Date"
//                       value={formatDate(requisition.targetHireDate)}
//                       color="#F44336"
//                     />
//                   </Grid>
//                 </Grid>

//                 {/* Basic Information */}
//                 <Section title="Basic Information">
//                   <Grid container spacing={1}>
//                     <Grid size={{ xs: 6 }}>
//                       <InfoRow
//                         icon={<BusinessIcon sx={{ fontSize: 16 }} />}
//                         label="Department"
//                         value={requisition.department}
//                       />
//                     </Grid>
//                     <Grid size={{ xs: 6 }}>
//                       <InfoRow
//                         icon={<LocationIcon sx={{ fontSize: 16 }} />}
//                         label="Location"
//                         value={requisition.location}
//                       />
//                     </Grid>
//                     <Grid size={{ xs: 6 }}>
//                       <InfoRow
//                         icon={<WorkIcon sx={{ fontSize: 16 }} />}
//                         label="Position Title"
//                         value={requisition.positionTitle}
//                       />
//                     </Grid>
//                     <Grid size={{ xs: 6 }}>
//                       <InfoRow
//                         icon={<PersonIcon sx={{ fontSize: 16 }} />}
//                         label="Employment Type"
//                         value={requisition.employmentType}
//                       />
//                     </Grid>
//                     <Grid size={{ xs: 12 }}>
//                       <InfoRow
//                         icon={<AssignmentIcon sx={{ fontSize: 16 }} />}
//                         label="Reason for Hire"
//                         value={requisition.reasonForHire}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Section>
//               </>
//             )}

//             {/* STEP 2 - Qualifications & Budget */}
//             {activeStep === 1 && (
//               <Section title="Qualifications & Budget">
//                 <Grid container spacing={1}>
//                   <Grid size={{ xs: 6 }}>
//                     <InfoRow
//                       icon={<SchoolIcon sx={{ fontSize: 16 }} />}
//                       label="Education"
//                       value={requisition.education}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 6 }}>
//                     <InfoRow
//                       icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
//                       label="Experience"
//                       value={`${requisition.experienceYears} years`}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 6 }}>
//                     <InfoRow
//                       icon={<MonetizationIcon sx={{ fontSize: 16 }} />}
//                       label="Budget Range"
//                       value={`₹${requisition.budgetMin?.toLocaleString()} - ₹${requisition.budgetMax?.toLocaleString()}`}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 6 }}>
//                     <InfoRow
//                       icon={<AssignmentIcon sx={{ fontSize: 16 }} />}
//                       label="Grade"
//                       value={requisition.grade}
//                     />
//                   </Grid>
//                 </Grid>
//               </Section>
//             )}

//             {/* STEP 3 - Additional Details */}
//             {activeStep === 2 && (
//               <Stack spacing={3}>
//                 {/* Skills Section */}
//                 {requisition.skills && requisition.skills.length > 0 && (
//                   <Section title="Required Skills">
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                       {requisition.skills.map((skill) => (
//                         <Chip
//                           key={skill}
//                           label={skill}
//                           size="small"
//                           sx={{
//                             backgroundColor: '#E3F2FD',
//                             color: '#1976D2',
//                             fontWeight: 500,
//                             height: 22,
//                             fontSize: '11px'
//                           }}
//                         />
//                       ))}
//                     </Box>
//                   </Section>
//                 )}

//                 {/* Justification */}
//                 <Section title="Justification">
//                   <Typography variant="body2" sx={{ color: '#333', fontSize: '0.8rem' }}>
//                     {requisition.justification}
//                   </Typography>
//                 </Section>

//                 {/* Attachments */}
//                 {requisition.attachments && requisition.attachments.length > 0 && (
//                   <Section title="Attachments">
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                       {requisition.attachments.map((attachment, index) => (
//                         <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                           <DescriptionIcon sx={{ color: '#666', fontSize: 14 }} />
//                           <Typography variant="caption" sx={{ color: '#1976D2', textDecoration: 'underline', cursor: 'pointer' }}>
//                             {attachment.filename || `Attachment ${index + 1}`}
//                           </Typography>
//                         </Box>
//                       ))}
//                     </Box>
//                   </Section>
//                 )}

//                 {/* Comments */}
//                 {requisition.comments && requisition.comments.length > 0 && (
//                   <Section title="Comments">
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                       {requisition.comments.map((comment, index) => (
//                         <Paper key={index} sx={{ p: 1, backgroundColor: '#F8FAFC', borderRadius: 1 }}>
//                           <Typography variant="caption" sx={{ color: '#333', display: 'block', mb: 0.5 }}>
//                             {comment.text}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
//                             By {comment.userName || 'Unknown'} • {formatDateTime(comment.createdAt)}
//                           </Typography>
//                         </Paper>
//                       ))}
//                     </Box>
//                   </Section>
//                 )}

//                 {/* Created By Info */}
//                 <Paper sx={{ p: 1.5, backgroundColor: '#F8FAFC', borderRadius: 1, border: '1px solid #E0E0E0' }}>
//                   <Grid container spacing={1}>
//                     <Grid size={{ xs: 6 }}>
//                       <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//                         Created By
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#101010', fontSize: '0.8rem' }}>
//                         {requisition.createdByName || requisition.createdBy?.Username || 'N/A'}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
//                         Role: {requisition.createdByRole || 'N/A'}
//                       </Typography>
//                     </Grid>
//                     <Grid size={{ xs: 6 }}>
//                       <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
//                         Created At
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#101010', fontSize: '0.8rem' }}>
//                         {formatDateTime(requisition.createdAt)}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
//                         Updated: {formatDateTime(requisition.updatedAt)}
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Paper>
//               </Stack>
//             )}
//           </Box>
//         )}
//       </DialogContent>

//       {/* ACTIONS - exactly like ViewSalary */}
//       <DialogActions sx={{ px: 4, pb: 3 }}>
//         <Button onClick={onClose}>Close</Button>

//         {activeStep > 0 && (
//           <Button onClick={backStep}>Back</Button>
//         )}

//         {activeStep < 2 && (
//           <Button variant="contained" onClick={nextStep}>
//             Next
//           </Button>
//         ) }
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewRequisition;


import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Grid,
  Chip,
  Box,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Divider,
  styled,
  StepConnector,
  stepConnectorClasses,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
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

const steps = ['Basic Info', 'Qualifications & Budget', 'Additional Details'];

const ViewRequisition = ({ open, onClose, requisitionId, onEdit }) => {
  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open && requisitionId) {
      fetchRequisitionDetails();
    }
  }, [open, requisitionId]);

  const fetchRequisitionDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/requisitions/${requisitionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setRequisition(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch requisition details');
      }
    } catch (err) {
      console.error('Error fetching requisition:', err);
      setError(err.response?.data?.message || 'Failed to fetch requisition details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      draft: { bg: COLORS.status.warning, color: '#92400E', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: 'Draft' },
      pending_approval: { bg: COLORS.status.warning, color: '#92400E', icon: <PendingIcon sx={{ fontSize: '0.7rem' }} />, label: 'Pending Approval' },
      approved: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Approved' },
      rejected: { bg: COLORS.status.error, color: '#991B1B', icon: <CloseIcon sx={{ fontSize: '0.7rem' }} />, label: 'Rejected' },
      in_progress: { bg: COLORS.status.info, color: COLORS.primaryDark, icon: <TrendingUpIcon sx={{ fontSize: '0.7rem' }} />, label: 'In Progress' },
      filled: { bg: COLORS.status.success, color: COLORS.primaryDark, icon: <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />, label: 'Filled' },
      closed: { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <CloseIcon sx={{ fontSize: '0.7rem' }} />, label: 'Closed' }
    };
    return styles[status?.toLowerCase()] || { bg: COLORS.chips.inactive, color: COLORS.text.secondary, icon: <InfoIcon sx={{ fontSize: '0.7rem' }} />, label: status || 'Unknown' };
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'low': return '#2E7D32';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#9C27B0';
      default: return COLORS.text.secondary;
    }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <Card sx={{ 
      bgcolor: COLORS.background.light,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 1.5,
      boxShadow: 'none'
    }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
        <Avatar sx={{ bgcolor: color, width: 32, height: 32 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
      <Box sx={{ color: COLORS.primary, minWidth: 24, display: 'flex', justifyContent: 'center' }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mb: 0.25 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, fontWeight: 500 }}>
          {value || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );

  const Section = ({ title, children }) => (
    <Paper sx={{ 
      p: 2, 
      bgcolor: COLORS.background.white, 
      borderRadius: 1.5, 
      border: `1px solid ${COLORS.border}`,
      boxShadow: 'none'
    }}>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.primary, mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  if (!requisition && !loading) return null;

  const statusStyle = getStatusStyle(requisition?.status);

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: COLORS.text.secondary,
    letterSpacing: '0.5px',
    mb: 0.5
  };

  return (
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
          <AssignmentIcon sx={{ fontSize: '1rem', color: COLORS.primary }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Requisition Details
          </Typography>
          {requisition && (
            <Chip
              label={requisition.requisitionId}
              size="small"
              sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: 500, fontSize: '0.65rem', height: 24 }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: '1rem', color: COLORS.text.secondary }} />
        </IconButton>
      </DialogTitle>

      {requisition && (
        <Box sx={{ px: 2.5, pt: 2, bgcolor: COLORS.background.white }}>
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
      )}

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>{error}</Alert>
        ) : requisition ? (
          <Stack spacing={2.5}>
            {/* Status Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                  icon={<AssignmentIcon sx={{ fontSize: '0.9rem', color: COLORS.text.light }} />}
                  label="Status"
                  value={
                    <Chip
                      label={statusStyle.label}
                      size="small"
                      icon={statusStyle.icon}
                      sx={{
                        bgcolor: statusStyle.bg,
                        color: statusStyle.color,
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        height: 24
                      }}
                    />
                  }
                  color={COLORS.primary}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                  icon={<WorkIcon sx={{ fontSize: '0.9rem', color: COLORS.text.light }} />}
                  label="Positions"
                  value={`${requisition.hiredPositions || 0}/${requisition.noOfPositions}`}
                  color="#2E7D32"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                  icon={<TrendingUpIcon sx={{ fontSize: '0.9rem', color: COLORS.text.light }} />}
                  label="Priority"
                  value={
                    <Chip
                      label={requisition.priority || 'MEDIUM'}
                      size="small"
                      sx={{
                        bgcolor: `${getPriorityColor(requisition.priority)}20`,
                        color: getPriorityColor(requisition.priority),
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        height: 24
                      }}
                    />
                  }
                  color="#F59E0B"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                  icon={<CalendarIcon sx={{ fontSize: '0.9rem', color: COLORS.text.light }} />}
                  label="Target Date"
                  value={formatDate(requisition.targetHireDate)}
                  color="#EF4444"
                />
              </Grid>
            </Grid>

            {activeStep === 0 && (
              <>
                <Section title="Basic Information">
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <InfoRow
                        icon={<BusinessIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Department"
                        value={requisition.department}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <InfoRow
                        icon={<LocationIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Location"
                        value={requisition.location}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <InfoRow
                        icon={<WorkIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Position Title"
                        value={requisition.positionTitle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <InfoRow
                        icon={<PersonIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Employment Type"
                        value={requisition.employmentType}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <InfoRow
                        icon={<AssignmentIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Reason for Hire"
                        value={requisition.reasonForHire}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <InfoRow
                        icon={<InfoIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Grade"
                        value={requisition.grade}
                      />
                    </Grid>
                  </Grid>
                </Section>

                <Section title="Created By">
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Name</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, fontWeight: 500 }}>
                        {requisition.createdByName || requisition.createdBy?.Username || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Role</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {requisition.createdByRole || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Created At</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formatDateTime(requisition.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={labelStyle}>Last Updated</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {formatDateTime(requisition.updatedAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Section>
              </>
            )}

            {activeStep === 1 && (
              <>
                <Section title="Qualifications & Budget">
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <InfoRow
                        icon={<SchoolIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Education"
                        value={requisition.education}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <InfoRow
                        icon={<TrendingUpIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Experience"
                        value={`${requisition.experienceYears} years`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <InfoRow
                        icon={<MonetizationIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Budget Range"
                        value={`₹${requisition.budgetMin?.toLocaleString()} - ₹${requisition.budgetMax?.toLocaleString()}`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <InfoRow
                        icon={<AssignmentIcon sx={{ fontSize: '0.9rem' }} />}
                        label="Grade"
                        value={requisition.grade}
                      />
                    </Grid>
                  </Grid>
                </Section>

                <Section title="Justification">
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, lineHeight: 1.6 }}>
                    {requisition.justification}
                  </Typography>
                </Section>
              </>
            )}

            {activeStep === 2 && (
              <>
                {requisition.skills && requisition.skills.length > 0 && (
                  <Section title="Required Skills">
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {requisition.skills.map((skill) => (
                        <Chip
                          key={skill}
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
                  </Section>
                )}

                {requisition.comments && requisition.comments.length > 0 && (
                  <Section title="Comments">
                    <Stack spacing={1.5}>
                      {requisition.comments.map((comment, index) => (
                        <Paper key={index} sx={{ p: 1.5, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, mb: 0.5 }}>
                            {comment.text}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                            By {comment.userName || 'Unknown'} • {formatDateTime(comment.createdAt)}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Section>
                )}
              </>
            )}
          </Stack>
        ) : null}
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
          onClick={onClose}
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
          ) : null}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRequisition;