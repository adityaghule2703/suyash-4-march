// import React from 'react';
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
//   Grid
// } from '@mui/material';
// import { Edit as EditIcon } from '@mui/icons-material';

// const ViewAccident = ({ open, onClose, accident, onEdit }) => {
//   if (!accident) return null;

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case 'Minor': return 'success';
//       case 'Moderate': return 'info';
//       case 'Severe': return 'warning';
//       case 'Fatal': return 'error';
//       default: return 'default';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Open': return 'error';
//       case 'In Progress': return 'warning';
//       case 'Closed': return 'success';
//       default: return 'default';
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
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
//           Accident / Incident Details
//         </div>
//       </DialogTitle>

//       <DialogContent sx={{ pt: 3 }}>
//         <Stack spacing={3}>

//           {/* Basic Info */}
//           <div style={{ marginTop: '16px' }}>
//             <Grid container spacing={3}>

//               <Grid item xs={12} md={6}>
//                 <Typography variant="caption" color="textSecondary">
//                   Employee
//                 </Typography>
//                 <Typography fontWeight={500}>
//                   {accident.employee?.FullName || 'N/A'}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <Typography variant="caption" color="textSecondary">
//                   Date & Time
//                 </Typography>
//                 <Typography>
//                   {formatDate(accident.date)}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <Typography variant="caption" color="textSecondary">
//                   Location
//                 </Typography>
//                 <Typography>
//                   {accident.location}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <Typography variant="caption" color="textSecondary">
//                   Department
//                 </Typography>
//                 <Typography>
//                   {accident.department}
//                 </Typography>
//               </Grid>

//             </Grid>
//           </div>

//           <Divider />

//           {/* Machine Info */}
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Typography variant="caption" color="textSecondary">
//                 Machine ID
//               </Typography>
//               <Typography>{accident.machineId || 'N/A'}</Typography>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Typography variant="caption" color="textSecondary">
//                 Machine Name
//               </Typography>
//               <Typography>{accident.machineName || 'N/A'}</Typography>
//             </Grid>
//           </Grid>

//           <Divider />

//           {/* Injury Info */}
//           <Grid container spacing={3}>

//             <Grid item xs={12} md={6}>
//               <Typography variant="caption" color="textSecondary">
//                 Injury Type
//               </Typography>
//               <Typography>{accident.injuryType}</Typography>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Typography variant="caption" color="textSecondary">
//                 Body Part Affected
//               </Typography>
//               <Typography>{accident.bodyPartAffected}</Typography>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Typography variant="caption" color="textSecondary">
//                 Severity
//               </Typography>
//               <Chip
//                 label={accident.severity}
//                 color={getSeverityColor(accident.severity)}
//                 size="small"
//                 sx={{ fontWeight: 500 }}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Typography variant="caption" color="textSecondary">
//                 Investigation Status
//               </Typography>
//               <Chip
//                 label={accident.investigationStatus}
//                 color={getStatusColor(accident.investigationStatus)}
//                 size="small"
//                 sx={{ fontWeight: 500 }}
//               />
//             </Grid>

//           </Grid>

//           <Divider />

//           {/* Description */}
//           <Stack spacing={2}>
//             <div>
//               <Typography variant="caption" color="textSecondary">
//                 Description
//               </Typography>
//               <Typography sx={{
//                 backgroundColor: '#F8FAFC',
//                 p: 2,
//                 borderRadius: 1,
//                 mt: 1
//               }}>
//                 {accident.description || 'No description provided'}
//               </Typography>
//             </div>

//             <div>
//               <Typography variant="caption" color="textSecondary">
//                 Immediate Action
//               </Typography>
//               <Typography sx={{
//                 backgroundColor: '#F8FAFC',
//                 p: 2,
//                 borderRadius: 1,
//                 mt: 1
//               }}>
//                 {accident.immediateAction || 'N/A'}
//               </Typography>
//             </div>

//             <div>
//               <Typography variant="caption" color="textSecondary">
//                 Root Cause
//               </Typography>
//               <Typography sx={{
//                 backgroundColor: '#F8FAFC',
//                 p: 2,
//                 borderRadius: 1,
//                 mt: 1
//               }}>
//                 {accident.rootCause || 'N/A'}
//               </Typography>
//             </div>
//           </Stack>

//           <Divider />

//           {/* Additional Info */}
//           <Grid container spacing={3}>

//             <Grid item xs={12} md={6}>
//               <Typography variant="caption" color="textSecondary">
//                 Lost Days
//               </Typography>
//               <Typography>{accident.lostDays}</Typography>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Typography variant="caption" color="textSecondary">
//                 Created At
//               </Typography>
//               <Typography>
//                 {formatDate(accident.CreatedAt)}
//               </Typography>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Typography variant="caption" color="textSecondary">
//                 Last Updated
//               </Typography>
//               <Typography>
//                 {formatDate(accident.UpdatedAt)}
//               </Typography>
//             </Grid>

//           </Grid>

//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 3,
//         pb: 3,
//         borderTop: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC'
//       }}>
//         <Button onClick={onClose}>
//           Close
//         </Button>

//         <Button
//           variant="contained"
//           onClick={() => {
//             onClose();
//             onEdit();
//           }}
//           startIcon={<EditIcon />}
//           sx={{
//             backgroundColor: '#1976D2',
//             '&:hover': { backgroundColor: '#1565C0' }
//           }}
//         >
//           Update Investigation
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewAccident;


// import React, { useState } from 'react';
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
//   Box,
//   Paper
// } from '@mui/material';
// import { Edit as EditIcon } from '@mui/icons-material';

// const ViewAccident = ({ open, onClose, accident, onEdit }) => {
//   const [activeStep, setActiveStep] = useState(0);

//   if (!accident) return null;

//   const steps = [
//     'Basic Information',
//     'Injury & Investigation',
//     'Description & Follow-up'
//   ];

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case 'Minor': return 'success';
//       case 'Moderate': return 'info';
//       case 'Severe': return 'warning';
//       case 'Fatal': return 'error';
//       default: return 'default';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Open': return 'error';
//       case 'In Progress': return 'warning';
//       case 'Closed': return 'success';
//       default: return 'default';
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
//     onClose();
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={3}>
//             {/* Basic Info Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//                 📋 Basic Information
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Employee
//                     </Typography>
//                     <Typography variant="body1" fontWeight={500}>
//                       {accident.employee?.FullName || 'N/A'}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Date & Time
//                     </Typography>
//                     <Typography variant="body1">
//                       {formatDate(accident.date)}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Location
//                     </Typography>
//                     <Typography variant="body1">
//                       {accident.location}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Department
//                     </Typography>
//                     <Typography variant="body1">
//                       {accident.department}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Machine Info Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//                 ⚙️ Machine Information
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Machine ID
//                     </Typography>
//                     <Typography variant="body1">{accident.machineId || 'N/A'}</Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Machine Name
//                     </Typography>
//                     <Typography variant="body1">{accident.machineName || 'N/A'}</Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       case 1:
//         return (
//           <Stack spacing={3}>
//             {/* Injury Info Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//                 🤕 Injury Details
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Injury Type
//                     </Typography>
//                     <Typography variant="body1">{accident.injuryType}</Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Body Part Affected
//                     </Typography>
//                     <Typography variant="body1">{accident.bodyPartAffected}</Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Severity
//                     </Typography>
//                     <Chip
//                       label={accident.severity}
//                       color={getSeverityColor(accident.severity)}
//                       size="small"
//                       sx={{ fontWeight: 500, mt: 0.5 }}
//                     />
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Investigation Status
//                     </Typography>
//                     <Chip
//                       label={accident.investigationStatus}
//                       color={getStatusColor(accident.investigationStatus)}
//                       size="small"
//                       sx={{ fontWeight: 500, mt: 0.5 }}
//                     />
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Lost Days
//                     </Typography>
//                     <Typography variant="body1">{accident.lostDays}</Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Stack>
//         );

//       case 2:
//         return (
//           <Stack spacing={3}>
//             {/* Description Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//                 📝 Description
//               </Typography>
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="body2" color="textSecondary" gutterBottom>
//                   Incident Description
//                 </Typography>
//                 <Typography sx={{
//                   backgroundColor: '#F8FAFC',
//                   p: 2,
//                   borderRadius: 1,
//                   minHeight: '80px'
//                 }}>
//                   {accident.description || 'No description provided'}
//                 </Typography>
//               </Box>
//             </Paper>

//             {/* Actions Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//                 ⚡ Actions Taken
//               </Typography>
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="body2" color="textSecondary" gutterBottom>
//                   Immediate Action
//                 </Typography>
//                 <Typography sx={{
//                   backgroundColor: '#F8FAFC',
//                   p: 2,
//                   borderRadius: 1,
//                   minHeight: '60px',
//                   mb: 2
//                 }}>
//                   {accident.immediateAction || 'N/A'}
//                 </Typography>

//                 <Typography variant="body2" color="textSecondary" gutterBottom>
//                   Root Cause
//                 </Typography>
//                 <Typography sx={{
//                   backgroundColor: '#F8FAFC',
//                   p: 2,
//                   borderRadius: 1,
//                   minHeight: '60px'
//                 }}>
//                   {accident.rootCause || 'N/A'}
//                 </Typography>
//               </Box>
//             </Paper>

//             {/* System Info Card */}
//             <Paper sx={{ p: 3, bgcolor: '#FFFFFF' }}>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//                 🕒 System Information
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Created At
//                     </Typography>
//                     <Typography variant="body2">
//                       {formatDate(accident.CreatedAt)}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Last Updated
//                     </Typography>
//                     <Typography variant="body2">
//                       {formatDate(accident.UpdatedAt)}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
//                       Reported By
//                     </Typography>
//                     <Typography variant="body2">
//                       {accident.reportedBy || 'N/A'}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
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
//       maxWidth="sm"
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
//           Accident / Incident Details
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

//         <Box sx={{ minHeight: 450 }}>
//           {getStepContent(activeStep)}
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 3,
//         py: 2,
//         borderTop: '1px solid #E0E0E0',
//         backgroundColor: '#F8FAFC'
//       }}>
//         <Button onClick={handleClose}>
//           Close
//         </Button>

//         <Box sx={{ flex: 1 }} />

//         <Button
//           disabled={activeStep === 0}
//           onClick={handleBack}
//         >
//           Back
//         </Button>

//         {activeStep === steps.length - 1 ? (
//           <Button
//             variant="contained"
//             onClick={handleReset}
//             sx={{ mr: 1 }}
//           >
//             View from Start
//           </Button>
//         ) : (
//           <Button
//             variant="contained"
//             onClick={handleNext}
//           >
//             Next
//           </Button>
//         )}

//         {/* <Button
//           variant="contained"
//           onClick={() => {
//             handleClose();
//             onEdit();
//           }}
//           startIcon={<EditIcon />}
//           sx={{
//             backgroundColor: '#1976D2',
//             '&:hover': { backgroundColor: '#1565C0' },
//             ml: 2
//           }}
//         >
//           Update Investigation
//         </Button> */}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewAccident;


import React, { useState } from 'react';
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
  Box,
  Paper,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  Description as DescriptionIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

// Color constants matching CompanyMaster
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
    tableHeader: '#063C3F',
    paper: '#F8FAFC'
  },
  border: '#E3E8EF',
  chips: {
    minor: '#9FE2BF',
    moderate: '#FEF3C7',
    severe: '#FEE2E2',
    fatal: '#FEE2E2',
    open: '#FEE2E2',
    investigating: '#FEF3C7',
    closed: '#9FE2BF'
  }
};

const ViewAccident = ({ open, onClose, accident, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!accident) return null;

  const steps = [
    'Basic Information',
    'Injury & Investigation',
    'Description & Follow-up'
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getSeverityStyle = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'minor':
        return { bgcolor: COLORS.chips.minor, color: '#166534', border: `1px solid ${COLORS.chips.minor}` };
      case 'moderate':
        return { bgcolor: COLORS.chips.moderate, color: '#92400e', border: `1px solid ${COLORS.chips.moderate}` };
      case 'severe':
        return { bgcolor: COLORS.chips.severe, color: '#991b1b', border: `1px solid ${COLORS.chips.severe}` };
      case 'fatal':
        return { bgcolor: COLORS.chips.fatal, color: '#991b1b', border: `1px solid ${COLORS.chips.fatal}` };
      default:
        return { bgcolor: COLORS.primaryLight, color: COLORS.text.primary, border: `1px solid ${COLORS.primaryLight}` };
    }
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'open':
        return { bgcolor: COLORS.chips.open, color: '#991b1b', border: `1px solid ${COLORS.chips.open}` };
      case 'investigating':
      case 'in progress':
        return { bgcolor: COLORS.chips.investigating, color: '#92400e', border: `1px solid ${COLORS.chips.investigating}` };
      case 'closed':
        return { bgcolor: COLORS.chips.closed, color: '#166534', border: `1px solid ${COLORS.chips.closed}` };
      default:
        return { bgcolor: COLORS.primaryLight, color: COLORS.text.primary, border: `1px solid ${COLORS.primaryLight}` };
    }
  };

  const getEmployeeName = (employee) => {
    if (!employee) return '-';
    if (employee.FullName) return employee.FullName;
    if (employee.FirstName && employee.LastName) {
      return `${employee.FirstName} ${employee.LastName}`;
    }
    return employee.name || employee.FirstName || '-';
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const handleEdit = () => {
    handleClose();
    onEdit();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2.5}>
            {/* Basic Info Card */}
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ 
                color: COLORS.primary,
                fontSize: '0.8rem',
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <PersonIcon sx={{ fontSize: '1rem' }} />
                Basic Information
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Employee
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontWeight: 500, fontSize: '0.75rem' }}>
                      {getEmployeeName(accident.employee)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Date & Time
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {formatDate(accident.date)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {accident.location || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Department
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {accident.department || '-'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Machine Info Card */}
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ 
                color: COLORS.primary,
                fontSize: '0.8rem',
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <BusinessIcon sx={{ fontSize: '1rem' }} />
                Machine Information
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Machine ID
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {accident.machineId || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Machine Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {accident.machineName || '-'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2.5}>
            {/* Injury Info Card */}
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ 
                color: COLORS.primary,
                fontSize: '0.8rem',
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <WarningIcon sx={{ fontSize: '1rem' }} />
                Injury Details
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Injury Type
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {accident.injuryType || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Body Part Affected
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {accident.bodyPartAffected || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Severity
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          ...getSeverityStyle(accident.severity)
                        }}
                      >
                        {accident.severity || 'Minor'}
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Investigation Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          ...getStatusStyle(accident.investigationStatus)
                        }}
                      >
                        {accident.investigationStatus || 'Open'}
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Lost Days
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {accident.lostDays || '0'} days
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Cost Incurred
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {formatCurrency(accident.costIncurred)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={2.5}>
            {/* Description Card */}
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ 
                color: COLORS.primary,
                fontSize: '0.8rem',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <DescriptionIcon sx={{ fontSize: '1rem' }} />
                Description
              </Typography>
              <Box>
                <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                  Incident Description
                </Typography>
                <Typography sx={{
                  backgroundColor: COLORS.background.light,
                  p: 2,
                  borderRadius: 1.5,
                  minHeight: '60px',
                  fontSize: '0.75rem',
                  color: COLORS.text.primary,
                  border: `1px solid ${COLORS.border}`,
                  mt: 0.5
                }}>
                  {accident.description || 'No description provided'}
                </Typography>
              </Box>
            </Paper>

            {/* Actions Card */}
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ 
                color: COLORS.primary,
                fontSize: '0.8rem',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <WarningIcon sx={{ fontSize: '1rem' }} />
                Actions Taken
              </Typography>
              
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                  Immediate Action
                </Typography>
                <Typography sx={{
                  backgroundColor: COLORS.background.light,
                  p: 2,
                  borderRadius: 1.5,
                  minHeight: '50px',
                  fontSize: '0.75rem',
                  color: COLORS.text.primary,
                  border: `1px solid ${COLORS.border}`,
                  mt: 0.5
                }}>
                  {accident.immediateAction || 'No immediate action recorded'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                  Root Cause
                </Typography>
                <Typography sx={{
                  backgroundColor: COLORS.background.light,
                  p: 2,
                  borderRadius: 1.5,
                  minHeight: '50px',
                  fontSize: '0.75rem',
                  color: COLORS.text.primary,
                  border: `1px solid ${COLORS.border}`,
                  mt: 0.5
                }}>
                  {accident.rootCause || 'Root cause not identified'}
                </Typography>
              </Box>
            </Paper>

            {/* System Info Card */}
            <Paper sx={{ 
              p: 2.5, 
              bgcolor: COLORS.background.white,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ 
                color: COLORS.primary,
                fontSize: '0.8rem',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <TimeIcon sx={{ fontSize: '1rem' }} />
                System Information
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Reported By
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {accident.reportedBy || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Created At
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {formatDate(accident.CreatedAt)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Typography variant="caption" sx={{ color: COLORS.text.tertiary, fontSize: '0.65rem' }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                      {formatDate(accident.UpdatedAt)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${COLORS.border}`
        } 
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.background.light,
        py: 2,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" sx={{ 
          fontSize: '1rem',
          fontWeight: 600,
          color: COLORS.primary
        }}>
          Accident / Incident Details
        </Typography>
        <IconButton 
          onClick={handleClose}
          size="small"
          sx={{
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, px: 3, pb: 2 }}>
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 3,
            mt: 0.5,
            '& .MuiStepLabel-label': {
              fontSize: '0.75rem',
              color: COLORS.text.secondary
            },
            '& .MuiStepLabel-label.Mui-active': {
              color: COLORS.primary,
              fontWeight: 600
            },
            '& .MuiStepLabel-label.Mui-completed': {
              color: COLORS.text.primary
            },
            '& .MuiSvgIcon-root.Mui-active': {
              color: COLORS.primary
            },
            '& .MuiSvgIcon-root.Mui-completed': {
              color: COLORS.primary
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
          {getStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.background.light,
        gap: 1
      }}>
        <Button 
          onClick={handleClose}
          sx={{
            color: COLORS.text.secondary,
            fontSize: '0.75rem',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{
            color: COLORS.primary,
            fontSize: '0.75rem',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{
              bgcolor: COLORS.primary,
              fontSize: '0.75rem',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: COLORS.primaryDark
              }
            }}
          >
            View from Start
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              bgcolor: COLORS.primary,
              fontSize: '0.75rem',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: COLORS.primaryDark
              }
            }}
          >
            Next
          </Button>
        )}

        {/* <Button
          variant="contained"
          onClick={handleEdit}
          startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            bgcolor: COLORS.primary,
            fontSize: '0.75rem',
            textTransform: 'none',
            fontWeight: 500,
            ml: 1,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark
            }
          }}
        >
          Update Investigation
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ViewAccident;